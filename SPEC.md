# SPEC — Thevid Surveyor

## What this project does
Local developer dashboard that scans all projects in E:\projects\ and shows their current status — tasks, plan progress, git activity, and contract health. Forces a structured development workflow by requiring a standard set of markdown files in each project.

## Core features
- Project discovery: auto-detect projects that follow the contract (TASKS.md and/or PLAN.md)
- Task tracking: parse TASKS.md MoSCoW format, show % completion based on Must Have
- Plan tracking: parse PLAN.md phases and steps
- Git status: recent commits, current branch, uncommitted changes
- Contract health: show which of (SPEC, PLAN, TASKS, CLAUDE) each project has
- Auto-refresh: frontend polls backend every 30s — reflects file edits without reload

## Out of scope (v1)
- Write/edit tasks from the dashboard — read-only only
- Remote repos (GitHub API) — local git only
- Authentication — localhost only

## Tech stack
- Backend: Node.js + Express + simple-git
- Frontend: React + Vite
- No database — reads files from disk on each request
