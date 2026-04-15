# Testes manuais - grupos e eventos

## Pre-condicoes

- API a correr em `http://localhost:3000`
- Base de dados migrada
- Utilizador autenticado (token JWT)
- `curl` disponivel

## 1) Criar grupo

```bash
curl -X POST http://localhost:3000/groups \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ribeira Runners",
    "description": "Grupo de corridas semanais em Lisboa"
  }'
```

Resultado esperado:

- `201 Created`
- resposta com `group` e respetivo `id`

## 2) Listar grupos

```bash
curl -X GET http://localhost:3000/groups \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Resultado esperado:

- `200 OK`
- lista de grupos em `groups`

## 3) Obter grupo por id

```bash
curl -X GET http://localhost:3000/groups/<GROUP_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Resultado esperado:

- `200 OK`
- detalhes do grupo em `group`

## 4) Atualizar grupo

```bash
curl -X PUT http://localhost:3000/groups/<GROUP_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Treinos e corridas de fim de semana"
  }'
```

Resultado esperado:

- `200 OK`
- `group` atualizado

## 5) Adicionar membro ao grupo

```bash
curl -X POST http://localhost:3000/groups/<GROUP_ID>/members \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": <USER_ID_A_ADICIONAR>
  }'
```

Resultado esperado:

- `201 Created`
- resposta com `member`

## 6) Criar evento no grupo

```bash
curl -X POST http://localhost:3000/groups/<GROUP_ID>/events \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Treino de sabado",
    "description": "Corrida de 10km",
    "eventDate": "2026-04-20T09:00:00.000Z"
  }'
```

Resultado esperado:

- `201 Created`
- resposta com `event` e respetivo `id`

## 7) Listar eventos do grupo

```bash
curl -X GET http://localhost:3000/groups/<GROUP_ID>/events \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Resultado esperado:

- `200 OK`
- lista de eventos em `events`

## 8) Atualizar evento

```bash
curl -X PUT http://localhost:3000/groups/<GROUP_ID>/events/<EVENT_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Corrida de 12km com novo percurso"
  }'
```

Resultado esperado:

- `200 OK`
- `event` atualizado

## 9) Entrar num evento

```bash
curl -X POST http://localhost:3000/groups/<GROUP_ID>/events/<EVENT_ID>/join \
  -H "Authorization: Bearer <ACCESS_TOKEN>"
```

Resultado esperado:

- `200 OK`
- resposta com `participation`

## 10) Remover membro

```bash
curl -X DELETE http://localhost:3000/groups/<GROUP_ID>/members/<USER_ID_A_REMOVER> \
  -H "Authorization: Bearer <ACCESS_TOKEN>" -i
```

Resultado esperado:

- `204 No Content`

## 11) Apagar evento

```bash
curl -X DELETE http://localhost:3000/groups/<GROUP_ID>/events/<EVENT_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>" -i
```

Resultado esperado:

- `204 No Content`

## 12) Apagar grupo

```bash
curl -X DELETE http://localhost:3000/groups/<GROUP_ID> \
  -H "Authorization: Bearer <ACCESS_TOKEN>" -i
```

Resultado esperado:

- `204 No Content`
