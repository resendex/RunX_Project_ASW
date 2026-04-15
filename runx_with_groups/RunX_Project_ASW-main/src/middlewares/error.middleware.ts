import { Prisma } from "@prisma/client";
import type { ErrorRequestHandler, RequestHandler } from "express";
import { ZodError } from "zod";
import { isAppError } from "../utils/http-error";

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({
    error: {
      message: "Endpoint nao encontrado.",
      code: "NOT_FOUND"
    }
  });
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: {
        message: "Dados de entrada invalidos.",
        code: "VALIDATION_ERROR",
        details: error.issues
      }
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return res.status(409).json({
        error: {
          message: "Ja existe um registo com este valor unico.",
          code: "CONFLICT",
          details: error.meta
        }
      });
    }
  }

  if (isAppError(error)) {
    return res.status(error.statusCode).json({
      error: {
        message: error.message,
        code: error.code,
        details: error.details
      }
    });
  }

  console.error(error);

  return res.status(500).json({
    error: {
      message: "Erro interno do servidor.",
      code: "INTERNAL_SERVER_ERROR"
    }
  });
};