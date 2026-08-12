import { randomUUID } from 'crypto';
import type { AuthTokensDto, LoginRequestDto, RegisterRequestDto, UserDto } from '../dtos/auth.dto';
import { AppError } from '../utils/AppError';
import { toUserDto } from '../utils/mappers';
import { comparePassword, hashPassword } from '../utils/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { env } from '../config/env';
import type { RefreshTokenRepository } from '../repositories/refreshToken.repository';
import type { UserRepository } from '../repositories/user.repository';

const INVALID_CREDENTIALS_MESSAGE = 'Email or password is incorrect.';
const INVALID_REFRESH_TOKEN_MESSAGE = 'Refresh token is missing, invalid, expired, or has been revoked.';

export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async register(input: RegisterRequestDto): Promise<UserDto> {
    const existing = this.userRepository.findByEmail(input.email);
    if (existing) {
      throw AppError.conflict('An account with this email already exists.', 'EMAIL_ALREADY_REGISTERED');
    }

    const now = new Date().toISOString();
    const passwordHash = await hashPassword(input.password);

    const user = this.userRepository.create({
      id: randomUUID(),
      email: input.email,
      passwordHash,
      createdAt: now,
      updatedAt: now,
    });

    return toUserDto(user);
  }

  async login(input: LoginRequestDto): Promise<AuthTokensDto> {
    const user = this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new AppError(401, 'INVALID_CREDENTIALS', INVALID_CREDENTIALS_MESSAGE);
    }

    const passwordMatches = await comparePassword(input.password, user.password_hash);
    if (!passwordMatches) {
      throw new AppError(401, 'INVALID_CREDENTIALS', INVALID_CREDENTIALS_MESSAGE);
    }

    return this.issueTokenPair(user.id, user.email);
  }

  logout(refreshToken: string): void {
    try {
      const payload = verifyRefreshToken(refreshToken);
      const stored = this.refreshTokenRepository.findById(payload.jti);
      if (stored && !stored.revoked_at) {
        this.refreshTokenRepository.revoke(payload.jti, new Date().toISOString());
      }
    } catch {
      // An already-invalid or unknown refresh token has nothing left to revoke.
    }
  }

  async refresh(refreshToken: string): Promise<AuthTokensDto> {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError(401, 'UNAUTHORIZED', INVALID_REFRESH_TOKEN_MESSAGE);
    }

    const stored = this.refreshTokenRepository.findById(payload.jti);
    if (!stored || stored.revoked_at || new Date(stored.expires_at) < new Date()) {
      throw new AppError(401, 'UNAUTHORIZED', INVALID_REFRESH_TOKEN_MESSAGE);
    }

    const user = this.userRepository.findById(payload.sub);
    if (!user) {
      throw new AppError(401, 'UNAUTHORIZED', INVALID_REFRESH_TOKEN_MESSAGE);
    }

    this.refreshTokenRepository.revoke(payload.jti, new Date().toISOString());
    return this.issueTokenPair(user.id, user.email);
  }

  private issueTokenPair(userId: string, email: string): AuthTokensDto {
    const accessToken = signAccessToken({ sub: userId, email });
    const { token: refreshToken, jti } = signRefreshToken(userId);

    const now = new Date();
    this.refreshTokenRepository.create({
      id: jti,
      userId,
      expiresAt: new Date(now.getTime() + env.jwt.refreshExpiresInSeconds * 1000).toISOString(),
      createdAt: now.toISOString(),
    });

    return {
      accessToken,
      refreshToken,
      tokenType: 'Bearer',
      expiresIn: env.jwt.accessExpiresInSeconds,
    };
  }
}
