import { config as loadDotenv } from 'dotenv';

loadDotenv();

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim().length === 0) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalNumber(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: optionalNumber('PORT', 3000),
  corsOrigin: process.env.CORS_ORIGIN ?? '*',

  jwt: {
    accessSecret: requireEnv('JWT_ACCESS_SECRET'),
    refreshSecret: requireEnv('JWT_REFRESH_SECRET'),
    accessExpiresInSeconds: optionalNumber('JWT_ACCESS_EXPIRES_IN_SECONDS', 900),
    refreshExpiresInSeconds: optionalNumber('JWT_REFRESH_EXPIRES_IN_SECONDS', 604800),
  },

  authRateLimit: {
    windowMs: optionalNumber('AUTH_RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    maxAttempts: optionalNumber('AUTH_RATE_LIMIT_MAX_ATTEMPTS', 10),
  },
} as const;

export const isProduction = env.nodeEnv === 'production';
