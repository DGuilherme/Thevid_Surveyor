import fs from 'fs/promises'
import path from 'path'
import os from 'os'
import { parseTasks } from './parsers/tasks.js'
import { parsePlan } from './parsers/plan.js'
import { parseLog } from './parsers/log.js'
import { detectStack } from './parsers/stack.js'
import { suggestSkills, SKILLS_CATALOG, isInstalled } from './skillsCatalog.js'
import { readGitData } from './gitReader.js'

const STALE_DAYS = 14
const DEPLOY_PHASES = ['mvp', 'produção', 'producao']
const QUIET_PHASES = ['pausado', 'produção', 'producao']
const VERSION_RANK = { v2: 0, v1: 1, none: 2 }
const SKIP_DIRS = ['node_modules', 'dist', 'build', 'venv']

async function readFile(p) { return fs.readFile(p, 'utf-8').catch(() => null) }
async function exists(p) { return fs.stat(p).then(() => true, () => false) }

async function readJson(p) {
  const raw = await readFile(p)
  try { return raw ? JSON.parse(raw) : null } catch { return null }
}

function enabledPlugins(settings) {
  return Object.entries(settings?.enabledPlugins ?? {}).filter(([, on]) => on).map(([name]) => name)
}

async function stackOf(dir) {
  const [packageJson, requirements, pyproject, dockerfile] = await Promise.all(
    ['package.json', 'requirements.txt', 'pyproject.toml', 'Dockerfile'].map(f => readFile(path.join(dir, f))))
  return detectStack({ packageJson, requirements, pyproject, dockerfile })
}

async function readStack(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [])
  const subdirs = entries.filter(e => e.isDirectory() && !e.name.startsWith('.') && !SKIP_DIRS.includes(e.name))
  const [root, ...subs] = await Promise.all([stackOf(dir), ...subdirs.map(e => stackOf(path.join(dir, e.name)))])
  const sub = Object.fromEntries(subdirs.map((e, i) => [e.name, subs[i]]).filter(([, tags]) => tags.length))
  const all = [...new Set([root, ...Object.values(sub)].flat())]
  return { root, sub, all }
}

async function readInstalledSkills(dir) {
  const claudeDir = path.join(dir, '.claude')
  const [skillDirs, settings, local] = await Promise.all([
    fs.readdir(path.join(claudeDir, 'skills'), { withFileTypes: true }).catch(() => []),
    readJson(path.join(claudeDir, 'settings.json')),
    readJson(path.join(claudeDir, 'settings.local.json')),
  ])
  const skills = skillDirs.filter(e => e.isDirectory()).map(e => e.name)
  return [...new Set([...skills, ...enabledPlugins(settings), ...enabledPlugins(local)])]
}

async function readUserPlugins() {
  return enabledPlugins(await readJson(path.join(os.homedir(), '.claude', 'settings.json')))
}

function daysSince(date) {
  if (!date) return null
  return Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000)
}

function buildCompliance({ files, plan, tasks, deploy }) {
  const missing = []
  const warnings = []

  for (const [name, content] of Object.entries(files)) {
    if (!content) missing.push(`${name} em falta`)
  }
  if (files['PLAN.md'] && !plan?.phase) missing.push('PLAN.md sem cabeçalho "> Fase:"')
  if (files['CLAUDE.md'] && !/LOG\.md/.test(files['CLAUDE.md'])) missing.push('CLAUDE.md sem regras v2 (report no LOG.md)')
  if (tasks?.counts.missingCriteria) missing.push(`${tasks.counts.missingCriteria} task(s) abertas sem critério de done ">"`)

  const deployMissing = [
    !deploy.dockerfile && 'Dockerfile',
    !deploy.envExample && '.env.example',
  ].filter(Boolean)
  if (deployMissing.length && plan?.deploy !== 'local') {
    const msg = `Deploy: falta ${deployMissing.join(', ')}`
    if (DEPLOY_PHASES.includes(plan?.phase)) missing.push(msg)
    else warnings.push(msg)
  }
  if (tasks?.counts.doneWithoutCriteria) warnings.push(`${tasks.counts.doneWithoutCriteria} task(s) [x] sem critério`)
  if (tasks?.counts.doneWithoutDate) warnings.push(`${tasks.counts.doneWithoutDate} task(s) [x] sem data`)

  const hasAny = Object.values(files).some(Boolean)
  const version = !hasAny ? 'none' : missing.length === 0 ? 'v2' : 'v1'
  return { version, missing, warnings }
}

async function scanProject(dir, userPlugins) {
  const name = path.basename(dir)
  const names = ['SPEC.md', 'PLAN.md', 'TASKS.md', 'CLAUDE.md', 'LOG.md']
  const contents = await Promise.all(names.map(f => readFile(path.join(dir, f))))
  const files = Object.fromEntries(names.map((n, i) => [n, contents[i]]))
  const [spec, plan, tasks, claude, log] = contents

  const [git, dockerfile, envExample, migrations, stack, installedSkills] = await Promise.all([
    readGitData(dir),
    exists(path.join(dir, 'Dockerfile')),
    exists(path.join(dir, '.env.example')),
    exists(path.join(dir, 'migrations')),
    readStack(dir),
    readInstalledSkills(dir),
  ])

  const parsedTasks = tasks ? parseTasks(tasks) : null
  const parsedPlan = plan ? parsePlan(plan) : null
  const parsedLog = log ? parseLog(log) : null
  const deploy = { dockerfile, envExample, migrations }
  const compliance = buildCompliance({ files, plan: parsedPlan, tasks: parsedTasks, deploy })

  const lastCommitAt = git?.lastCommit?.date ?? null
  const lastLogAt = parsedLog?.lastDate ?? null
  const idles = [daysSince(lastCommitAt), daysSince(lastLogAt)].filter(d => d !== null)
  const daysIdle = idles.length ? Math.min(...idles) : null
  const phase = parsedPlan?.phase ?? null

  return {
    name,
    contractHealth: { spec: !!spec, plan: !!plan, tasks: !!tasks, claude: !!claude, log: !!log },
    contractScore: contents.filter(Boolean).length,
    compliance,
    phase,
    url: parsedPlan?.url ?? null,
    activity: {
      lastCommitAt,
      lastLogAt,
      daysIdle,
      stale: daysIdle !== null && daysIdle > STALE_DAYS && !QUIET_PHASES.includes(phase),
    },
    deploy,
    stack,
    skills: {
      installed: installedSkills,
      global: SKILLS_CATALOG.filter(e => isInstalled(e, userPlugins)).map(e => e.name),
      suggested: suggestSkills({ stack, phase, installed: installedSkills, global: userPlugins }),
    },
    tasks: parsedTasks,
    plan: parsedPlan,
    log: parsedLog,
    git,
    specSummary: spec ? spec.split(/\r?\n/).find(l => l.trim() && !l.startsWith('#') && !l.startsWith('>'))?.trim() ?? null : null,
  }
}

export async function scanAllProjects(root) {
  const entries = await fs.readdir(root, { withFileTypes: true })
  const dirs = entries
    .filter(e => e.isDirectory() && !e.name.startsWith('.'))
    .map(e => path.join(root, e.name))
  const userPlugins = await readUserPlugins()
  const results = await Promise.all(dirs.map(d => scanProject(d, userPlugins)))
  return results.sort((a, b) =>
    VERSION_RANK[a.compliance.version] - VERSION_RANK[b.compliance.version] ||
    (a.activity.daysIdle ?? Infinity) - (b.activity.daysIdle ?? Infinity)
  )
}
