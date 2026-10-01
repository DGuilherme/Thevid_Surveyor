# Plan — Thevid Surveyor

> Fase: mvp
> Deploy: local

## Phase 1: Foundation
- [x] Define project contract (SPEC, PLAN, TASKS, CLAUDE format)
- [x] Setup project structure (backend + frontend + templates)
- [x] Define TASKS.md format (MoSCoW + checkboxes)

## Phase 2: Backend
- [x] Project scanner (scan E:\projects\, filter by contract files)
- [x] TASKS.md parser
- [x] PLAN.md parser
- [x] Git reader (simple-git)
- [x] Express API (/api/projects)

## Phase 3: Frontend
- [x] Project grid with cards
- [x] Completion % + progress bar
- [x] Contract health badges
- [x] Project detail panel (tasks, plan, git)
- [x] Auto-refresh polling (30s)
- [x] Filters (all / active / incomplete)

## Phase 4: Polish
- [ ] Test with real projects (add contract files to existing repos)
- [ ] Tune parsing edge cases
- [ ] Add CLAUDE.md to key projects

## Phase 5: Contract v2 + Real Status
- [x] Contract v2 templates (LOG.md, PLAN header, TASKS states/dates, CLAUDE rules)
- [x] Parsers v2 (TASKS `[!]` + dates, PLAN header, LOG.md)
- [x] Scanner v2 (all folders, compliance checklist, git ahead, deploy readiness)
- [x] Frontend v2 (phase, stale, ahead, deploy badges, LOG in detail)
- [x] Migration prompts + claude.ai instructions block
- [ ] Migrate supervised projects to v2
