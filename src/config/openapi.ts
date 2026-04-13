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
    { name: "Users", description: "Perfil do utilizador autenticado" }
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
            description: "API saudavel"
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
    }
  }
} as const;