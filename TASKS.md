# Tasks — Thevid Surveyor

## Must Have
- [x] Backend API that scans projects and returns structured data
  > GET /api/projects returns list with tasks, plan, git, contractHealth
- [x] TASKS.md parser (MoSCoW checkboxes)
  > Correctly parses [x], [~], [ ] and counts per section
- [x] PLAN.md parser (phases + steps)
  > Correctly parses phases and calculates completion %
- [x] Git reader per project
  > Returns branch, last 5 commits, uncommitted count
- [x] Frontend dashboard with project cards
  > Cards show name, completion %, task counts, last commit, contract badges
- [x] Auto-refresh every 30s
  > Edit a TASKS.md file → dashboard reflects change within 30s

## Should Have
- [ ] Project detail panel with full task list and plan breakdown
  > Click card → overlay with all tasks by section and plan phases
- [ ] Filter by active / incomplete
  > Toolbar filters update the visible project grid

## Could Have
- [ ] Sort by completion, last commit, name
- [ ] Search/filter by project name

## Won't Have (v1)
- Write/edit tasks from UI — keep read-only, edit in editor
- GitHub API integration — local only
- Dark/light theme toggle — dark only
