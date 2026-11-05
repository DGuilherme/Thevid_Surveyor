# SPEC — Thevid Surveyor

## What this project does
Local developer dashboard that scans all projects in `PROJECTS_ROOT` (default: the folder containing this repo, `E:\projects\` on the Windows PC) and shows their current status — tasks, plan progress, git activity, and contract health. Forces a structured development workflow by requiring a standard set of markdown files in each project.

## Core features
- Project discovery: auto-detect projects that follow the contract (TASKS.md and/or PLAN.md)
- Task tracking: parse TASKS.md MoSCoW format, show % completion based on Must Have; parse `## Tarefas Manuais` section and show it separately in the detail panel
- Plan tracking: parse PLAN.md phases and steps
- Git status: recent commits, current branch, uncommitted changes
- Contract health: show which of (SPEC, PLAN, TASKS, CLAUDE) each project has
- Auto-refresh: frontend polls backend every 30s — reflects file edits without reload

## Contract v2
Every supervised project must have, in its root and versioned in git:

- `SPEC.md` — scope, out of scope, stack, technical decisions
- `PLAN.md` — phases with checkboxes, plus a status header:
  - `> Fase: ideia | dev | mvp | produção | pausado`
  - `> URL: https://nome.theviddev.org` (when deployed)
  - `> Deploy: local` (optional — local-only projects skip the deploy files check)
- `TASKS.md` — MoSCoW checkboxes with a `>` done criterion per task (required for open tasks; legacy done tasks without one are only a warning)
  - States: `[x]` done · `[~]` in progress · `[ ]` todo · `[!]` blocked
  - Done tasks carry the completion date: `- [x] Título (2026-10-01)`
- `CLAUDE.md` — agent rules, including the reporting and knowledge rules below
- `LOG.md` — work report, newest first, one entry per work session:
  `## YYYY-MM-DD — título` followed by `Feito:`, `Próximo:`, `Bloqueios:`
- Deploy files (homelab / Coolify): `Dockerfile` at root, `.env.example`, `migrations/` when the project uses PostgreSQL

Knowledge rule: project knowledge (conventions, decisions, gotchas) lives in the repo — `CLAUDE.md` or the `SPEC.md` decisions table — never only in the agent's user-level memory, so it survives a change of machine or path.

## Surveyor v2 features
- Show every project folder, including non-compliant ones, with a v2 compliance checklist (what is missing)
- Real status per project: phase, URL, days since last commit and last LOG entry, stale flag (> 14 days without activity), blocked tasks
- Git hygiene: uncommitted changes and unpushed commits (ahead count from local tracking refs, no fetch)
- Deploy readiness: Dockerfile, .env.example, migrations/
- LOG.md parser: latest entries shown in the detail panel
- Toolbar: search by project name (filters as you type, combines with the filters) + sort selector (default: contract → activity; name A–Z; completion %; last commit); the chosen sort is remembered in the browser (`localStorage`)
- Migration support: the dashboard shows what each project lacks for v2; `templates/PROMPTS.md` provides a prompt to migrate a project and a block for the claude.ai project instructions

## Skills suggestions
Ideia registada em 2026-10-22 — ponto de partida: `docs/skills-report-2026-10-22.md`.
- Detect each project's stack (root and first-level subfolders: `package.json` deps, `requirements.txt`/`pyproject.toml`, `Dockerfile`, Expo/React Native)
- Show the skills/plugins already installed in the project (`.claude/skills/`, `.claude/settings.json` plugins) — read-only, never installs
- Suggest skills from a static catalog versioned in this repo (stack → skill, with install command), e.g. Next/React → frontend-design, Expo → expo + Apple HIG, Prisma → prisma, all → Ponytail
- Shown in a new "Skills" tab in the detail panel (UI conventions in `CLAUDE.md`)
- User-level plugins are read from `~/.claude/settings.json` (`enabledPlugins`) so skills already installed globally (e.g. Ponytail) are not suggested — the only read outside PROJECTS_ROOT
- Catalog entries without a confirmed install command point to `/plugin → Discover` instead of guessing a plugin id

## Multi-machine portability
Adicionado em 2026-11-05. O desenvolvimento passa a ser partilhado entre várias máquinas (PC Windows, MacBook Air, servidor Linux com Claude Code / Hermes Agent). Tudo o que o agente precisa de saber vive no repo; a memória do Claude em `~/.claude/projects/…/memory/` é só cache local.
- `PROJECTS_ROOT` deixa de estar hardcoded: ordem de resolução = variável de ambiente `PROJECTS_ROOT` → pasta-pai do repo do Surveyor (os projetos são irmãos; no PC Windows resolve para `E:\projects`). Nenhum path de uma máquina é forçado noutra (macOS/Linux incluídos). Esta decisão substitui a regra anterior "PROJECTS_ROOT hardcoded"
- Auditoria de portabilidade por projeto (só leitura), no tab Contrato: memória do Claude fora do repo (a localização é derivada de `PROJECTS_ROOT` e do nome da pasta), `.claude/settings.local.json` não ignorado pelo git, caminhos absolutos de uma máquina em `CLAUDE.md`/`.claude/settings.json`, commits por enviar, alterações por commitar, ausência de remote
- Migração da memória para o repo é feita pelo agente dentro de cada projeto (passo 6 do prompt em `templates/PROMPTS.md`), nunca pelo backend. Infra (Cloudflare/Coolify/homelab) copiada verbatim
- Higiene por projeto: `.claude/settings.local.json` no `.gitignore`; permissões partilhadas em `.claude/settings.json`; caminhos relativos nos ficheiros versionados
- Repos com alterações por commitar em massa ou sem remote (ex.: ManagerPOC, javaProjects) só são listados na auditoria, nunca alterados
- Âmbito da migração: todos os projetos de `PROJECTS_ROOT` com memória do Claude fora do repo (ex.: Thevid_Nucleo, DavidRapLog, FitVision, Mundialitos, Printatelier, Project_Whisper, Small-Bets, StockPilot, StufTracker, Thevid_TB, ThevidBG, spellforge, Thevid_Surveyor). Fora de âmbito: `HomeLab`, `N8N` e `E--work-Jobs`. Um projeto de cada vez
- `docs/MULTI-MACHINE.md`: passos para pôr uma máquina nova a funcionar (clonar, `PROJECTS_ROOT`, instalar Claude Code)

## Out of scope (v1)
- Write/edit tasks from the dashboard — read-only only
- Remote repos (GitHub API) — local git only
- Authentication — localhost only

## Tech stack
- Backend: Node.js + Express + simple-git (single server on port 3000, serves `public/`)
- Frontend: static `public/index.html` (vanilla JS)
- No database — reads files from disk on each request
