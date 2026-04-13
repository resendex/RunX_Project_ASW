import { UserRole } from "@prisma/client";
import { randomUUID } from "crypto";
import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

interface AccessClaims extends JwtPayload {
  sub: string;
  role: UserRole;
  type: "access";
}

interface RefreshClaims extends JwtPayload {
  sub: string;
  type: "refresh";
}

interface RefreshTokenResult {
  refreshToken: string;
  expiresAt: Date;
}

function durationToMs(duration: string): number {
  const numericDuration = Number(duration);
  if (Number.isFinite(numericDuration) && numericDuration > 0) {
    return numericDuration * 1000;
  }

  const parsed = /^(\d+)([smhd])$/i.exec(duration.trim());
  if (!parsed) {
    throw new Error(`Formato de expiracao invalido: ${duration}`);
  }

  const value = Number(parsed[1]);
  const unit = parsed[2].toLowerCase();

  const unitInMs: Record<string, number> = {
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000
  };

  return value * unitInMs[unit];
}

function safeParseUserId(rawUserId: string): number {
  const parsed = Number(rawUserId);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error("Token contem userId invalido.");
  }
  return parsed;
}

export function signAccessToken(userId: number, role: UserRole): string {
  const options: SignOptions = {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions["expiresIn"],
    subject: String(userId)
  };

  return jwt.sign({ role, type: "access" }, env.JWT_ACCESS_SECRET, options);
}

export function verifyAccessToken(token: string): {
  userId: number;
  role: UserRole;
} {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessClaims;

  if (decoded.type !== "access" || !decoded.sub || !decoded.role) {
    throw new Error("Access token invalido.");
  }

  if (!Object.values(UserRole).includes(decoded.role)) {
    throw new Error("Role invalida no token.");
  }

  return {
    userId: safeParseUserId(decoded.sub),
    role: decoded.role
  };
}

export function signRefreshToken(userId: number): RefreshTokenResult {
  const options: SignOptions = {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions["expiresIn"],
    subject: String(userId),
    jwtid: randomUUID()
  };

  const refreshToken = jwt.sign(
    { type: "refresh" },
    env.JWT_REFRESH_SECRET,
    options
  );

  const expiresAt = new Date(Date.now() + durationToMs(env.JWT_REFRESH_EXPIRES_IN));

  return { refreshToken, expiresAt };
}

export function verifyRefreshToken(token: string): { userId: number } {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshClaims;

  if (decoded.type !== "refresh" || !decoded.sub) {
    throw new Error("Refresh token invalido.");
  }

  return {
    userId: safeParseUserId(decoded.sub)
  };
}