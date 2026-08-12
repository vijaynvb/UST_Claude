import { useMemo, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Input } from '@/components/ui/Input';
import { Checkbox } from '@/components/ui/Checkbox';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import { ApiError } from '@/types/api';
import { getPasswordStrength, isValidEmail, MIN_PASSWORD_LENGTH } from '@/utils/validators';
import { cn } from '@/utils/cn';

const STRENGTH_METER: Record<ReturnType<typeof getPasswordStrength>, { label: string; filled: number; color: string }> = {
  weak: { label: 'weak', filled: 1, color: 'bg-danger' },
  medium: { label: 'medium', filled: 2, color: 'bg-ink' },
  strong: { label: 'strong', filled: 3, color: 'bg-ink' },
};

interface FieldErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const strength = useMemo(() => getPasswordStrength(password), [password]);

  function validate(): boolean {
    const errors: FieldErrors = {};
    if (!isValidEmail(email)) errors.email = 'Enter a valid email address.';
    if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }
    if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match.';
    if (!agreeToTerms) errors.agreeToTerms = 'You must agree to the Terms & Privacy Policy.';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({ email, password });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setFormError(
        error instanceof ApiError ? error.message : 'Unable to create your account right now. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="flex flex-col gap-1 pt-2">
        <h1 className="font-display text-[30px] font-bold leading-tight text-ink">Create account</h1>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-4 flex flex-col gap-3.5">
        {formError && <Alert>{formError}</Alert>}

        <Input
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          error={fieldErrors.email}
          required
        />

        <div className="flex flex-col gap-1.5">
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            placeholder="********"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            error={fieldErrors.password}
            required
          />
          {password.length > 0 && (
            <div className="flex items-center gap-1.5" aria-live="polite">
              {[0, 1, 2].map((segment) => (
                <span
                  key={segment}
                  className={cn(
                    'h-[5px] flex-1 rounded-full',
                    segment < STRENGTH_METER[strength].filled ? STRENGTH_METER[strength].color : 'bg-divider',
                  )}
                />
              ))}
              <span className="text-[10px] text-muted">{STRENGTH_METER[strength].label}</span>
            </div>
          )}
        </div>

        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          placeholder="********"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          error={fieldErrors.confirmPassword}
          required
        />

        <div className="flex flex-col gap-1">
          <Checkbox
            label="I agree to the Terms & Privacy Policy"
            checked={agreeToTerms}
            onChange={(event) => setAgreeToTerms(event.target.checked)}
          />
          {fieldErrors.agreeToTerms && <p className="text-xs text-danger">{fieldErrors.agreeToTerms}</p>}
        </div>

        <Button type="submit" isLoading={isSubmitting} className="w-full">
          Create account
        </Button>

        <p className="text-center text-sm text-muted-strong">
          Already have an account?{' '}
          <Link to="/login" className="font-bold underline">
            Log in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
