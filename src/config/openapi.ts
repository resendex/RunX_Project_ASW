import { env } from "./env";

export const openApiDoc = {
  openapi: "3.0.3",
  info: {
    title: "RunX API",
    version: "0.2.0",
    description: "API backend RunX - Fase 2"
  },
  servers: [{ url: `http://localhost:${env.PORT}` }],
  tags: [
    { name: "System", description: "Estado geral da API" },
    { name: "Auth", description: "Autenticacao e sessao" },
    { name: "Users", description: "Perfil do utilizador autenticado" },
    { name: "Feed", description: "Feed social" },
    { name: "Posts", description: "Publicacoes" },
    { name: "Reactions", description: "Reacoes em publicacoes" },
    { name: "Comments", description: "Comentarios em publicacoes" },
    { name: "Notifications", description: "Notificacoes do utilizador" },
    { name: "Runs", description: "Gestao de corridas" },
    { name: "Themes", description: "Temas disponiveis" },
    { name: "WeeklyGoals", description: "Metas semanais do utilizador" },
    { name: "Groups", description: "Grupos de corrida e eventos" }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          error: {
            type: "object",
            properties: {
              message: { type: "string" },
              code: { type: "string", nullable: true },
              details: {
                type: "object",
                nullable: true,
                additionalProperties: true
              }
            },
            required: ["message"]
          }
        },
        required: ["error"]
      },
      HealthResponse: {
        type: "object",
        properties: {
          ok: { type: "boolean" },
          service: { type: "string" }
        },
        required: ["ok", "service"]
      },
      UserProfile: {
        type: "object",
        properties: {
          id: { type: "integer" },
          username: { type: "string" },
          email: { type: "string", format: "email" },
          role: { type: "string", enum: ["RUNNER", "ORGANIZER"] },
          bio: { type: "string", nullable: true },
          avatarUrl: { type: "string", nullable: true },
          location: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: [
          "id",
          "username",
          "email",
          "role",
          "bio",
          "avatarUrl",
          "location",
          "createdAt",
          "updatedAt"
        ]
      },
      TokenPair: {
        type: "object",
        properties: {
          accessToken: { type: "string" },
          refreshToken: { type: "string" },
          refreshTokenExpiresAt: { type: "string", format: "date-time" }
        },
        required: ["accessToken", "refreshToken", "refreshTokenExpiresAt"]
      },
      AuthResponse: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/UserProfile" },
          tokens: { $ref: "#/components/schemas/TokenPair" }
        },
        required: ["user", "tokens"]
      },
      RegisterInput: {
        type: "object",
        properties: {
          username: { type: "string" },
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" }
        },
        required: ["username", "email", "password"]
      },
      LoginInput: {
        type: "object",
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", format: "password" }
        },
        required: ["email", "password"]
      },
      RefreshTokenInput: {
        type: "object",
        properties: {
          refreshToken: { type: "string" }
        },
        required: ["refreshToken"]
      },
      UpdateMeInput: {
        type: "object",
        properties: {
          username: { type: "string" },
          email: { type: "string", format: "email" },
          bio: { type: "string", nullable: true },
          location: { type: "string", nullable: true }
        }
      },
      UpdateAvatarInput: {
        type: "object",
        properties: {
          avatarUrl: { type: "string", format: "uri" }
        },
        required: ["avatarUrl"]
      },
      UserEnvelope: {
        type: "object",
        properties: {
          user: { $ref: "#/components/schemas/UserProfile" }
        },
        required: ["user"]
      },
      TokenEnvelope: {
        type: "object",
        properties: {
          tokens: { $ref: "#/components/schemas/TokenPair" }
        },
        required: ["tokens"]
      },
      Theme: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          emoji: { type: "string", nullable: true },
          colorHex: { type: "string", nullable: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "name", "createdAt", "updatedAt"]
      },
      CreateThemeInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          emoji: { type: "string", nullable: true },
          colorHex: { type: "string", pattern: "^#[0-9A-Fa-f]{6}$", nullable: true }
        },
        required: ["name"]
      },
      Run: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          startedAt: { type: "string", format: "date-time" },
          endedAt: { type: "string", format: "date-time" },
          distanceKm: { type: "number" },
          durationSec: { type: "integer" },
          avgPace: { type: "number", nullable: true },
          calories: { type: "integer", nullable: true },
          routeGeojson: { type: "object", nullable: true, additionalProperties: true },
          photoUrl: { type: "string", nullable: true },
          observations: { type: "string", nullable: true },
          motivationalPhrase: { type: "string", nullable: true },
          themeId: { type: "integer", nullable: true },
          weatherData: { type: "object", nullable: true, additionalProperties: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: [
          "id",
          "userId",
          "startedAt",
          "endedAt",
          "distanceKm",
          "durationSec",
          "createdAt",
          "updatedAt"
        ]
      },
      CreateRunInput: {
        type: "object",
        properties: {
          startedAt: { type: "string", format: "date-time" },
          endedAt: { type: "string", format: "date-time" },
          distanceKm: { type: "number" },
          durationSec: { type: "integer" },
          avgPace: { type: "number", nullable: true },
          calories: { type: "integer", nullable: true },
          routeGeojson: { type: "object", nullable: true, additionalProperties: true },
          photoUrl: { type: "string", format: "uri", nullable: true },
          observations: { type: "string", nullable: true },
          motivationalPhrase: { type: "string", nullable: true },
          themeId: { type: "integer", nullable: true },
          weatherData: { type: "object", nullable: true, additionalProperties: true }
        },
        required: ["startedAt", "endedAt", "distanceKm", "durationSec"]
      },
      UpdateRunInput: {
        type: "object",
        properties: {
          observations: { type: "string", nullable: true },
          motivationalPhrase: { type: "string", nullable: true },
          photoUrl: { type: "string", format: "uri", nullable: true },
          themeId: { type: "integer", nullable: true }
        }
      },
      WeekProgressResponse: {
        type: "object",
        properties: {
          weekStart: { type: "string", format: "date-time" },
          weekEnd: { type: "string", format: "date-time" },
          targetKm: { type: "number", nullable: true },
          achievedKm: { type: "number" },
          progressPercent: { type: "number", nullable: true },
          days: {
            type: "array",
            items: {
              type: "object",
              properties: {
                date: { type: "string" },
                runs: { type: "integer" },
                distanceKm: { type: "number" }
              },
              required: ["date", "runs", "distanceKm"]
            }
          }
        },
        required: ["weekStart", "weekEnd", "achievedKm", "days"]
      },
      SuggestRouteResponse: {
        type: "object",
        properties: {
          runId: { type: "integer" },
          status: { type: "string" },
          message: { type: "string" },
          currentRoute: { type: "object", nullable: true, additionalProperties: true }
        },
        required: ["runId", "status", "message"]
      },
      WeeklyGoal: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          weekStart: { type: "string", format: "date-time" },
          targetKm: { type: "number" },
          achievedKm: { type: "number" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "userId", "weekStart", "targetKm", "achievedKm"]
      },
      UpsertWeeklyGoalInput: {
        type: "object",
        properties: {
          weekStart: { type: "string", format: "date-time" },
          targetKm: { type: "number" }
        },
        required: ["weekStart", "targetKm"]
      },
      Post: {
        type: "object",
        properties: {
          id: { type: "integer" },
          authorId: { type: "integer" },
          groupId: { type: "integer", nullable: true },
          content: { type: "string", nullable: true },
          runId: { type: "integer", nullable: true },
          groupEventId: { type: "integer", nullable: true },
          visibility: { type: "string", enum: ["PUBLIC", "GROUP", "PRIVATE"] },
          isAnonymous: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "authorId", "visibility", "isAnonymous", "createdAt", "updatedAt"]
      },
      CreatePostInput: {
        type: "object",
        properties: {
          groupId: { type: "integer", nullable: true },
          content: { type: "string", nullable: true, maxLength: 2000 },
          runId: { type: "integer", nullable: true },
          groupEventId: { type: "integer", nullable: true },
          visibility: { type: "string", enum: ["PUBLIC", "GROUP", "PRIVATE"] },
          isAnonymous: { type: "boolean" }
        }
      },
      AddReactionInput: {
        type: "object",
        properties: {
          type: { type: "string", enum: ["LIKE", "LOVE", "CLAP", "FIRE"] }
        }
      },
      AddCommentInput: {
        type: "object",
        properties: {
          content: { type: "string", minLength: 1, maxLength: 1000 }
        },
        required: ["content"]
      },
      Notification: {
        type: "object",
        properties: {
          id: { type: "integer" },
          userId: { type: "integer" },
          type: { type: "string" },
          title: { type: "string" },
          body: { type: "string" },
          isRead: { type: "boolean" },
          payload: { type: "object", nullable: true, additionalProperties: true },
          createdAt: { type: "string", format: "date-time" }
        },
        required: ["id", "userId", "type", "title", "body", "isRead", "createdAt"]
      },
      Group: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          description: { type: "string", nullable: true },
          createdById: { type: "integer" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "name", "createdById", "createdAt", "updatedAt"]
      },
      GroupEvent: {
        type: "object",
        properties: {
          id: { type: "integer" },
          groupId: { type: "integer" },
          createdById: { type: "integer" },
          title: { type: "string" },
          description: { type: "string", nullable: true },
          eventDate: { type: "string", format: "date-time" },
          themeId: { type: "integer", nullable: true },
          routeGeojson: { type: "object", nullable: true, additionalProperties: true },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "groupId", "createdById", "title", "eventDate", "createdAt", "updatedAt"]
      },
      CreateGroupInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string", nullable: true }
        },
        required: ["name"]
      },
      UpdateGroupInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string", nullable: true }
        }
      },
      AddGroupMemberInput: {
        type: "object",
        properties: {
          userId: { type: "integer" }
        },
        required: ["userId"]
      },
      CreateGroupEventInput: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string", nullable: true },
          eventDate: { type: "string", format: "date-time" },
          themeId: { type: "integer", nullable: true },
          routeGeojson: { type: "object", nullable: true, additionalProperties: true }
        },
        required: ["title", "eventDate"]
      },
      UpdateGroupEventInput: {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string", nullable: true },
          eventDate: { type: "string", format: "date-time" },
          themeId: { type: "integer", nullable: true },
          routeGeojson: { type: "object", nullable: true, additionalProperties: true }
        }
      },
      GenericEnvelope: {
        type: "object",
        additionalProperties: true
      }
    }
  },
  paths: {
    "/health": {
      get: {
        tags: ["System"],
        summary: "Health check",
        responses: {
          "200": {
            description: "API saudavel",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/HealthResponse" }
              }
            }
          }
        }
      }
    },
    "/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Registar novo utilizador",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RegisterInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Utilizador registado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" }
              }
            }
          },
          "409": {
            description: "Conflito de email/username",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Iniciar sessao",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/LoginInput" }
            }
          }
        },
        responses: {
          "200": {
            description: "Login efetuado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" }
              }
            }
          },
          "401": {
            description: "Credenciais invalidas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/auth/refresh": {
      post: {
        tags: ["Auth"],
        summary: "Renovar access token via refresh token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshTokenInput" }
            }
          }
        },
        responses: {
          "200": {
            description: "Tokens renovados",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TokenEnvelope" }
              }
            }
          },
          "401": {
            description: "Refresh token invalido",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Terminar sessao (revoga refresh token)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/RefreshTokenInput" }
            }
          }
        },
        responses: {
          "204": {
            description: "Sessao terminada"
          }
        }
      }
    },
    "/users/me": {
      get: {
        tags: ["Users"],
        summary: "Obter perfil do utilizador autenticado",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Perfil retornado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserEnvelope" }
              }
            }
          },
          "401": {
            description: "Nao autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      put: {
        tags: ["Users"],
        summary: "Atualizar perfil do utilizador autenticado",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateMeInput" }
            }
          }
        },
        responses: {
          "200": {
            description: "Perfil atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserEnvelope" }
              }
            }
          },
          "409": {
            description: "Email ou username ja existente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Users"],
        summary: "Eliminar conta do utilizador autenticado",
        security: [{ BearerAuth: [] }],
        responses: {
          "204": {
            description: "Conta eliminada"
          }
        }
      }
    },
    "/users/me/avatar": {
      post: {
        tags: ["Users"],
        summary: "Atualizar avatar do utilizador autenticado",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateAvatarInput" }
            }
          }
        },
        responses: {
          "200": {
            description: "Avatar atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UserEnvelope" }
              }
            }
          }
        }
      }
    },
    "/feed": {
      get: {
        tags: ["Feed"],
        summary: "Obter feed social do utilizador autenticado",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, default: 1 }
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 50, default: 10 }
          }
        ],
        responses: {
          "200": {
            description: "Feed retornado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GenericEnvelope" }
              }
            }
          },
          "401": {
            description: "Nao autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/posts": {
      post: {
        tags: ["Posts"],
        summary: "Criar publicacao",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreatePostInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Publicacao criada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Post" }
              }
            }
          },
          "400": {
            description: "Dados invalidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/posts/{id}": {
      get: {
        tags: ["Posts"],
        summary: "Obter publicacao por ID",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 }
          }
        ],
        responses: {
          "200": {
            description: "Publicacao retornada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GenericEnvelope" }
              }
            }
          },
          "404": {
            description: "Publicacao nao encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Posts"],
        summary: "Eliminar publicacao",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 }
          }
        ],
        responses: {
          "204": { description: "Publicacao eliminada" },
          "403": {
            description: "Sem permissao",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "404": {
            description: "Publicacao nao encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/posts/{id}/reactions": {
      post: {
        tags: ["Reactions"],
        summary: "Adicionar ou atualizar reacao na publicacao",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddReactionInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Reacao registada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GenericEnvelope" }
              }
            }
          },
          "400": {
            description: "Dados invalidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Reactions"],
        summary: "Remover reacao da publicacao",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 }
          }
        ],
        responses: {
          "204": { description: "Reacao removida" }
        }
      }
    },
    "/posts/{id}/comments": {
      post: {
        tags: ["Comments"],
        summary: "Adicionar comentario numa publicacao",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 }
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddCommentInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Comentario criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/GenericEnvelope" }
              }
            }
          },
          "400": {
            description: "Dados invalidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/posts/comments/{id}": {
      delete: {
        tags: ["Comments"],
        summary: "Eliminar comentario",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "integer", minimum: 1 }
          }
        ],
        responses: {
          "204": { description: "Comentario eliminado" },
          "403": {
            description: "Sem permissao",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          },
          "404": {
            description: "Comentario nao encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/notifications": {
      get: {
        tags: ["Notifications"],
        summary: "Listar notificacoes do utilizador autenticado",
        security: [{ BearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, default: 1 }
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: { type: "integer", minimum: 1, maximum: 50, default: 10 }
          }
        ],
        responses: {
          "200": {
            description: "Notificacoes retornadas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Notification" }
                    },
                    page: { type: "integer" },
                    limit: { type: "integer" },
                    total: { type: "integer" },
                    totalPages: { type: "integer" }
                  },
                  required: ["data", "page", "limit", "total", "totalPages"]
                }
              }
            }
          }
        }
      }
    },
    "/runs": {
      get: {
        tags: ["Runs"],
        summary: "Listar corridas do utilizador autenticado",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "themeId", in: "query", required: false, schema: { type: "integer", minimum: 1 } },
          { name: "from", in: "query", required: false, schema: { type: "string", format: "date-time" } },
          { name: "to", in: "query", required: false, schema: { type: "string", format: "date-time" } },
          { name: "search", in: "query", required: false, schema: { type: "string" } },
          { name: "limit", in: "query", required: false, schema: { type: "integer", minimum: 1, maximum: 100 } },
          { name: "offset", in: "query", required: false, schema: { type: "integer", minimum: 0 } }
        ],
        responses: {
          "200": {
            description: "Corridas retornadas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    runs: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Run" }
                    }
                  },
                  required: ["runs"]
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Runs"],
        summary: "Criar corrida",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateRunInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Corrida criada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    run: { $ref: "#/components/schemas/Run" }
                  },
                  required: ["run"]
                }
              }
            }
          },
          "400": {
            description: "Dados invalidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/runs/week": {
      get: {
        tags: ["Runs"],
        summary: "Obter progresso semanal",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Progresso semanal retornado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/WeekProgressResponse" }
              }
            }
          }
        }
      }
    },
    "/runs/{id}": {
      get: {
        tags: ["Runs"],
        summary: "Obter corrida por ID",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        responses: {
          "200": {
            description: "Corrida retornada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    run: { $ref: "#/components/schemas/Run" }
                  },
                  required: ["run"]
                }
              }
            }
          },
          "404": {
            description: "Corrida nao encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      put: {
        tags: ["Runs"],
        summary: "Atualizar corrida",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateRunInput" }
            }
          }
        },
        responses: {
          "200": {
            description: "Corrida atualizada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    run: { $ref: "#/components/schemas/Run" }
                  },
                  required: ["run"]
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Runs"],
        summary: "Eliminar corrida",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        responses: {
          "204": { description: "Corrida eliminada" }
        }
      }
    },
    "/runs/{id}/suggest-route": {
      get: {
        tags: ["Runs"],
        summary: "Sugerir variante de rota (stub Fase 3)",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        responses: {
          "200": {
            description: "Resposta de sugestao retornada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuggestRouteResponse" }
              }
            }
          }
        }
      }
    },
    "/themes": {
      get: {
        tags: ["Themes"],
        summary: "Listar temas",
        responses: {
          "200": {
            description: "Temas retornados",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    themes: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Theme" }
                    }
                  },
                  required: ["themes"]
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Themes"],
        summary: "Criar tema",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateThemeInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Tema criado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    theme: { $ref: "#/components/schemas/Theme" }
                  },
                  required: ["theme"]
                }
              }
            }
          }
        }
      }
    },
    "/themes/{id}": {
      get: {
        tags: ["Themes"],
        summary: "Obter tema por ID",
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        responses: {
          "200": {
            description: "Tema retornado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    theme: { $ref: "#/components/schemas/Theme" }
                  },
                  required: ["theme"]
                }
              }
            }
          },
          "404": {
            description: "Tema nao encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Themes"],
        summary: "Eliminar tema",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        responses: {
          "204": { description: "Tema eliminado" }
        }
      }
    },
    "/weekly-goals": {
      get: {
        tags: ["WeeklyGoals"],
        summary: "Listar metas do utilizador autenticado",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Metas retornadas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    goals: {
                      type: "array",
                      items: { $ref: "#/components/schemas/WeeklyGoal" }
                    }
                  },
                  required: ["goals"]
                }
              }
            }
          }
        }
      },
      put: {
        tags: ["WeeklyGoals"],
        summary: "Criar ou atualizar meta semanal",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpsertWeeklyGoalInput" }
            }
          }
        },
        responses: {
          "200": {
            description: "Meta guardada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    goal: { $ref: "#/components/schemas/WeeklyGoal" }
                  },
                  required: ["goal"]
                }
              }
            }
          }
        }
      }
    },
    "/weekly-goals/current": {
      get: {
        tags: ["WeeklyGoals"],
        summary: "Obter meta/progresso da semana atual",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Progresso atual retornado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    weeklyGoal: {
                      type: "object",
                      additionalProperties: true
                    }
                  },
                  required: ["weeklyGoal"]
                }
              }
            }
          }
        }
      }
    },
    "/weekly-goals/{id}": {
      delete: {
        tags: ["WeeklyGoals"],
        summary: "Eliminar meta semanal",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        responses: {
          "204": { description: "Meta eliminada" },
          "404": {
            description: "Meta nao encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      }
    },
    "/groups": {
      get: {
        tags: ["Groups"],
        summary: "Listar grupos",
        security: [{ BearerAuth: [] }],
        responses: {
          "200": {
            description: "Grupos retornados",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    groups: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Group" }
                    }
                  },
                  required: ["groups"]
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Groups"],
        summary: "Criar grupo",
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateGroupInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Grupo criado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    group: { $ref: "#/components/schemas/GenericEnvelope" }
                  },
                  required: ["group"]
                }
              }
            }
          }
        }
      }
    },
    "/groups/{id}": {
      get: {
        tags: ["Groups"],
        summary: "Obter grupo por ID",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        responses: {
          "200": {
            description: "Grupo retornado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    group: { $ref: "#/components/schemas/GenericEnvelope" }
                  },
                  required: ["group"]
                }
              }
            }
          },
          "404": {
            description: "Grupo nao encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" }
              }
            }
          }
        }
      },
      put: {
        tags: ["Groups"],
        summary: "Atualizar grupo",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateGroupInput" }
            }
          }
        },
        responses: {
          "200": {
            description: "Grupo atualizado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    group: { $ref: "#/components/schemas/GenericEnvelope" }
                  },
                  required: ["group"]
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Groups"],
        summary: "Eliminar grupo",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        responses: {
          "204": { description: "Grupo eliminado" }
        }
      }
    },
    "/groups/{id}/members": {
      post: {
        tags: ["Groups"],
        summary: "Adicionar membro ao grupo",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AddGroupMemberInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Membro adicionado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    member: { $ref: "#/components/schemas/GenericEnvelope" }
                  },
                  required: ["member"]
                }
              }
            }
          }
        }
      }
    },
    "/groups/{id}/members/{uid}": {
      delete: {
        tags: ["Groups"],
        summary: "Remover membro do grupo",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } },
          { name: "uid", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        responses: {
          "204": { description: "Membro removido" }
        }
      }
    },
    "/groups/{id}/events": {
      get: {
        tags: ["Groups"],
        summary: "Listar eventos do grupo",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        responses: {
          "200": {
            description: "Eventos retornados",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    events: {
                      type: "array",
                      items: { $ref: "#/components/schemas/GroupEvent" }
                    }
                  },
                  required: ["events"]
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Groups"],
        summary: "Criar evento no grupo",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateGroupEventInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Evento criado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    event: { $ref: "#/components/schemas/GroupEvent" }
                  },
                  required: ["event"]
                }
              }
            }
          }
        }
      }
    },
    "/groups/{id}/events/{eid}": {
      put: {
        tags: ["Groups"],
        summary: "Atualizar evento do grupo",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } },
          { name: "eid", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateGroupEventInput" }
            }
          }
        },
        responses: {
          "200": {
            description: "Evento atualizado",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    event: { $ref: "#/components/schemas/GroupEvent" }
                  },
                  required: ["event"]
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Groups"],
        summary: "Eliminar evento do grupo",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } },
          { name: "eid", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        responses: {
          "204": { description: "Evento eliminado" }
        }
      }
    },
    "/groups/{id}/events/{eid}/join": {
      post: {
        tags: ["Groups"],
        summary: "Entrar no evento do grupo",
        security: [{ BearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "integer", minimum: 1 } },
          { name: "eid", in: "path", required: true, schema: { type: "integer", minimum: 1 } }
        ],
        responses: {
          "200": {
            description: "Participacao confirmada",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    participation: { $ref: "#/components/schemas/GenericEnvelope" }
                  },
                  required: ["participation"]
                }
              }
            }
          }
        }
      }
    }
  }
} as const;
