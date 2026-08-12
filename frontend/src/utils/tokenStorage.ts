const ACCESS_TOKEN_KEY = 'taskly.accessToken';
const REFRESH_TOKEN_KEY = 'taskly.refreshToken';

/**
 * Tokens live in localStorage when the user checks "remember me" (persist across
 * browser restarts) or sessionStorage otherwise (cleared when the tab closes).
 * Refresh always checks both so an existing session keeps working either way.
 */
export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(ACCESS_TOKEN_KEY) ?? sessionStorage.getItem(ACCESS_TOKEN_KEY);
  },
  getRefreshToken(): string | null {
    return localStorage.getItem(REFRESH_TOKEN_KEY) ?? sessionStorage.getItem(REFRESH_TOKEN_KEY);
  },
  isPersisted(): boolean {
    return localStorage.getItem(REFRESH_TOKEN_KEY) !== null;
  },
  setTokens(accessToken: string, refreshToken: string, remember = true): void {
    const store = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    store.setItem(ACCESS_TOKEN_KEY, accessToken);
    store.setItem(REFRESH_TOKEN_KEY, refreshToken);
    other.removeItem(ACCESS_TOKEN_KEY);
    other.removeItem(REFRESH_TOKEN_KEY);
  },
  clear(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
