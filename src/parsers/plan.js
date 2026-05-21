export function parsePlan(content) {
  const phases = []
  let current = null

  for (const line of content.split('\n')) {
    const phaseMatch = line.match(/^##\s+(.+)/)
    if (phaseMatch) {
      if (current) phases.push(current)
      current = { name: phaseMatch[1].trim(), steps: [] }
      continue
    }
    if (current) {
      const stepMatch = line.match(/^- \[( |x|~)\]\s+(.+)/)
      if (stepMatch) {
        const s = stepMatch[1]
        current.steps.push({
          title: stepMatch[2].trim(),
          status: s === 'x' ? 'done' : s === '~' ? 'in_progress' : 'todo',
        })
      }
    }
  }
  if (current) phases.push(current)

  for (const phase of phases) {
    const total = phase.steps.length
    const done = phase.steps.filter(s => s.status === 'done').length
    const hasWip = phase.steps.some(s => s.status === 'in_progress')
    phase.status = total === 0 ? 'todo' : done === total ? 'done' : hasWip || done > 0 ? 'in_progress' : 'todo'
    phase.completion = total > 0 ? Math.round((done / total) * 100) : 0
  }

  return { phases }
}
