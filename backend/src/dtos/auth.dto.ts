export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface UserDto {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface RefreshRequestDto {
  refreshToken: string;
}

export interface AuthTokensDto {
  accessToken: string;
  refreshToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
}
