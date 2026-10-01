# Thevid Surveyor — Claude Instructions

## Project summary
Local read-only dashboard that scans projects in E:\projects\ and shows their real status (contract v2 compliance, tasks, plan, LOG, git, deploy readiness). Single Node.js/Express server serving a static frontend.

## How to run
```bash
npm install
npm run dev   # http://localhost:3000
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

## Report de Trabalho

No fim de cada sessão com alterações: entrada no topo de `LOG.md` (`## YYYY-MM-DD — título` + Feito / Próximo / Bloqueios), `TASKS.md` com `[x]` + data, `> Fase:` do `PLAN.md` atualizada, e commit de tudo.

## Conhecimento do Projeto

Convenções e gotchas ficam neste ficheiro; decisões no `SPEC.md`. Nunca só na memória do agente.

## Tarefas Manuais

Quando identificares uma ação que não podes executar (arrancar os servidores localmente, instalar dependências, etc.), **não mencionar apenas no chat**. Registar em `TASKS.md` na secção `## Tarefas Manuais` com descrição clara do que fazer.

## Deployment

Este projeto corre localmente apenas (localhost). Não há deployment em servidor.

```bash
# http://localhost:3000
```

## Architecture
- `src/server.js` — Express server, entry point, PROJECTS_ROOT, serves `public/`
- `src/projectScanner.js` — discovers every project folder, compliance, activity, deploy readiness
- `src/gitReader.js` — git data via simple-git (branch, commits, uncommitted, ahead/behind from local refs)
- `src/parsers/tasks.js` — TASKS.md parser (MoSCoW, `[x] [~] [ ] [!]`, dates, criteria)
- `src/parsers/plan.js` — PLAN.md parser (`> Fase:` / `> URL:` header + phases)
- `src/parsers/log.js` — LOG.md parser (entries Feito / Próximo / Bloqueios)
- `public/index.html` — dashboard (vanilla JS, polling 30s)
- `templates/` — contract v2 templates + `PROMPTS.md` (claude.ai instructions, migration prompt)

## Rules
- Read SPEC.md before any feature change
- Backend is read-only — never write to project files
- PROJECTS_ROOT is hardcoded in src/server.js — do not make it dynamic without updating SPEC
- Parsers must be pure functions — no side effects

## Do not
- Add write endpoints to the backend
- Add authentication (localhost only)
- Cache file reads — always read fresh from disk
