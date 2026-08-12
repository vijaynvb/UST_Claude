import { AuthService } from '../../../src/services/auth.service';
import { AppError } from '../../../src/utils/AppError';
import { hashPassword } from '../../../src/utils/password';
import { signRefreshToken } from '../../../src/utils/jwt';
import type { UserRepository } from '../../../src/repositories/user.repository';
import type { RefreshTokenRepository } from '../../../src/repositories/refreshToken.repository';
import type { UserRow } from '../../../src/models/user.model';

function buildUserRow(overrides: Partial<UserRow> = {}): UserRow {
  return {
    id: 'user-1',
    email: 'jane.doe@example.com',
    password_hash: 'hash',
    created_at: '2026-08-10T09:00:00.000Z',
    updated_at: '2026-08-10T09:00:00.000Z',
    ...overrides,
  };
}

describe('AuthService', () => {
  let userRepository: jest.Mocked<UserRepository>;
  let refreshTokenRepository: jest.Mocked<RefreshTokenRepository>;
  let authService: AuthService;

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    refreshTokenRepository = {
      findById: jest.fn(),
      create: jest.fn(),
      revoke: jest.fn(),
    } as unknown as jest.Mocked<RefreshTokenRepository>;

    authService = new AuthService(userRepository, refreshTokenRepository);
  });

  describe('register', () => {
    it('creates a user when the email is not already registered', async () => {
      userRepository.findByEmail.mockReturnValue(undefined);
      userRepository.create.mockImplementation((input) =>
        buildUserRow({ id: input.id, email: input.email, password_hash: input.passwordHash }),
      );

      const result = await authService.register({
        email: 'jane.doe@example.com',
        password: 'Str0ng!Passw0rd',
      });

      expect(result.email).toBe('jane.doe@example.com');
      expect(userRepository.create).toHaveBeenCalledTimes(1);
    });

    it('rejects registration when the email already exists', async () => {
      userRepository.findByEmail.mockReturnValue(buildUserRow());

      await expect(
        authService.register({ email: 'jane.doe@example.com', password: 'Str0ng!Passw0rd' }),
      ).rejects.toMatchObject<Partial<AppError>>({ statusCode: 409, code: 'EMAIL_ALREADY_REGISTERED' });
    });
  });

  describe('login', () => {
    it('issues a token pair for valid credentials', async () => {
      const passwordHash = await hashPassword('Str0ng!Passw0rd');
      userRepository.findByEmail.mockReturnValue(buildUserRow({ password_hash: passwordHash }));

      const tokens = await authService.login({
        email: 'jane.doe@example.com',
        password: 'Str0ng!Passw0rd',
      });

      expect(tokens.tokenType).toBe('Bearer');
      expect(tokens.accessToken).toBeTruthy();
      expect(tokens.refreshToken).toBeTruthy();
      expect(refreshTokenRepository.create).toHaveBeenCalledTimes(1);
    });

    it('rejects an unknown email with a generic invalid-credentials error', async () => {
      userRepository.findByEmail.mockReturnValue(undefined);

      await expect(
        authService.login({ email: 'unknown@example.com', password: 'Str0ng!Passw0rd' }),
      ).rejects.toMatchObject<Partial<AppError>>({ statusCode: 401, code: 'INVALID_CREDENTIALS' });
    });

    it('rejects a wrong password with the same generic invalid-credentials error', async () => {
      const passwordHash = await hashPassword('Str0ng!Passw0rd');
      userRepository.findByEmail.mockReturnValue(buildUserRow({ password_hash: passwordHash }));

      await expect(
        authService.login({ email: 'jane.doe@example.com', password: 'WrongPassword1' }),
      ).rejects.toMatchObject<Partial<AppError>>({ statusCode: 401, code: 'INVALID_CREDENTIALS' });
    });
  });

  describe('refresh', () => {
    it('rotates the refresh token and issues a new access token', async () => {
      const { token, jti } = signRefreshToken('user-1');
      refreshTokenRepository.findById.mockReturnValue({
        id: jti,
        user_id: 'user-1',
        expires_at: new Date(Date.now() + 60_000).toISOString(),
        revoked_at: null,
        created_at: new Date().toISOString(),
      });
      userRepository.findById.mockReturnValue(buildUserRow());

      const tokens = await authService.refresh(token);

      expect(refreshTokenRepository.revoke).toHaveBeenCalledWith(jti, expect.any(String));
      expect(tokens.accessToken).toBeTruthy();
    });

    it('rejects a revoked refresh token', async () => {
      const { token, jti } = signRefreshToken('user-1');
      refreshTokenRepository.findById.mockReturnValue({
        id: jti,
        user_id: 'user-1',
        expires_at: new Date(Date.now() + 60_000).toISOString(),
        revoked_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
      });

      await expect(authService.refresh(token)).rejects.toMatchObject<Partial<AppError>>({
        statusCode: 401,
      });
    });

    it('rejects a malformed refresh token', async () => {
      await expect(authService.refresh('not-a-real-token')).rejects.toMatchObject<Partial<AppError>>({
        statusCode: 401,
      });
    });
  });

  describe('logout', () => {
    it('revokes a known, unrevoked refresh token', () => {
      const { token, jti } = signRefreshToken('user-1');
      refreshTokenRepository.findById.mockReturnValue({
        id: jti,
        user_id: 'user-1',
        expires_at: new Date(Date.now() + 60_000).toISOString(),
        revoked_at: null,
        created_at: new Date().toISOString(),
      });

      authService.logout(token);

      expect(refreshTokenRepository.revoke).toHaveBeenCalledWith(jti, expect.any(String));
    });

    it('is a no-op for an already-invalid refresh token', () => {
      expect(() => authService.logout('garbage-token')).not.toThrow();
      expect(refreshTokenRepository.revoke).not.toHaveBeenCalled();
    });
  });
});
