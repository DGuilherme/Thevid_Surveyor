# Thevid Surveyor — Claude Instructions

## Project summary
Local read-only dashboard that scans projects in E:\projects\ and shows their status via a React frontend + Node.js backend.

## How to run
```bash
# Backend (port 3001)
cd backend && npm install && npm run dev

# Frontend (port 5173)
cd frontend && npm install && npm run dev
```

## Architecture
- `backend/src/index.js` — Express server, entry point
- `backend/src/projectScanner.js` — discovers and aggregates project data
- `backend/src/gitReader.js` — git data via simple-git
- `backend/src/parsers/tasks.js` — TASKS.md parser
- `backend/src/parsers/plan.js` — PLAN.md parser
- `frontend/src/App.jsx` — main app with polling
- `frontend/src/components/ProjectCard.jsx` — card per project
- `frontend/src/components/ProjectDetail.jsx` — detail overlay
- `templates/` — contract file templates for new projects

## Rules
- Read SPEC.md before any feature change
- Backend is read-only — never write to project files
- PROJECTS_ROOT is hardcoded in backend/src/index.js — do not make it dynamic without updating SPEC
- Parsers must be pure functions — no side effects

## Do not
- Add write endpoints to the backend
- Add authentication (localhost only)
- Cache file reads — always read fresh from disk
