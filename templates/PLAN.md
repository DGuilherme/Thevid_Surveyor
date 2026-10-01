# PLAN — [Nome do Projeto]

> Fase: ideia
> URL:

> Valores de fase: `ideia` · `dev` · `mvp` · `produção` · `pausado` — atualizar sempre que muda.
> O URL preenche-se quando houver deploy (ex: https://nomeprojeto.theviddev.org).
> Projetos que nunca vão para o homelab: acrescentar a linha `> Deploy: local` no cabeçalho.
> Estado dos passos: `[x]` concluído · `[~]` em progresso · `[ ]` por fazer · `[!]` bloqueado

---

## Fase 1 — Fundação

- [ ] Setup do projeto (dependências, estrutura de pastas, git)
- [ ] Contrato (SPEC.md, PLAN.md, TASKS.md, CLAUDE.md, LOG.md)
- [ ] Ambiente de desenvolvimento a funcionar (dev server, DB, env vars)
- [ ] Modelos de dados / schema inicial + migração SQL em `migrations/`

## Fase 2 — MVP

- [ ] [Feature core A]
- [ ] [Feature core B]
- [ ] [Feature core C]
- [ ] Testes das funcionalidades core

## Fase 3 — Produção (homelab)

- [ ] Dockerfile multi-stage na raiz + `.env.example` completo
- [ ] Cloudflare: rota `nomeprojeto.theviddev.org` → `localhost:80`
- [ ] Coolify: recurso (Private Repo + Deploy Key, Build Pack Docker, porta certa, domínio `http://`)
- [ ] Coolify: variáveis de ambiente configuradas
- [ ] PostgreSQL: database criada e migrations aplicadas
- [ ] Deploy + teste em https://nomeprojeto.theviddev.org

## Fase 4 — Iteração

- [ ] [Feature adicional baseada em feedback]
- [ ] [Melhoria de UX / performance]
