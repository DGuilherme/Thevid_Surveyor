# Plan — Thevid Surveyor

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
