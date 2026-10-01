# Prompt Templates — Instruções Reutilizáveis

Copia o bloco relevante para o `CLAUDE.md` do projeto antes de começar.

---

## Índice

- [Coolify — Deploy Self-Hosted](#coolify--deploy-self-hosted)

---

## Coolify — Deploy Self-Hosted

> Usar quando o projeto vai ser deployed via Coolify no servidor self-hosted.

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
