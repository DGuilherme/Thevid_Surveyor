# Tasks — Thevid Surveyor

> Estado: `[x]` concluído · `[~]` em progresso · `[ ]` por fazer · `[!]` bloqueado
> Concluídas levam data no fim: `(YYYY-MM-DD)`.

## Must Have
- [x] Backend API that scans projects and returns structured data (2026-05-21)
  > GET /api/projects returns list with tasks, plan, git, contractHealth
- [x] TASKS.md parser (MoSCoW checkboxes) (2026-05-21)
  > Correctly parses [x], [~], [ ] and counts per section
- [x] PLAN.md parser (phases + steps) (2026-05-21)
  > Correctly parses phases and calculates completion %
- [x] Git reader per project (2026-05-21)
  > Returns branch, last 5 commits, uncommitted count
- [x] Frontend dashboard with project cards (2026-05-21)
  > Cards show name, completion %, task counts, last commit, contract badges
- [x] Auto-refresh every 30s (2026-05-21)
  > Edit a TASKS.md file → dashboard reflects change within 30s
- [x] Contract v2 templates (2026-10-01)
  > `templates/` has LOG.md; PLAN.md has `Fase`/`URL` header; TASKS.md documents `[!]` and dates; CLAUDE.md includes LOG, knowledge and homelab deploy rules
- [x] Parsers v2: `[!]` blocked + completion dates in TASKS, `Fase`/`URL` in PLAN, new LOG.md parser (2026-10-01)
  > Pure functions; unit-checked against sample files with every state
- [x] Scanner v2: list every project folder with v2 compliance checklist (2026-10-01)
  > Projects without CLAUDE.md appear as non-compliant with the list of missing items
- [x] Real status: phase, activity age, stale flag, unpushed commits, deploy readiness (2026-10-01)
  > API returns these fields; card shows phase, stale badge, ↑ahead and deploy badge

## Should Have
- [x] Manual tasks section per project in the detail panel (2026-10-01)
  > Parse `## Tarefas Manuais` from each project's TASKS.md and show separately in the modal (not counted in completion %)
- [x] Project detail panel with full task list and plan breakdown (2026-05-21)
  > Click card → overlay with all tasks by section and plan phases
- [x] Filter by active / incomplete (2026-05-21)
  > Toolbar filters update the visible project grid
- [x] LOG.md latest entries in the detail panel (2026-10-01)
  > Modal shows last 3 entries with Feito / Próximo / Bloqueios
- [x] Migration prompts in `templates/PROMPTS.md` (2026-10-01)
  > Contains "migrar para contrato v2" prompt and a block for the claude.ai project instructions
- [x] Fix CLAUDE.md architecture/how-to-run drift (2026-10-01)
  > CLAUDE.md describes `src/` + `public/`, single server on port 3000

## Could Have
- [ ] Sort by completion, last commit, name
  > Toolbar sort control reorders the grid
- [ ] Search/filter by project name
  > Typing in a search box filters cards by name
- [x] Filter "non-compliant" / "stale" (2026-10-01)
  > Toolbar buttons show only non-v2 or stale projects
- [x] `> Deploy: local` opt-out in PLAN header (2026-10-01)
  > Local-only projects (like this one) stop showing the Dockerfile/.env.example warning

## Won't Have (v1)
- Write/edit tasks from UI — keep read-only, edit in editor
- GitHub API integration — local only
- Dark/light theme toggle — dark only
- Automatic migration from the dashboard — backend stays read-only; migration is done by the agent inside each project

---

## Tarefas Manuais

Ações que requerem o utilizador — o agente não pode executar estas, só registá-las.

- [ ] Correr o servidor (`npm run dev` na raiz) e abrir http://localhost:3000 antes de usar o dashboard
- [x] Colar a secção "Thevid Surveyor" de `templates/PROMPTS.md` nas instruções do projeto no Claude do browser (2026-10-01)
- [ ] Migrar cada projeto para v2 (abrir Claude Code no projeto e usar o prompt "Migrar para contrato v2")
