import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '../../../src/utils/jwt';

describe('jwt utils', () => {
  it('round-trips an access token payload', () => {
    const token = signAccessToken({ sub: 'user-1', email: 'jane@example.com' });
    const payload = verifyAccessToken(token);
    expect(payload.sub).toBe('user-1');
    expect(payload.email).toBe('jane@example.com');
  });

  it('round-trips a refresh token with a unique jti', () => {
    const first = signRefreshToken('user-1');
    const second = signRefreshToken('user-1');
    expect(first.jti).not.toEqual(second.jti);

    const payload = verifyRefreshToken(first.token);
    expect(payload.sub).toBe('user-1');
    expect(payload.jti).toBe(first.jti);
  });

  it('throws when verifying a tampered access token', () => {
    const token = signAccessToken({ sub: 'user-1', email: 'jane@example.com' });
    expect(() => verifyAccessToken(`${token}tampered`)).toThrow();
  });
});
