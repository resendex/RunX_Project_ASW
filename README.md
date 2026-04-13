# RunX - Backend Fase 2

Base inicial do backend da Fase 2 com:

- Estrutura em camadas (routes, controllers, services, models)
- PostgreSQL + Prisma com modelo de dados completo
- Ponto de entrada Express
- Swagger disponível em `/api-docs`
- Preparado para autenticação JWT, validação com Zod e integração OpenWeather

## 1. Requisitos

- Node.js 20+
- PostgreSQL 14+
- npm

## 2. Setup local

1. Instalar dependências:

```bash
npm install
```

2. Criar `.env` a partir de `.env.example` e ajustar credenciais:

```bash
cp .env.example .env
```

3. Criar a base de dados (exemplo):

```bash
createdb runx_fase2
```

4. Gerar cliente Prisma e aplicar migração inicial:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Arrancar servidor em modo desenvolvimento:

```bash
npm run dev
```

## 3. URLs úteis

- API: `http://localhost:3000`
- Health check: `http://localhost:3000/health`
- Swagger: `http://localhost:3000/api-docs`

## 4. Modelos já incluídos no Prisma

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

## 5. Recomendações de trabalho em equipa

- Uma branch por tema:
  - `feature/auth`
  - `feature/runs`
  - `feature/groups`
  - `feature/feed-docs`
- Cada feature deve trazer:
  - rota
  - controller
  - service
  - schema Zod
  - documentação Swagger do endpoint
