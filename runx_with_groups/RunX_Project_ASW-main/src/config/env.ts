import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, "DATABASE_URL e obrigatorio."),
  JWT_ACCESS_SECRET: z
    .string()
    .min(12, "JWT_ACCESS_SECRET deve ter pelo menos 12 caracteres."),
  JWT_REFRESH_SECRET: z
    .string()
    .min(12, "JWT_REFRESH_SECRET deve ter pelo menos 12 caracteres."),
  JWT_ACCESS_EXPIRES_IN: z.string().min(2).default("1h"),
  JWT_REFRESH_EXPIRES_IN: z.string().min(2).default("7d"),
  OPENWEATHER_API_KEY: z.string().optional()
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const flattened = parsedEnv.error.flatten().fieldErrors;
  throw new Error(`Variaveis de ambiente invalidas: ${JSON.stringify(flattened)}`);
}

export const env = parsedEnv.data;