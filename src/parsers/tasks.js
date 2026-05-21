export function parseTasks(content) {
  const sections = { mustHave: [], shouldHave: [], couldHave: [], wontHave: [] }
  const sectionMap = {
    'must have': 'mustHave',
    'should have': 'shouldHave',
    'could have': 'couldHave',
    "won't have": 'wontHave',
    'wont have': 'wontHave',
  }

  let currentSection = 'mustHave'

  for (const line of content.split('\n')) {
    const sectionMatch = line.match(/^##\s+(.+)/)
    if (sectionMatch) {
      const key = sectionMatch[1].toLowerCase().replace(/\s*\(.*\)/, '').trim()
      currentSection = sectionMap[key] ?? 'mustHave'
      continue
    }
    const taskMatch = line.match(/^- \[( |x|~)\]\s+(.+)/)
    if (taskMatch) {
      const s = taskMatch[1]
      sections[currentSection].push({
        title: taskMatch[2].trim(),
        status: s === 'x' ? 'done' : s === '~' ? 'in_progress' : 'todo',
      })
    }
  }

  const all = [...sections.mustHave, ...sections.shouldHave, ...sections.couldHave]
  const done = all.filter(t => t.status === 'done').length
  const inProgress = all.filter(t => t.status === 'in_progress').length
  const mustDone = sections.mustHave.filter(t => t.status === 'done').length
  const mustTotal = sections.mustHave.length

  return {
    sections,
    counts: { done, inProgress, todo: all.length - done - inProgress, total: all.length },
    completion: mustTotal > 0 ? Math.round((mustDone / mustTotal) * 100) : 0,
  }
}
