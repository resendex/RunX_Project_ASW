# Testes de autenticacao (manual)

## Pre-condicoes

- API a correr em `http://localhost:3000`
- Base de dados migrada
- `curl` disponivel

## 1) Register

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "jose_resende",
    "email": "jose@example.com",
    "password": "RunX2026"
  }'
```

Resultado esperado:
- `201 Created`
- resposta com `user` e `tokens`

## 2) Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jose@example.com",
    "password": "RunX2026"
  }'
```

Resultado esperado:
- `200 OK`
- `tokens.accessToken` e `tokens.refreshToken`

## 3) GET /users/me (autenticado)

```bash
curl -X GET http://localhost:3000/users/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Resultado esperado:
- `200 OK`
- resposta com `user`

## 4) PUT /users/me

```bash
curl -X PUT http://localhost:3000/users/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "bio": "Runner amador focado em 10K",
    "location": "Lisboa"
  }'
```

Resultado esperado:
- `200 OK`
- resposta com `user` atualizado

## 5) POST /users/me/avatar

```bash
curl -X POST http://localhost:3000/users/me/avatar \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "avatarUrl": "https://example.com/avatar.jpg"
  }'
```

Resultado esperado:
- `200 OK`
- resposta com `user.avatarUrl` atualizado

## 6) Refresh token

```bash
curl -X POST http://localhost:3000/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<REFRESH_TOKEN>"
  }'
```

Resultado esperado:
- `200 OK`
- resposta com novo `tokens`

## 7) Logout

```bash
curl -X POST http://localhost:3000/auth/logout \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<REFRESH_TOKEN>"
  }' -i
```

Resultado esperado:
- `204 No Content`

## 8) DELETE /users/me

```bash
curl -X DELETE http://localhost:3000/users/me \
  -H "Authorization: Bearer <ACCESS_TOKEN>" -i
```

Resultado esperado:
- `204 No Content`
