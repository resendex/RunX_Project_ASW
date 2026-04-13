# RunX - Backend Fase 2

Backend da aplicacao Web RunX, implementado com Node.js + Express + Prisma + PostgreSQL.

## Stack

- Node.js + TypeScript
- Express (API REST)
- Prisma ORM
- PostgreSQL
- Zod (validacao)
- JWT + bcrypt (autenticacao)
- Swagger UI (documentacao interativa)

## Arquitetura

Separacao em camadas:

- `src/routes` -> definicao de endpoints e middlewares por rota
- `src/controllers` -> adaptacao HTTP (request/response)
- `src/services` -> regras de negocio
- `src/models` -> acesso a dados via Prisma
- `src/schemas` -> validacao de inputs com Zod
- `src/middlewares` -> autenticacao, validacao e tratamento de erro

## Requisitos

- Node.js 20+
- PostgreSQL 14+
- npm

## Setup local

1. Instalar dependencias:

```bash
npm install
```

2. Criar `.env` com base no exemplo:

```bash
cp .env.example .env
```

3. Atualizar credenciais no `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/runx_fase2?schema=public"
PORT=3000
JWT_ACCESS_SECRET="change_me_access"
JWT_REFRESH_SECRET="change_me_refresh"
JWT_ACCESS_EXPIRES_IN="1h"
JWT_REFRESH_EXPIRES_IN="7d"
OPENWEATHER_API_KEY=""
```

4. Criar base de dados (exemplo):

```bash
createdb runx_fase2
```

5. Gerar Prisma Client e aplicar migracoes:

```bash
npm run prisma:generate
npm run prisma:migrate
```

6. Arrancar servidor em dev:

```bash
npm run dev
```

## Build

```bash
npm run build
```

## URLs uteis

- API: `http://localhost:3000`
- Health: `http://localhost:3000/health`
- Swagger: `http://localhost:3000/api-docs`

## Endpoints implementados (Core/Auth - Jose)

Auth:

- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `POST /auth/logout`

User autenticado:

- `GET /users/me`
- `PUT /users/me`
- `DELETE /users/me`
- `POST /users/me/avatar`

## Testes de autenticacao

Existe um guiao de testes manuais em:

- `docs/auth-tests.md`

Inclui fluxo completo: register -> login -> endpoint protegido -> refresh -> logout.

## Entidades Prisma ja modeladas

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
