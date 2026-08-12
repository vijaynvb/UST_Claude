import type { AppDatabase } from '../db/database';
import type { UserRow } from '../models/user.model';

export interface CreateUserInput {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export class UserRepository {
  constructor(private readonly db: AppDatabase) {}

  findByEmail(email: string): UserRow | undefined {
    return this.db
      .prepare('SELECT * FROM users WHERE email = ?')
      .get(email) as UserRow | undefined;
  }

  findById(id: string): UserRow | undefined {
    return this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
  }

  create(input: CreateUserInput): UserRow {
    this.db
      .prepare(
        `INSERT INTO users (id, email, password_hash, created_at, updated_at)
         VALUES (@id, @email, @passwordHash, @createdAt, @updatedAt)`,
      )
      .run({
        id: input.id,
        email: input.email,
        passwordHash: input.passwordHash,
        createdAt: input.createdAt,
        updatedAt: input.updatedAt,
      });

    return this.findById(input.id) as UserRow;
  }
}
