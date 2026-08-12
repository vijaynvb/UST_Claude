import type { ReactNode } from 'react';
import { Card } from '@/components/ui/Card';

export function StatCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Card className="flex flex-col gap-2">
      <p className="text-[11px] text-muted">{label}</p>
      {children}
    </Card>
  );
}
