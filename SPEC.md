# SPEC — Thevid Surveyor

## What this project does
Local developer dashboard that scans all projects in E:\projects\ and shows their current status — tasks, plan progress, git activity, and contract health. Forces a structured development workflow by requiring a standard set of markdown files in each project.

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
- Migration support: the dashboard shows what each project lacks for v2; `templates/PROMPTS.md` provides a prompt to migrate a project and a block for the claude.ai project instructions

## Out of scope (v1)
- Write/edit tasks from the dashboard — read-only only
- Remote repos (GitHub API) — local git only
- Authentication — localhost only

## Tech stack
- Backend: Node.js + Express + simple-git (single server on port 3000, serves `public/`)
- Frontend: static `public/index.html` (vanilla JS)
- No database — reads files from disk on each request
