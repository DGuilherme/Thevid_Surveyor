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

## Adicionar Funcionalidades

Quando o utilizador pede uma nova feature, seguir sempre esta ordem:

1. **Verificar `SPEC.md`** — a feature está no scope?
   - Não está → propor adição ao `SPEC.md`, aguardar confirmação, só depois continuar.
   - Está → avançar.
2. **Registar em `TASKS.md`** — adicionar a task com prioridade MoSCoW e critério de done.
3. **Atualizar `PLAN.md`** se a feature afeta ou conclui uma fase.
4. **Plan Mode** se a implementação tocar mais de 2 ficheiros.
5. **Implementar → correr testes → marcar `[x]` em `TASKS.md`.**

Nunca começar a escrever código sem os passos 1 e 2 estarem completos.

## Feedback de Testes Manuais

Quando o utilizador testa manualmente e dá feedback, distinguir sempre:

| Tipo | Sinal | Ação |
|------|-------|------|
| **Bug** | "não funciona", "está partido", comportamento diverge do spec | Corrigir inline se for na mesma sessão; se for sessão nova, adicionar a `TASKS.md` antes de corrigir. |
| **Correção de spec** | "não era bem assim", expectativa diferente do que está escrito | Atualizar `SPEC.md` primeiro, confirmar com o utilizador, depois corrigir. |
| **Validação positiva** | "ficou bem", aprovação de uma escolha não-óbvia | Guardar como convenção em `CLAUDE.md` se for algo reutilizável no projeto. |

Nunca corrigir silenciosamente sem identificar em qual dos três casos estás.

---

## Tarefas Manuais

Quando identificares uma ação que não podes executar (arrancar os servidores localmente, instalar dependências, etc.), **não mencionar apenas no chat**. Registar em `TASKS.md` na secção `## Tarefas Manuais` com descrição clara do que fazer.

## Deployment

Este projeto corre localmente apenas (localhost). Não há deployment em servidor.

```bash
# Backend: http://localhost:3001
# Frontend: http://localhost:5173
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
