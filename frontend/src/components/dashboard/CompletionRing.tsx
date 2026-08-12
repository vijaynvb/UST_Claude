export function CompletionRing({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full border-[8px] border-yellow"
        role="img"
        aria-label={`${percent}% of tasks completed`}
      />
      <span className="font-display text-2xl font-bold text-ink">{percent}%</span>
    </div>
  );
}
