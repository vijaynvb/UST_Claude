import type { UserDto } from '../dtos/auth.dto';
import { AppError } from '../utils/AppError';
import { toUserDto } from '../utils/mappers';
import type { UserRepository } from '../repositories/user.repository';

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  getCurrentUser(userId: string): UserDto {
    const user = this.userRepository.findById(userId);
    if (!user) {
      throw AppError.unauthorized();
    }
    return toUserDto(user);
  }
}
