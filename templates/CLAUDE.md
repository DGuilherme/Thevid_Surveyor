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
| `CLAUDE.md` | Este ficheiro |

---

## Regras do Agente

1. **Lê sempre `SPEC.md` e `TASKS.md`** antes de começar qualquer feature.
2. **Usa Plan Mode** antes de qualquer mudança que toque mais de 2 ficheiros.
3. **Não implementas nada que não esteja em `SPEC.md`** — se for necessário, atualiza o spec primeiro e aguarda confirmação.
4. **Quando uma task fica completa**, atualiza o `[~]` ou `[ ]` para `[x]` em `TASKS.md` (e em `PLAN.md` se a fase ficar concluída).
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

## Deployment

| Ambiente | Plataforma | URL |
|----------|-----------|-----|
| Produção | Vercel / Coolify / localhost | https://TODO |

```bash
# Como fazer deploy
# ex: push para main → auto-deploy no Coolify
# ex: vercel --prod
```

---

## Convenções

- Sem comentários no código salvo quando o porquê é não-óbvio.
- Sem abstrações prematuras — três linhas repetidas é melhor que uma abstração desnecessária.
- [Adicionar convenções específicas do projeto]

---

## O que NÃO fazer

- Não implementar features fora de `SPEC.md` sem atualizar o spec primeiro.
- Não marcar tasks como done sem ter corrido os testes.
- [Adicionar restrições específicas do projeto]
