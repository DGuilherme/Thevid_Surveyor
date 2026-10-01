# [Nome do Projeto] — Instruções para o Agente

## Resumo
Uma frase sobre o que o projeto faz.

---

## Governance

| Ficheiro | Propósito |
|----------|-----------|
| `SPEC.md` | O que o projeto faz e o que está fora de scope. **Imutável sem decisão explícita.** |
| `PLAN.md` | Fases do roadmap com checkboxes (`[x]` done, `[~]` in progress, `[ ]` todo) |
| `TASKS.md` | Tarefas em formato MoSCoW com critério de done por tarefa |
| `LOG.md` | Report de trabalho — uma entrada por sessão, mais recente no topo |
| `CLAUDE.md` | Este ficheiro |

Este projeto é supervisionado pelo **Thevid Surveyor** (dashboard local que lê estes ficheiros). Manter os formatos exatos dos templates — cabeçalhos `## Must Have` etc., checkboxes `[x] [~] [ ] [!]`, `> Fase:` no PLAN, `## YYYY-MM-DD — título` no LOG — senão o estado do projeto fica errado no dashboard.

---

## Regras do Agente

1. **Lê sempre `SPEC.md`, `TASKS.md` e a última entrada de `LOG.md`** antes de começar qualquer trabalho.
2. **Usa Plan Mode** antes de qualquer mudança que toque mais de 2 ficheiros.
3. **Não implementas nada que não esteja em `SPEC.md`** — se for necessário, atualiza o spec primeiro e aguarda confirmação.
4. **Quando uma task fica completa**, atualiza para `[x]` com a data no fim — `- [x] Título (YYYY-MM-DD)` — em `TASKS.md` (e em `PLAN.md` se o passo/fase ficar concluído). Se ficar bloqueada, usa `[!]` e escreve a razão na linha `>`.
5. **Corre os testes antes de marcar uma task como done.**
6. **Não criar ficheiros `.md` ou `README` sem pedido explícito.**
7. **Não adicionar comentários de código** — só quando o WHY é não-óbvio (constraint oculta, workaround de bug específico). Nunca comentar o WHAT.

---

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

---

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

No fim de cada sessão em que houve alterações (antes do commit final):

1. Acrescentar uma entrada **no topo** de `LOG.md`:
   ```
   ## YYYY-MM-DD — título curto

   **Feito:**
   - ...

   **Próximo:**
   - ...

   **Bloqueios:**
   - ... (ou "—")
   ```
2. Confirmar que `TASKS.md` reflete o estado real (`[x]` com data, `[~]`, `[!]`).
3. Atualizar `> Fase:` (e `> URL:` se houve deploy) no topo de `PLAN.md` se mudou.
4. Commit destes ficheiros juntamente com o código — o estado tem de estar no git.

Nunca marcar como feito o que não foi verificado. Report honesto > report bonito.

---

## Conhecimento do Projeto

Todo o conhecimento sobre o projeto vive **dentro do repositório**, nunca só na memória do agente (a memória do utilizador fica fora do projeto e perde-se ao mudar de PC ou de pasta):

- Convenções, gotchas, comandos → secção `## Convenções` deste ficheiro
- Decisões técnicas e porquê → tabela `## Decisões técnicas` do `SPEC.md`
- Estado e histórico → `TASKS.md`, `PLAN.md`, `LOG.md`

Se aprenderes algo que valha guardar, escreve-o num destes ficheiros.

---

## Tarefas Manuais

Quando identificares uma ação que não podes executar (deploy em produção, configurar env vars no Coolify/Vercel, aplicar migrações em servidor remoto, criar buckets de storage, configurar DNS, etc.), **não mencionar apenas no chat**. Registar em `TASKS.md` na secção `## Tarefas Manuais` com descrição clara do que fazer e onde.

---

## Como Correr

```bash
# Desenvolvimento
npm run dev

# Testes
npm test

# Build
npm run build
```

---

## Deployment (Homelab — Coolify)

| Ambiente | Plataforma | URL |
|----------|-----------|-----|
| Produção | Coolify (homelab) | https://nomeprojeto.theviddev.org |

Deploy automático por webhook a cada `git push` para `main`.

**Infraestrutura:**
- Painel: https://coolify.theviddev.org · SSH: `ssh nuno@ssh.theviddev.org`
- Proxy Traefik na porta 80 partilhado; SSL tratado pelo Cloudflare (túnel `homelab`)
- Domínio no Coolify usa **sempre `http://`** (ex: `http://nomeprojeto.theviddev.org`)
- PostgreSQL partilhado, contentor `nbo4l6g9n630qrygbe404uao`, uma database por projeto:
  `postgresql://postgres:PASSWORD@nbo4l6g9n630qrygbe404uao:5432/NOME_DB`

**Regras obrigatórias:**
- `Dockerfile` multi-stage, otimizado para produção, **na raiz**; porta exposta = porta no Coolify
- `.env.example` com todas as variáveis, sem valores; nunca credenciais no código
- Migração SQL completa e pronta a correr em `migrations/` (se usar PostgreSQL)
- `SESSION_SECRET` com mínimo 32 caracteres (`openssl rand -base64 32`)

**Cloudflare** (feito raramente — seguir à letra):
- Túnel: `homelab` em Cloudflare Zero Trust → Networks → Connector → homelab
- Todas as rotas apontam para `localhost:80`
- Nova rota para o projeto:
  - Subdomain: `nomeprojeto`
  - Domain: `theviddev.org`
  - Path: (vazio)
  - Type: `HTTP`
  - URL: `localhost:80`
- Fica público em `https://nomeprojeto.theviddev.org`

**Passos de deploy** (registar em `## Tarefas Manuais` os que o utilizador tem de fazer, com estes detalhes):
1. Cloudflare: criar a rota acima (`nomeprojeto.theviddev.org` → `localhost:80`)
2. Coolify: New Resource → Private Repository (with Deploy Key) → Build Pack Docker → porta correta
3. Coolify: definir domínio como `http://nomeprojeto.theviddev.org`
4. Coolify: adicionar todas as variáveis de ambiente
5. Servidor: criar database e correr migrations (`sudo docker exec -it nbo4l6g9n630qrygbe404uao psql -U postgres`); PASSWORD em Coolify → recurso PostgreSQL → Configuration → Password
6. Coolify: clicar Deploy e aguardar "Rolling update completed"
7. Testar em `https://nomeprojeto.theviddev.org`

**Erros comuns:** 502 → porta Dockerfile ≠ Coolify · Too many redirects → `https://` no domínio do Coolify · 404 → redeploy · crash no arranque → falta env var · falha na exportação → Deploy outra vez.

Se o projeto não for para o homelab (ex: só local), substituir esta secção pela forma real de correr/deploy.

---

## Convenções

- Sem comentários no código salvo quando o porquê é não-óbvio.
- Sem abstrações prematuras — três linhas repetidas é melhor que uma abstração desnecessária.
- [Adicionar convenções específicas do projeto]

---

## O que NÃO fazer

- Não implementar features fora de `SPEC.md` sem atualizar o spec primeiro.
- Não marcar tasks como done sem ter corrido os testes.
- Não terminar uma sessão com alterações sem entrada no `LOG.md`.
- Não guardar conhecimento do projeto só na memória do agente.
- [Adicionar restrições específicas do projeto]
