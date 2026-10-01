import fs from 'fs/promises'
import path from 'path'
import { parseTasks } from './parsers/tasks.js'
import { parsePlan } from './parsers/plan.js'
import { parseLog } from './parsers/log.js'
import { readGitData } from './gitReader.js'

const STALE_DAYS = 14
const DEPLOY_PHASES = ['mvp', 'produção', 'producao']
const QUIET_PHASES = ['pausado', 'produção', 'producao']
const VERSION_RANK = { v2: 0, v1: 1, none: 2 }

async function readFile(p) { return fs.readFile(p, 'utf-8').catch(() => null) }
async function exists(p) { return fs.stat(p).then(() => true, () => false) }

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
  if (tasks?.counts.missingCriteria) missing.push(`${tasks.counts.missingCriteria} task(s) sem critério de done ">"`)

  const deployMissing = [
    !deploy.dockerfile && 'Dockerfile',
    !deploy.envExample && '.env.example',
  ].filter(Boolean)
  if (deployMissing.length && plan?.deploy !== 'local') {
    const msg = `Deploy: falta ${deployMissing.join(', ')}`
    if (DEPLOY_PHASES.includes(plan?.phase)) missing.push(msg)
    else warnings.push(msg)
  }
  if (tasks?.counts.doneWithoutDate) warnings.push(`${tasks.counts.doneWithoutDate} task(s) [x] sem data`)

  const hasAny = Object.values(files).some(Boolean)
  const version = !hasAny ? 'none' : missing.length === 0 ? 'v2' : 'v1'
  return { version, missing, warnings }
}

async function scanProject(dir) {
  const name = path.basename(dir)
  const names = ['SPEC.md', 'PLAN.md', 'TASKS.md', 'CLAUDE.md', 'LOG.md']
  const contents = await Promise.all(names.map(f => readFile(path.join(dir, f))))
  const files = Object.fromEntries(names.map((n, i) => [n, contents[i]]))
  const [spec, plan, tasks, claude, log] = contents

  const [git, dockerfile, envExample, migrations] = await Promise.all([
    readGitData(dir),
    exists(path.join(dir, 'Dockerfile')),
    exists(path.join(dir, '.env.example')),
    exists(path.join(dir, 'migrations')),
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
  const results = await Promise.all(dirs.map(scanProject))
  return results.sort((a, b) =>
    VERSION_RANK[a.compliance.version] - VERSION_RANK[b.compliance.version] ||
    (a.activity.daysIdle ?? Infinity) - (b.activity.daysIdle ?? Infinity)
  )
}
