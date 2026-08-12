import { UserService } from '../../../src/services/user.service';
import { AppError } from '../../../src/utils/AppError';
import type { UserRepository } from '../../../src/repositories/user.repository';

describe('UserService', () => {
  it('returns the profile for an existing user', () => {
    const userRepository = {
      findById: jest.fn().mockReturnValue({
        id: 'user-1',
        email: 'jane.doe@example.com',
        password_hash: 'hash',
        created_at: '2026-08-10T09:00:00.000Z',
        updated_at: '2026-08-10T09:00:00.000Z',
      }),
    } as unknown as UserRepository;

    const result = new UserService(userRepository).getCurrentUser('user-1');

    expect(result).toEqual({
      id: 'user-1',
      email: 'jane.doe@example.com',
      createdAt: '2026-08-10T09:00:00.000Z',
      updatedAt: '2026-08-10T09:00:00.000Z',
    });
  });

  it('throws 401 when the authenticated user no longer exists', () => {
    const userRepository = {
      findById: jest.fn().mockReturnValue(undefined),
    } as unknown as UserRepository;

    expect(() => new UserService(userRepository).getCurrentUser('missing-user')).toThrow(AppError);
  });
});
