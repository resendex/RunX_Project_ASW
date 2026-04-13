import type { RequestHandler } from "express";
import { type ZodTypeAny } from "zod";

interface ValidationSchemas {
  body?: ZodTypeAny;
  params?: ZodTypeAny;
  query?: ZodTypeAny;
}

export function validate(schemas: ValidationSchemas): RequestHandler {
  return (req, _res, next) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.params) {
        (req as { params: unknown }).params = schemas.params.parse(req.params);
      }

      if (schemas.query) {
        (req as { query: unknown }).query = schemas.query.parse(req.query);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}