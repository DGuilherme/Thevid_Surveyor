# Prompt Templates — Instruções Reutilizáveis

Blocos prontos a copiar. Os templates do contrato v2 estão em `E:\projects\Thevid_Surveyor\templates\`.

---

## Índice

- [Instruções do projeto claude.ai](#instruções-do-projeto-claudeai) — colar nas instruções do projeto no Claude do browser
- [Migrar para contrato v2](#migrar-para-contrato-v2) — colar no Claude Code dentro de um projeto existente
- [Coolify — Deploy Self-Hosted](#coolify--deploy-self-hosted) — já incluído no template `CLAUDE.md`; usar só em projetos antigos

---

## Instruções do projeto claude.ai

> Substitui as instruções atuais do projeto no Claude do browser. Inclui o homelab + o contrato do Surveyor.

```
O objetivo deste projeto é planear novas apps que já nascem preparadas para correr no meu
home lab e para serem supervisionadas pelo Thevid Surveyor.

# Servidor Home Lab — Infraestrutura

## Servidor
- Fujitsu PRIMERGY TX1310 M1 · Ubuntu Server 24.04 LTS · 10GB RAM
- SSH: ssh nuno@ssh.theviddev.org · Painel: https://coolify.theviddev.org

## Coolify
- Deploy self-hosted (substituto do Vercel), proxy Traefik na porta 80 partilhado
- Build Pack Docker — Dockerfile obrigatório na raiz
- Domínios no Coolify usam sempre http:// (o Cloudflare trata do SSL)
- Deploy via GitHub (Deploy Key) e automático por webhook a cada push para main

## Cloudflare
- Domínio theviddev.org, túnel "homelab", todas as rotas → localhost:80
- Rota por projeto: Subdomain nomeprojeto · Domain theviddev.org · Type HTTP · URL localhost:80
- App pública em https://nomeprojeto.theviddev.org

## PostgreSQL
- Contentor nbo4l6g9n630qrygbe404uao, uma database por projeto
- postgresql://postgres:PASSWORD@nbo4l6g9n630qrygbe404uao:5432/NOME_DB
- Password no Coolify → recurso PostgreSQL → Configuration
- Migrations: sudo docker exec -it nbo4l6g9n630qrygbe404uao psql -U postgres

## Regras para novos projetos
- Dockerfile multi-stage otimizado para produção na raiz
- Migração SQL completa em migrations/
- .env.example com todas as variáveis sem valores; nunca credenciais no código
- SESSION_SECRET ≥ 32 caracteres (openssl rand -base64 32)

## Passos de deploy
1. Cloudflare: rota nomeprojeto.theviddev.org → localhost:80
2. Coolify: New Resource → Private Repository (Deploy Key) → Build Pack Docker → porta
3. Coolify: domínio http://nomeprojeto.theviddev.org + variáveis de ambiente
4. Servidor: criar database e correr migrations
5. Coolify: Deploy → "Rolling update completed" → testar https

## Erros comuns
- 502 → porta do Dockerfile ≠ Coolify · Too many redirects → https:// no domínio do Coolify
- 404 → redeploy · crash ao iniciar → falta env var · falha na exportação → Deploy outra vez

# Thevid Surveyor — Contrato de projeto (v2)

Todos os meus projetos ficam em E:\projects\ e são lidos por um dashboard local (Thevid
Surveyor) que mostra o estado real de cada um. Quando planeares uma app nova, o resultado
final tem de incluir estes 5 ficheiros na raiz, prontos a copiar, no formato EXATO abaixo:

1. SPEC.md — o que é, Features Core (v1), Fora de Scope, Stack, Modelo de dados,
   tabela "Decisões técnicas" (Decisão | Alternativa rejeitada | Razão).

2. PLAN.md — começa com:
     > Fase: ideia
     > URL:
   (fases possíveis: ideia · dev · mvp · produção · pausado)
   Depois secções "## Fase N — Nome" com passos "- [ ] passo".
   A fase de produção inclui os passos de deploy do homelab acima.

3. TASKS.md — secções exatamente "## Must Have", "## Should Have", "## Could Have",
   "## Won't Have (v1)", "## Tarefas Manuais".
   Cada task: "- [ ] Título" e na linha seguinte "  > Done quando: critério verificável".
   Estados: [x] feito (com data: "- [x] Título (YYYY-MM-DD)") · [~] em progresso ·
   [ ] por fazer · [!] bloqueado (razão na linha ">").
   Tudo o que eu tenho de fazer à mão (Cloudflare, Coolify, env vars, DB) vai para
   "## Tarefas Manuais".

4. CLAUDE.md — instruções para o Claude Code: resumo, regras do agente, como correr,
   secção de deploy do homelab, convenções, e OBRIGATORIAMENTE:
   - ler SPEC.md, TASKS.md e a última entrada do LOG.md antes de trabalhar
   - não implementar fora do SPEC sem confirmação
   - no fim de cada sessão com alterações: entrada no topo do LOG.md, TASKS.md
     atualizado, "> Fase:" do PLAN.md atualizada, commit de tudo
   - conhecimento do projeto vive no repo (CLAUDE.md / SPEC.md), nunca só na memória do agente

