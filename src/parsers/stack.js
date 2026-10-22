const NPM_TAGS = [
  ['next', 'Next'],
  ['react', 'React'],
  ['vite', 'Vite'],
  ['tailwindcss', 'Tailwind'],
  ['express', 'Express'],
  ['prisma', 'Prisma'],
  ['@prisma/client', 'Prisma'],
  ['@supabase/supabase-js', 'Supabase'],
  ['stripe', 'Stripe'],
  ['expo', 'Expo'],
  ['react-native', 'React Native'],
  ['typescript', 'TypeScript'],
]

export function detectStack({ packageJson, requirements, pyproject, dockerfile }) {
  const tags = []
  if (packageJson) {
    let pkg = {}
    try { pkg = JSON.parse(packageJson) } catch { /* invalid package.json still means Node */ }
    const deps = { ...pkg.dependencies, ...pkg.devDependencies }
    for (const [dep, tag] of NPM_TAGS) {
      if (deps[dep] && !tags.includes(tag)) tags.push(tag)
    }
    if (!tags.length) tags.push('Node')
  }
  if (requirements || pyproject) tags.push('Python')
  if (dockerfile) tags.push('Docker')
  return tags
}
