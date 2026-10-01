const STATUS = { x: 'done', '~': 'in_progress', '!': 'blocked', ' ': 'todo' }

export function parsePlan(content) {
  const phases = []
  let current = null
  let phase = null
  let url = null
  let deploy = null

  for (const line of content.split(/\r?\n/)) {
    if (!current) {
      const faseMatch = line.match(/^>\s*Fase:\s*(.+)/i)
      if (faseMatch && !phase) { phase = faseMatch[1].trim().toLowerCase(); continue }
      const urlMatch = line.match(/^>\s*URL:\s*(https?:\/\/\S+)/i)
      if (urlMatch && !url) { url = urlMatch[1]; continue }
      const deployMatch = line.match(/^>\s*Deploy:\s*(\S+)/i)
      if (deployMatch && !deploy) { deploy = deployMatch[1].toLowerCase(); continue }
    }
    const phaseMatch = line.match(/^##\s+(.+)/)
    if (phaseMatch) {
      if (current) phases.push(current)
      current = { name: phaseMatch[1].trim(), steps: [] }
      continue
    }
    if (current) {
      const stepMatch = line.match(/^- \[( |x|~|!)\]\s+(.+)/)
      if (stepMatch) {
        current.steps.push({ title: stepMatch[2].trim(), status: STATUS[stepMatch[1]] })
      }
    }
  }
  if (current) phases.push(current)

  for (const p of phases) {
    const total = p.steps.length
    const done = p.steps.filter(s => s.status === 'done').length
    const hasWip = p.steps.some(s => s.status === 'in_progress' || s.status === 'blocked')
    p.status = total === 0 ? 'todo' : done === total ? 'done' : hasWip || done > 0 ? 'in_progress' : 'todo'
    p.completion = total > 0 ? Math.round((done / total) * 100) : 0
  }

  return { phase, url, deploy, phases }
}
