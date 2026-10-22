# LOG — Thevid Surveyor

> Report de trabalho. Uma entrada por sessão com alterações, mais recente no topo.

---

## 2026-10-22 — Separador Skills (stack + sugestões)

**Feito:**
- Deteção de stack por projeto (raiz + subpastas de 1.º nível): `src/parsers/stack.js`
- Catálogo estático stack → skill em `src/skillsCatalog.js` (Ponytail, frontend-design, expo, Apple HIG, supabase, stripe, prisma, playwright, typescript-lsp, pyright-lsp)
- Skills instaladas lidas de `.claude/skills/` e `enabledPlugins` do projeto; plugins globais de `~/.claude/settings.json` não são sugeridos
- Novo separador "Skills" no painel: Stack, Instaladas, Sugeridas (com comando de instalação e pasta onde se aplica)
- Verificado: stack detetada bate com o report de 2026-10-22; separador visto no browser (DavidRapLog)

**Próximo:**
- Reiniciar o servidor na porta 3000 para apanhar as alterações
- Confirmar os comandos de instalação marcados "/plugin → Discover" (expo, supabase, stripe, prisma) e fixá-los no catálogo
- Could Have: ordenar a grelha e pesquisa por nome

**Bloqueios:**
- Nenhum

## 2026-10-22 — Ideia: sugestões de skills por projeto

**Feito:**
- Scan de todos os projetos: 3 em v2, 8 em v1, 13 sem contrato
- Stack de cada projeto cruzado com skills (Ponytail, Apple HIG, frontend-design, expo, prisma…)
- Report guardado em `docs/skills-report-2026-10-22.md`; feature registada no SPEC, TASKS (Could Have) e PLAN (Phase 6)

**Próximo:**
- Decidir se a feature avança; se sim, começar pela stack detection no scanner
- Instalar Ponytail ao nível do utilizador; expo + Apple HIG no DavidRapLog/mobile
- Continuar migração v2 (prioridade aos 8 projetos em v1)

**Bloqueios:**
- Nenhum

## 2026-10-04 — Painel de detalhe mais legível

**Feito:**
- Modal reorganizado: faixa de resumo (fase, progresso, tasks, atividade, git, contrato) + bloco "Agora" (bloqueadas, em curso, próximo do último LOG, manuais pendentes)
- Detalhe em separadores: Tasks, Plano, Manuais, Log, Git, Contrato (o separador escolhido mantém-se entre projetos)
- Tasks concluídas, fases fechadas e entradas antigas do LOG ficam recolhidas; tasks abertas ordenadas bloqueada → em curso → por fazer

- Layout validado pelo utilizador; convenções de UI guardadas em `CLAUDE.md`

**Próximo:**
- Could Have: ordenar a grelha (completion, último commit, nome) e pesquisa por nome
- Phase 4: afinar casos limite dos parsers (ex.: DavidRapLog mostra spec summary "..." e não tem `> Fase:`)
- Phase 5: migrar os projetos supervisionados para v2

**Bloqueios:**
- Nenhum

## 2026-10-01 — Contrato v2 + estado real

**Feito:**
- Contrato v2: templates LOG.md, PLAN (`> Fase:`/`> URL:` + passos homelab), TASKS (`[!]`, datas), CLAUDE (report, conhecimento no repo, deploy Coolify)
- Parsers v2 (tasks/plan) e novo parser LOG.md
- Scanner mostra todas as pastas com checklist de conformidade v2, atividade/stale, ahead/behind, deploy readiness
- Dashboard: badges de fase/STALE/↑push/DEPLOY/LOG, modal com Migração v2 + Log, filtros Stale/Não conformes
- PROMPTS.md: instruções para o projeto claude.ai e prompt "Migrar para contrato v2"
- CLAUDE.md corrigido (src/ + public/, porta 3000); .gitignore deixa versionar `.claude/settings.json`
- Critério de done obrigatório só em tasks abertas; tasks [x] antigas sem critério passam a aviso

**Próximo:**
- Migrar os projetos supervisionados para v2 (começar pelos que já têm contrato v1)
- Colar as novas instruções no projeto do Claude do browser

**Bloqueios:**
- —

## 2026-05-21 — v1 inicial

**Feito:**
- Backend Express com scanner, parsers TASKS/PLAN e git reader
- Dashboard com cards, modal de detalhe, filtros e polling 30s
- Templates do contrato v1

**Próximo:**
- Testar com projetos reais

**Bloqueios:**
- —
