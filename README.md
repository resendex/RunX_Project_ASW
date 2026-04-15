# RunX - Backend Fase 2

Backend da aplicacao Web RunX, implementado com Node.js, Express, Prisma e PostgreSQL.

## Estado da fase

- Estrutura de backend por camadas concluida.
- Modulos de autenticacao, utilizadores, corridas, feed social, temas, metas semanais e grupos implementados.
- Integracoes externas (tempo real e sugestao de rotas por IA) nao sao requisito obrigatorio desta fase e estao tratadas como opcional/stub.

## Stack

- Node.js + TypeScript
- Express (API REST)
- Prisma ORM + PostgreSQL
- Zod (validacao)
- JWT + bcrypt (autenticacao)
- Swagger UI (documentacao interativa)

## Arquitetura

Separacao em camadas:

- `src/routes` - definicao de endpoints e middlewares por rota
- `src/controllers` - adaptacao HTTP (request/response)
- `src/services` - regras de negocio
- `src/models` - acesso a dados via Prisma
- `src/schemas` - validacao de inputs com Zod
- `src/middlewares` - autenticacao, validacao e tratamento de erro

## Requisitos

- Node.js 20+
- PostgreSQL 14+
- npm

## Setup local

1. Instalar dependencias.

```bash
npm install
```

2. Criar `.env` com base no exemplo.

```bash
cp .env.example .env
```

3. Atualizar credenciais no `.env`.

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/runx_fase2?schema=public"
PORT=3000
JWT_ACCESS_SECRET="change_me_access"
JWT_REFRESH_SECRET="change_me_refresh"
JWT_ACCESS_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"
OPENWEATHER_API_KEY=""
```

4. Criar base de dados (exemplo).

```bash
createdb runx_fase2
```

5. Gerar Prisma Client e aplicar migracoes.

```bash
npm run prisma:generate
npm run prisma:migrate
```

6. Arrancar servidor em dev.

```bash
npm run dev
```

## Scripts

- `npm run dev` - modo desenvolvimento com watch
- `npm run build` - compilacao TypeScript
- `npm run start` - executar build em `dist`
- `npm run prisma:generate` - gerar Prisma Client
- `npm run prisma:migrate` - aplicar migracoes
- `npm run prisma:studio` - abrir Prisma Studio

## URLs uteis

- API: `http://localhost:3000`
- Health: `http://localhost:3000/health`
- Swagger: `http://localhost:3000/api-docs`

## Endpoints implementados

### Sistema

- `GET /health`

### Auth

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

### Utilizador autenticado

- `GET /users/me`
- `PUT /users/me`
- `DELETE /users/me`
- `POST /users/me/avatar`

### Runs

- `GET /runs`
- `POST /runs`
- `GET /runs/week`
- `GET /runs/:id`
- `PUT /runs/:id`
- `DELETE /runs/:id`
- `GET /runs/:id/suggest-route` (stub para fases seguintes)

### Themes

- `GET /themes`
- `GET /themes/:id`
- `POST /themes`
- `DELETE /themes/:id`

### Weekly Goals

- `GET /weekly-goals`
- `GET /weekly-goals/current`
- `PUT /weekly-goals`
- `DELETE /weekly-goals/:id`

### Feed, posts e interacoes

- `GET /feed`
- `POST /posts`
- `GET /posts/:id`
- `DELETE /posts/:id`
- `POST /posts/:id/reactions`
- `DELETE /posts/:id/reactions`
- `POST /posts/:id/comments`
- `DELETE /posts/comments/:id`
- `GET /notifications`

### Groups

- `GET /groups`
- `POST /groups`
- `GET /groups/:id`
- `PUT /groups/:id`
- `DELETE /groups/:id`
- `POST /groups/:id/members`
- `DELETE /groups/:id/members/:uid`
- `GET /groups/:id/events`
- `POST /groups/:id/events`
- `PUT /groups/:id/events/:eid`
- `DELETE /groups/:id/events/:eid`
- `POST /groups/:id/events/:eid/join`

## Testes manuais

- Guia de autenticacao: `docs/auth-tests.md`
- Guia de grupos e eventos: `docs/groups-tests.md`

## Relatorio final da fase

- Ver `docs/relatorio-final-fase2.md`
- Versao TeX: `docs/relatorio-final-fase2.tex`

## Entidades Prisma modeladas

- User
- Run
- Theme
- Group
- GroupMember
- GroupEvent
- EventParticipation
- Post
- PostReaction
- PostComment
- WeeklyGoal
- Notification
- RouteSuggestion
- WeeklyReport
- RefreshToken
