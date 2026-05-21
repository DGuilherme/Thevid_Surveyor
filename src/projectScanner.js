import fs from 'fs/promises'
import path from 'path'
import { parseTasks } from './parsers/tasks.js'
import { parsePlan } from './parsers/plan.js'
import { readGitData } from './gitReader.js'

async function readFile(p) { return fs.readFile(p, 'utf-8').catch(() => null) }

async function scanProject(dir) {
  const name = path.basename(dir)
  const [spec, plan, tasks, claude] = await Promise.all(
    ['SPEC.md', 'PLAN.md', 'TASKS.md', 'CLAUDE.md'].map(f => readFile(path.join(dir, f)))
  )

  if (!claude) return null

  const git = await readGitData(dir)

  const parsedTasks = tasks ? parseTasks(tasks) : null
  const parsedPlan = plan ? parsePlan(plan) : null
  const contractScore = [spec, plan, tasks, claude].filter(Boolean).length

  return {
    name,
    contractHealth: { spec: !!spec, plan: !!plan, tasks: !!tasks, claude: !!claude },
    contractScore,
    tasks: parsedTasks,
    plan: parsedPlan,
    git,
    specSummary: spec ? spec.split('\n').find(l => l.trim() && !l.startsWith('#'))?.trim() ?? null : null,
  }
}

export async function scanAllProjects(root) {
  const entries = await fs.readdir(root, { withFileTypes: true })
  const dirs = entries.filter(e => e.isDirectory()).map(e => path.join(root, e.name))
  const results = await Promise.all(dirs.map(scanProject))
  return results.filter(Boolean).sort((a, b) => b.contractScore - a.contractScore)
}
