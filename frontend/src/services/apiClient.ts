import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { AuthTokens } from '@/types/auth';
import { ApiError, type ApiErrorBody } from '@/types/api';
import { tokenStorage } from '@/utils/tokenStorage';
import { authEvents } from '@/utils/authEvents';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

export const apiClient = axios.create({ baseURL });

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

apiClient.interceptors.request.use((config) => {
  const accessToken = tokenStorage.getAccessToken();
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = tokenStorage.getRefreshToken();
  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const response = await axios.post<AuthTokens>(`${baseURL}/auth/refresh`, { refreshToken });
  tokenStorage.setTokens(response.data.accessToken, response.data.refreshToken, tokenStorage.isPersisted());
  return response.data.accessToken;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorBody>) => {
    const originalRequest = error.config as RetriableRequestConfig | undefined;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    if (error.response?.status === 401 && originalRequest && !originalRequest._retried && !isAuthEndpoint) {
      originalRequest._retried = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const accessToken = await refreshPromise;
        originalRequest.headers.set('Authorization', `Bearer ${accessToken}`);
        return apiClient.request(originalRequest);
      } catch {
        tokenStorage.clear();
        authEvents.emitForcedLogout();
        return Promise.reject(error);
      }
    }

    if (error.response?.data?.error) {
      return Promise.reject(new ApiError(error.response.status, error.response.data));
    }

    return Promise.reject(error);
  },
);