5. LOG.md — report de trabalho, mais recente no topo:
     ## YYYY-MM-DD — título
     **Feito:**
     - ...
     **Próximo:**
     - ...
     **Bloqueios:**
     - ... (ou "—")
   Começa com uma entrada do dia do planeamento.

Boas práticas que espero em todos os projetos: commits pequenos e frequentes, nada de
credenciais no repo, testes para a lógica core, Dockerfile e .env.example desde o início.
```

---

## Migrar para contrato v2

> Colar no Claude Code com a pasta do projeto aberta. O Surveyor mostra no modal de cada projeto o que lhe falta (secção "Migração v2").

```
Migra este projeto para o contrato v2 do Thevid Surveyor. Os templates de referência estão em
E:\projects\Thevid_Surveyor\templates\ (SPEC.md, PLAN.md, TASKS.md, CLAUDE.md, LOG.md) — lê-os primeiro.

Regras:
- Não alterar código da aplicação. Só os ficheiros do contrato (e .gitignore se necessário).
- Preservar todo o conteúdo existente; reorganizar para o formato do template, não reescrever.
- Não inventar estado: usa o código, o git log e os ficheiros existentes como fonte. Se não
  sabes se algo está feito, deixa [ ] e lista a dúvida no fim.

Passos:
1. Analisa o projeto: stack, estrutura, git log (últimos ~30 commits), ficheiros .md existentes,
   Dockerfile/.env.example/migrations.
2. SPEC.md — cria ou ajusta à estrutura do template; mantém o scope atual; preenche Stack e
   a tabela de Decisões técnicas com o que é evidente no código.
3. PLAN.md — adiciona o cabeçalho "> Fase:" (escolhe ideia/dev/mvp/produção/pausado com base
   no estado real) e "> URL:" se houver deploy; garante "## Fase N" com checkboxes.
4. TASKS.md — secções MoSCoW exatas; cada task com linha "> Done quando:"; tasks [x] ficam
   com data "(YYYY-MM-DD)" só quando a data é dedutível do git log; adiciona "## Tarefas Manuais".
5. CLAUDE.md — mantém o conteúdo específico do projeto e acrescenta as secções do template
   que faltam: Governance (com LOG.md e nota do Surveyor), Report de Trabalho, Conhecimento do
   Projeto, Tarefas Manuais, Deployment (homelab ou o deploy real do projeto).
6. Conhecimento fora do repo — se existir memória do Claude Code para este projeto em
   C:\Users\<user>\.claude\projects\<pasta-do-projeto>\memory\, lê-a e passa para CLAUDE.md
   (convenções) ou SPEC.md (decisões) o que for relevante.
7. LOG.md — cria com uma entrada de hoje "Migração para contrato v2" e, se útil, um resumo
   do histórico recente a partir do git log.
8. Mostra-me o resumo das alterações e as dúvidas antes de fazer commit.
```

---

## Coolify — Deploy Self-Hosted

> Já incluído no template `CLAUDE.md` (secção Deployment). Usar só para acrescentar a projetos antigos sem migrar o resto.

```
Este projeto é deployed num servidor self-hosted via Coolify. Quando precisares de preparar
este projeto para deploy ou criar ficheiros relacionados com infraestrutura, segue estas regras:

INFRAESTRUTURA:
- Painel Coolify: https://coolify.theviddev.org
- Domínio base: theviddev.org (cada projeto tem subdomínio próprio)
- Proxy: Traefik na porta 80, partilhado por todas as apps
- SSL: gerido pelo Cloudflare — domínios internos do Coolify usam sempre http:// nunca https://
- Base de dados: PostgreSQL self-hosted, contentor nbo4l6g9n630qrygbe404uao
- Build Pack: Docker — o projeto precisa de um Dockerfile na raiz

DOCKERFILE:
Cria um Dockerfile otimizado para produção na raiz do projeto. Usa multi-stage build.
Expõe a porta correta para a stack usada.

VARIÁVEIS DE AMBIENTE:
Lista todas as variáveis que o projeto precisa para correr. A DATABASE_URL segue o formato:
postgresql://postgres:PASSWORD@nbo4l6g9n630qrygbe404uao:5432/NOME_DB

BASE DE DADOS:
Se o projeto precisar de PostgreSQL, cria um ficheiro de migração SQL completo e pronto
a correr. A database é criada manualmente via docker exec no servidor.

REGRAS OBRIGATÓRIAS:
- O Dockerfile deve estar na raiz do repositório
- O domínio no Coolify usa sempre http:// (ex: http://nomeprojeto.theviddev.org)
- Cada projeto tem a sua própria database no PostgreSQL partilhado
- Nunca expor credenciais no código — usar sempre variáveis de ambiente
- O projeto deve ter um ficheiro .env.example com todas as variáveis necessárias sem valores

DEPLOY:
O deploy é feito pelo Coolify ligado ao GitHub via Deploy Key. Cada git push para main pode
triggerar deploy automático via webhook. O projeto fica acessível em
https://nomeprojeto.theviddev.org após configuração do Cloudflare Tunnel.
```
