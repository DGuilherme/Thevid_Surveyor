# Report — Contrato v2 + skills recomendadas (2026-10-22)

Scan feito com `scanAllProjects` do próprio Surveyor + deteção de stack por `package.json` / `requirements.txt` / `Dockerfile`.
Ponto de partida para a feature "Skills" (ver `SPEC.md` → Skills suggestions).

## 1. Estado do contrato v2

**v2 (3):** Small-Bets, adunblocker, Thevid_Surveyor

**v1 — migração a meio (8).** Em quase todos falta `LOG.md`, o cabeçalho `> Fase:` no PLAN e as regras v2 no CLAUDE.md (usar o prompt de `templates/PROMPTS.md`).
- DavidRapLog, Thevid_TB, Thevid_Nucleo, spellforge, Project_Whisper, cordas
- ThevidBG — também 10 tasks abertas sem critério `>`
- N8N — só tem CLAUDE.md; faltam SPEC, PLAN, TASKS

**Sem contrato (13):** HSStrats, Printatelier, StockPilot, StufTracker, FitVision, prima-prime, ExpensesApp, ManagerPOC, Mundialitos, mtg, PMTese, javaProjects, pythonLearn
(os últimos parecem estudo/arquivo — talvez não valha migrar)

## 2. Stack detetado

| Projeto | Stack |
|---|---|
| DavidRapLog | Next, React, Tailwind, Supabase, Stripe; `mobile/` Expo + React Native |
| HSStrats, Printatelier | Next, React, Tailwind, Docker |
| Project_Whisper | Next, React, Tailwind, Prisma, Docker |
| Thevid_Nucleo | Next, React, Tailwind |
| ThevidBG | Docker; `boardgamehub/` Next, React, Tailwind |
| spellforge | `frontend/` Next, React, Tailwind |
| cordas | `client/` React, Vite, Tailwind; `api/`, `scraper-petzvienna/` Node |
| FitVision | React, Vite |
| prima-prime | React |
| ExpensesApp | `expenses/`, `excel-to-json/` React |
| ManagerPOC | `ManagerBackEnd/` Express; `manager-front-end/` React |
| Thevid_Surveyor | Express |
| Thevid_TB, StockPilot, StufTracker | Python |
| adunblocker | Python, Docker |
| restantes | sem stack detetado |

## 3. Skills recomendadas

| Skill / plugin | Para quê | Projetos |
|---|---|---|
| **Ponytail** — `/plugin marketplace add DietrichGebert/ponytail` + `/plugin install ponytail@ponytail` | Agente escreve menos código (reutiliza o que existe, stdlib, nativo) | Todos — instalar uma vez ao nível do utilizador |
| **Apple HIG** — `ebuntario/apple-hig` ou `raintree-technology/apple-hig-skills` | Human Interface Guidelines da Apple | DavidRapLog/mobile (Expo); web apps só se quiseres esse visual |
| **frontend-design** (marketplace oficial) | UI web com mais qualidade de design | HSStrats, Printatelier, Project_Whisper, Thevid_Nucleo, spellforge, ThevidBG, cordas, FitVision |
| **expo** | Build/deploy/debug Expo | DavidRapLog/mobile |
| **supabase**, **stripe** | Integrações | DavidRapLog |
| **prisma** | Schema e migrations | Project_Whisper |
| **playwright** | Testes no browser | Web apps em mvp/produção |
| **typescript-lsp** / **pyright-lsp** | Navegação de código | Projetos TS / Python |

Notas:
- Ponytail: teste independente da JetBrains mediu ≈ −15% código e −10% custo (o README anuncia −54%). Vale a pena, com expectativas realistas.
- As skills Apple são todas da comunidade, não oficiais; resumem a HIG mas não trazem assets da Apple (SF Symbols, ícones).
- Skills específicas de stack (expo, prisma, apple-hig) vão para o `.claude/` de cada projeto, não globais, para não gastar contexto nos outros.

## Fontes
- https://blog.jetbrains.com/ai/2026/07/ponytail-skill-claude-tested/
- https://skillselion.com/guides/ponytail-skill-claude-code-guide
- https://horadecodar.com.br/ponytail-claude-code/
- https://awesome.ecosyste.ms/projects/github.com%2Febuntario%2Fapple-hig
- https://awesome.ecosyste.ms/projects/github.com%2Fraintree-technology%2Fapple-hig-skills
- https://mcpmarket.com/tools/skills/apple-design-system-1
- https://claudemarketplaces.com/skills/vabole/apple-skills/hig
