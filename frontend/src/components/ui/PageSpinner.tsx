import { Spinner } from '@/components/ui/Spinner';

export function PageSpinner() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-cream">
      <Spinner className="h-8 w-8" />
    </div>
  );
}
