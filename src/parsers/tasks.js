const STATUS = { x: 'done', '~': 'in_progress', '!': 'blocked', ' ': 'todo' }

export function parseTasks(content) {
  const sections = { mustHave: [], shouldHave: [], couldHave: [], wontHave: [], manualTasks: [] }
  const sectionMap = {
    'must have': 'mustHave',
    'should have': 'shouldHave',
    'could have': 'couldHave',
    "won't have": 'wontHave',
    'wont have': 'wontHave',
    'tarefas manuais': 'manualTasks',
    'manual tasks': 'manualTasks',
  }

  let currentSection = 'mustHave'
  let lastTask = null

  for (const line of content.split(/\r?\n/)) {
    const sectionMatch = line.match(/^##\s+(.+)/)
    if (sectionMatch) {
      const key = sectionMatch[1].toLowerCase().replace(/\s*\(.*\)/, '').trim()
      currentSection = sectionMap[key] ?? currentSection
      lastTask = null
      continue
    }
    const taskMatch = line.match(/^- \[( |x|~|!)\]\s+(.+)/)
    if (taskMatch) {
      let title = taskMatch[2].trim()
      const dateMatch = title.match(/\s*\((\d{4}-\d{2}-\d{2})\)$/)
      if (dateMatch) title = title.slice(0, dateMatch.index).trim()
      lastTask = {
        title,
        status: STATUS[taskMatch[1]],
        doneAt: dateMatch?.[1] ?? null,
        criterion: null,
      }
      sections[currentSection].push(lastTask)
      continue
    }
    const criterionMatch = line.match(/^\s*>\s*(.+)/)
    if (criterionMatch && lastTask && !lastTask.criterion) {
      lastTask.criterion = criterionMatch[1].trim()
      continue
    }
    if (line.trim()) lastTask = null
  }

  const all = [...sections.mustHave, ...sections.shouldHave, ...sections.couldHave]
  const count = s => all.filter(t => t.status === s).length
  const done = count('done')
  const inProgress = count('in_progress')
  const blocked = count('blocked')
  const mustDone = sections.mustHave.filter(t => t.status === 'done').length
  const mustTotal = sections.mustHave.length

  return {
    sections,
    manualTasks: sections.manualTasks,
    counts: {
      done,
      inProgress,
      blocked,
      todo: all.length - done - inProgress - blocked,
      total: all.length,
      missingCriteria: all.filter(t => !t.criterion).length,
      doneWithoutDate: all.filter(t => t.status === 'done' && !t.doneAt).length,
    },
    completion: mustTotal > 0 ? Math.round((mustDone / mustTotal) * 100) : 0,
  }
}
