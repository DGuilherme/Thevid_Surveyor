// Static stack → skill catalog. Source: docs/skills-report-2026-10-22.md
// scope: 'user' installs once for every project, 'project' goes into the project's .claude/
// ids: names that mean the skill is already installed (plugin name before "@" or .claude/skills/ folder)
const WEB = ['Next', 'React', 'Vite']
const DEPLOY_PHASES = ['mvp', 'produção', 'producao']

export const SKILLS_CATALOG = [
  {
    id: 'ponytail', name: 'Ponytail', scope: 'user', when: 'all', ids: ['ponytail'],
    reason: 'O agente escreve menos código (reutiliza o que existe, stdlib, nativo)',
    install: '/plugin marketplace add DietrichGebert/ponytail\n/plugin install ponytail@ponytail',
  },
  {
    id: 'frontend-design', name: 'frontend-design', scope: 'project', when: WEB, ids: ['frontend-design'],
    reason: 'UI web com mais qualidade de design',
    install: '/plugin install frontend-design@claude-plugins-official',
  },
  {
    id: 'expo', name: 'expo', scope: 'project', when: ['Expo'], ids: ['expo'],
    reason: 'Build, deploy e debug de apps Expo',
    install: '/plugin → Discover → procurar "expo"',
  },
  {
    id: 'apple-hig', name: 'Apple HIG', scope: 'project', when: ['Expo', 'React Native'], ids: ['apple-hig', 'hig'],
    reason: 'Human Interface Guidelines da Apple (skill da comunidade, sem assets Apple)',
    install: 'github.com/ebuntario/apple-hig → copiar para .claude/skills/',
  },
  {
    id: 'supabase', name: 'supabase', scope: 'project', when: ['Supabase'], ids: ['supabase'],
    reason: 'Integração Supabase (auth, DB, storage)',
    install: '/plugin → Discover → procurar "supabase"',
  },
  {
    id: 'stripe', name: 'stripe', scope: 'project', when: ['Stripe'], ids: ['stripe'],
    reason: 'Integração Stripe (pagamentos, webhooks)',
    install: '/plugin → Discover → procurar "stripe"',
  },
  {
    id: 'prisma', name: 'prisma', scope: 'project', when: ['Prisma'], ids: ['prisma'],
    reason: 'Schema e migrations Prisma',
    install: '/plugin → Discover → procurar "prisma"',
  },
  {
    id: 'playwright', name: 'playwright', scope: 'project', when: WEB, phases: DEPLOY_PHASES, ids: ['playwright'],
    reason: 'Testes no browser para web apps em mvp/produção',
    install: '/plugin install playwright@claude-plugins-official',
  },
  {
    id: 'typescript-lsp', name: 'typescript-lsp', scope: 'project', when: ['TypeScript'], ids: ['typescript-lsp'],
    reason: 'Navegação de código TypeScript',
    install: '/plugin install typescript-lsp@claude-plugins-official',
  },
  {
    id: 'pyright-lsp', name: 'pyright-lsp', scope: 'project', when: ['Python'], ids: ['pyright-lsp'],
    reason: 'Navegação de código Python',
    install: '/plugin install pyright-lsp@claude-plugins-official',
  },
]

const baseName = s => s.split('@')[0].toLowerCase()

export function isInstalled(entry, names) {
  return names.some(n => entry.ids.includes(baseName(n)))
}

// stack: { root: tags[], sub: { folder: tags[] } } — returns catalog entries with `where` (folders that matched)
export function suggestSkills({ stack, phase, installed = [], global = [] }, catalog = SKILLS_CATALOG) {
  const places = [['', stack?.root ?? []], ...Object.entries(stack?.sub ?? {}).map(([d, t]) => [`${d}/`, t])]
  const hasStack = places.some(([, tags]) => tags.length)
  const suggested = []
  for (const entry of catalog) {
    if (isInstalled(entry, [...installed, ...global])) continue
    if (entry.phases && !entry.phases.includes(phase)) continue
    if (entry.when === 'all') {
      if (hasStack) suggested.push({ ...entry, where: [] })
      continue
    }
    const where = places.filter(([, tags]) => tags.some(t => entry.when.includes(t))).map(([d]) => d || 'raiz')
    if (where.length) suggested.push({ ...entry, where: where.join() === 'raiz' ? [] : where })
  }
  return suggested
}
