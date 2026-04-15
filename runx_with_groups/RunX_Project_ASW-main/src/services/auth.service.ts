import { UserRole } from "@prisma/client";
import type {
  LoginBody,
  RefreshTokenBody,
  RegisterBody
} from "../schemas/auth.schema";
import { refreshTokenModel } from "../models/refresh-token.model";
import { type PublicUser, userModel } from "../models/user.model";
import { hashPassword, hashToken, verifyPassword } from "../utils/hash";
import { AppError } from "../utils/http-error";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken
} from "../utils/jwt";

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
}

export interface AuthResult {
  user: PublicUser;
  tokens: AuthTokens;
}

async function issueTokens(userId: number, role: UserRole): Promise<AuthTokens> {
  const accessToken = signAccessToken(userId, role);
  const { refreshToken, expiresAt } = signRefreshToken(userId);

  await refreshTokenModel.create({
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt
  });

  return {
    accessToken,
    refreshToken,
    refreshTokenExpiresAt: expiresAt.toISOString()
  };
}

export const authService = {
  async register(input: RegisterBody): Promise<AuthResult> {
    const existing = await userModel.findByEmailOrUsername(input.email, input.username);

    if (existing?.email === input.email) {
      throw new AppError("Ja existe um utilizador com este email.", 409, "EMAIL_TAKEN");
    }

    if (existing?.username === input.username) {
      throw new AppError(
        "Ja existe um utilizador com este username.",
        409,
        "USERNAME_TAKEN"
      );
    }

    const passwordHash = await hashPassword(input.password);

    const createdUser = await userModel.create({
      username: input.username,
      email: input.email,
      passwordHash,
      role: UserRole.RUNNER
    });

    const user = await userModel.findProfileById(createdUser.id);

    if (!user) {
      throw new AppError("Nao foi possivel carregar o perfil criado.", 500);
    }

    const tokens = await issueTokens(user.id, user.role);
    return { user, tokens };
  },

  async login(input: LoginBody): Promise<AuthResult> {
    const userWithPassword = await userModel.findByEmail(input.email);

    if (!userWithPassword) {
      throw new AppError("Credenciais invalidas.", 401, "INVALID_CREDENTIALS");
    }

    const passwordMatches = await verifyPassword(
      input.password,
      userWithPassword.passwordHash
    );

    if (!passwordMatches) {
      throw new AppError("Credenciais invalidas.", 401, "INVALID_CREDENTIALS");
    }

    const user = await userModel.findProfileById(userWithPassword.id);

    if (!user) {
      throw new AppError("Perfil de utilizador nao encontrado.", 404, "USER_NOT_FOUND");
    }

    const tokens = await issueTokens(user.id, user.role);
    return { user, tokens };
  },

  async refreshTokens(input: RefreshTokenBody): Promise<AuthTokens> {
    const payload = verifyRefreshToken(input.refreshToken);
    const tokenHash = hashToken(input.refreshToken);

    const storedToken = await refreshTokenModel.findActiveByTokenHash(tokenHash);

    if (!storedToken || storedToken.userId !== payload.userId) {
      throw new AppError("Refresh token invalido ou revogado.", 401, "INVALID_REFRESH_TOKEN");
    }

    await refreshTokenModel.revokeById(storedToken.id);

    const user = await userModel.findById(payload.userId);
    if (!user) {
      throw new AppError("Utilizador nao encontrado.", 404, "USER_NOT_FOUND");
    }

    return issueTokens(user.id, user.role);
  },

  async logout(input: RefreshTokenBody): Promise<void> {
    const tokenHash = hashToken(input.refreshToken);
    await refreshTokenModel.revokeByTokenHash(tokenHash);
  }
};