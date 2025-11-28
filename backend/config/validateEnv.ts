import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().regex(/^\d+$/).transform(Number).default("5001"),
  MONGODB_URI: z.string().url("MongoDB URI must be a valid URL"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  CORS_ORIGIN: z.string().url().optional(),
  RATE_LIMIT_WINDOW_MS: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default("900000"),
  RATE_LIMIT_MAX_REQUESTS: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .default("100"),
});

export type EnvConfig = z.infer<typeof envSchema>;

let envConfig: EnvConfig;

export const validateEnv = (): EnvConfig => {
  try {
    envConfig = envSchema.parse(process.env);
    return envConfig;
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      const zodError = error as z.ZodError;
      const missingVars = zodError.errors
        .map((e: z.ZodIssue) => `${e.path.join(".")}: ${e.message}`)
        .join("\n");
      throw new Error(`Environment validation failed:\n${missingVars}`);
    }
    throw error;
  }
};

export const getEnv = (): EnvConfig => {
  if (!envConfig) {
    throw new Error("Environment not validated. Call validateEnv() first.");
  }
  return envConfig;
};
