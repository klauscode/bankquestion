# Vestibular Question Bank

Aplicacao MVP para banco de questoes de vestibular com foco em ENEM, FUVEST, UNICAMP e VUNESP.

## Stack

- Next.js 16.2 com App Router e TypeScript
- Tailwind CSS
- shadcn/ui
- Supabase para Postgres, Auth e RLS
- Zod para validacao no servidor
- Recharts para graficos

## MVP

- UI em Portugues do Brasil
- Landing page publica
- Login, cadastro e confirmacao de email
- Dashboard autenticado
- Fluxo de pratica com filtros e sessoes fixas
- Historico de tentativas
- Importacao de questoes apenas no servidor, protegida por allowlist de emails
- Estrutura pronta para paywall futuro via `profiles.plan`

## Variaveis de Ambiente

Copie `.env.example` para `.env.local` e preencha:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_EMAILS=admin@example.com
```

## Setup Local

1. Instale dependencias:

```bash
npm install
```

2. Configure o projeto Supabase:
- Crie um projeto no Supabase
- Ative Email Auth
- Configure a URL da aplicacao para o ambiente local e de producao
- Adicione a URL de callback para `/auth/confirm`

3. Rode a migracao SQL em `db/migration.sql`.

4. Rode o seed em `db/seed.sql`.

5. Suba a aplicacao:

```bash
npm run dev
```

## Ordem de Implementacao

1. Base do app e layout compartilhado
2. Clientes SSR do Supabase e `proxy.ts`
3. Auth com cadastro, login, logout e confirmacao de email
4. Schema SQL, RLS, indexes e seed
5. Schemas Zod e tipos de dominio
6. Sessao de pratica com filtros e protecao contra envio duplicado
7. Dashboard com KPIs, tabelas e grafico
8. Historico com filtros e paginacao
9. Importacao administrativa via acao/utilitario no servidor
10. Refinos de README, custos e observabilidade

## Banco de Dados

Tabelas principais:

- `profiles`
- `questions`
- `attempts`
- `bookmarks`
- `practice_sessions`
- `practice_session_items`

Regras importantes:

- `questions.source_ref` e a chave canonica de importacao
- `attempts.session_id` liga a tentativa a uma sessao fixa
- `practice_session_items` persiste a ordem sorteada da sessao
- RLS em `profiles`, `attempts`, `bookmarks`, `practice_sessions` e `practice_session_items`

## Importacao de Questoes

O contrato canonico fica em `db/questions-import.schema.json`.

Fluxo:

1. O script Python gera um array JSON no formato definido
2. O servidor valida com Zod
3. `importQuestions(data)` faz upsert por `source_ref`
4. Apenas emails em `ADMIN_EMAILS` podem disparar a importacao

## Como Rodar Migracao e Seed

Via SQL Editor do Supabase ou CLI:

```bash
supabase db reset
```

Ou aplique manualmente:

1. Execute `db/migration.sql`
2. Execute `db/seed.sql`

## Como Integrar o Script Python

- O script deve produzir objetos compativeis com `db/questions-import.schema.json`
- Campos opcionais podem ser `null`
- `source_ref` deve ser estavel por questao
- O import do app faz validacao e upsert, nao deduplicacao heuristica

## Gate de Planos no Futuro

O MVP libera tudo para usuarios `free`, mas a estrutura ja suporta paywall:

- `profiles.plan`: `free`, `pro`, `lifetime`
- `profiles.plan_expires_at`: expiracao opcional
- Futuro webhook do Stripe atualiza o perfil
- Feature gating deve ser implementado no servidor, nao apenas no cliente

## Custos e Escala

Os valores exatos mudam com o tempo. Consulte sempre a documentacao oficial antes de contratar.

Cenarios praticos para um app textual com imagens externas:

- `100 usuarios`: confortavelmente em tiers gratuitos na maior parte dos casos
- `1.000 usuarios`: normalmente ainda cabe em Supabase pago basico e Vercel com margem moderada
- `5.000 usuarios`: revisar largura de banda, volume de tentativas, politicas de cache, pooling e agregacoes

Quando revisar arquitetura:

- Ativar pooling ao notar aumento de concorrencia e latencia em consultas
- Promover agregacoes para materialized view quando dashboard ficar caro
- Mover importacoes pesadas para job assíncrono quando volume crescer

## Comandos

```bash
npm run dev
npm run build
npm run start
npm run lint
```
