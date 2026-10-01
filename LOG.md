# LOG — Thevid Surveyor

> Report de trabalho. Uma entrada por sessão com alterações, mais recente no topo.

---

## 2026-10-01 — Contrato v2 + estado real

**Feito:**
- Contrato v2: templates LOG.md, PLAN (`> Fase:`/`> URL:` + passos homelab), TASKS (`[!]`, datas), CLAUDE (report, conhecimento no repo, deploy Coolify)
- Parsers v2 (tasks/plan) e novo parser LOG.md
- Scanner mostra todas as pastas com checklist de conformidade v2, atividade/stale, ahead/behind, deploy readiness
- Dashboard: badges de fase/STALE/↑push/DEPLOY/LOG, modal com Migração v2 + Log, filtros Stale/Não conformes
- PROMPTS.md: instruções para o projeto claude.ai e prompt "Migrar para contrato v2"
- CLAUDE.md corrigido (src/ + public/, porta 3000); .gitignore deixa versionar `.claude/settings.json`

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
