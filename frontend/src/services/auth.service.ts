import { apiClient } from '@/services/apiClient';
import type { AuthTokens, LoginRequest, RegisterRequest, User } from '@/types/auth';
import { tokenStorage } from '@/utils/tokenStorage';

export const authService = {
  async register(payload: RegisterRequest): Promise<User> {
    const response = await apiClient.post<User>('/auth/register', payload);
    return response.data;
  },

  async login(payload: LoginRequest, rememberMe = true): Promise<AuthTokens> {
    const response = await apiClient.post<AuthTokens>('/auth/login', payload);
    tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken, rememberMe);
    return response.data;
  },

  async logout(): Promise<void> {
    const refreshToken = tokenStorage.getRefreshToken();
    tokenStorage.clear();
    if (refreshToken) {
      await apiClient.post('/auth/logout', { refreshToken }).catch(() => {
        // Token is already cleared locally; a failed revoke call is not actionable by the user.
      });
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get<User>('/users/me');
    return response.data;
  },
};
