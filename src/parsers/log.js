const FIELDS = { feito: 'feito', 'próximo': 'proximo', proximo: 'proximo', bloqueios: 'bloqueios' }

export function parseLog(content, maxEntries = 5) {
  const entries = []
  let current = null
  let field = null

  for (const line of content.split(/\r?\n/)) {
    const headMatch = line.match(/^##\s+(\d{4}-\d{2}-\d{2})\s*(?:[—–-]\s*(.*))?$/)
    if (headMatch) {
      current = { date: headMatch[1], title: headMatch[2]?.trim() ?? '', feito: [], proximo: [], bloqueios: [] }
      entries.push(current)
      field = null
      continue
    }
    if (!current) continue
    const fieldMatch = line.match(/^\**\s*(Feito|Próximo|Proximo|Bloqueios)\s*:?\**\s*:?\s*(.*)$/i)
    if (fieldMatch) {
      field = FIELDS[fieldMatch[1].toLowerCase()]
      const rest = fieldMatch[2].trim()
      if (rest && !/^[—–-]$/.test(rest)) current[field].push(rest)
      continue
    }
    const itemMatch = line.match(/^\s*[-*]\s+(.+)/)
    if (itemMatch && field) current[field].push(itemMatch[1].trim())
  }

  entries.sort((a, b) => b.date.localeCompare(a.date))
  return { entries: entries.slice(0, maxEntries), total: entries.length, lastDate: entries[0]?.date ?? null }
}
