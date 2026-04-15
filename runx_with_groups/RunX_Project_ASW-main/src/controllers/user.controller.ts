import type { Request, Response } from "express";
import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/async-handler";
import { AppError } from "../utils/http-error";

function getAuthUserId(req: Request): number {
  if (!req.auth) {
    throw new AppError("Autenticacao obrigatoria.", 401, "UNAUTHORIZED");
  }

  return req.auth.userId;
}

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.getMe(getAuthUserId(req));
  res.status(200).json({ user });
});

export const updateMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateMe(getAuthUserId(req), req.body);
  res.status(200).json({ user });
});

export const updateAvatar = asyncHandler(async (req: Request, res: Response) => {
  const user = await userService.updateAvatar(getAuthUserId(req), req.body);
  res.status(200).json({ user });
});

export const deleteMe = asyncHandler(async (req: Request, res: Response) => {
  await userService.deleteMe(getAuthUserId(req));
  res.status(204).send();
});