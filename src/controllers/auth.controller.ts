import type { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/async-handler";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const tokens = await authService.refreshTokens(req.body);
  res.status(200).json({ tokens });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  await authService.logout(req.body);
  res.status(204).send();
});