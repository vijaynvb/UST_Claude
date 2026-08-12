const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export type PasswordStrength = 'weak' | 'medium' | 'strong';

/** Mirrors the backend's 8-128 char minimum (see RegisterRequest.password in openapi.yaml). */
export const MIN_PASSWORD_LENGTH = 8;

export function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= MIN_PASSWORD_LENGTH) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score >= 4) return 'strong';
  if (score >= 2) return 'medium';
  return 'weak';
}
