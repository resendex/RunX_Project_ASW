import { UserRole } from "@prisma/client";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import { AppError } from "../utils/http-error";
import { verifyAccessToken } from "../utils/jwt";

export const authenticate: RequestHandler = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return next(new AppError("Token de acesso em falta.", 401, "UNAUTHORIZED"));
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      new AppError(
        "Header Authorization invalido. Usa o formato Bearer <token>.",
        401,
        "UNAUTHORIZED"
      )
    );
  }

  try {
    const payload = verifyAccessToken(token);
    req.auth = {
      userId: payload.userId,
      role: payload.role
    };

    return next();
  } catch {
    return next(new AppError("Token de acesso invalido ou expirado.", 401, "UNAUTHORIZED"));
  }
};

export function requireRoles(...roles: UserRole[]): RequestHandler {
  return (req, _res, next) => {
    if (!req.auth) {
      return next(new AppError("Autenticacao obrigatoria.", 401, "UNAUTHORIZED"));
    }

    if (!roles.includes(req.auth.role)) {
      return next(new AppError("Permissoes insuficientes.", 403, "FORBIDDEN"));
    }

    return next();
  };
}