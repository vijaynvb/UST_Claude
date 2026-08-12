import type { AppDatabase } from '../db/database';
import type { RefreshTokenRow } from '../models/refreshToken.model';

export interface CreateRefreshTokenInput {
  id: string;
  userId: string;
  expiresAt: string;
  createdAt: string;
}

export class RefreshTokenRepository {
  constructor(private readonly db: AppDatabase) {}

  findById(id: string): RefreshTokenRow | undefined {
    return this.db
      .prepare('SELECT * FROM refresh_tokens WHERE id = ?')
      .get(id) as RefreshTokenRow | undefined;
  }

  create(input: CreateRefreshTokenInput): void {
    this.db
      .prepare(
        `INSERT INTO refresh_tokens (id, user_id, expires_at, revoked_at, created_at)
         VALUES (@id, @userId, @expiresAt, NULL, @createdAt)`,
      )
      .run(input);
  }

  revoke(id: string, revokedAt: string): void {
    this.db.prepare('UPDATE refresh_tokens SET revoked_at = ? WHERE id = ?').run(revokedAt, id);
  }
}
