import { cn } from '@/utils/cn';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className="rounded-full border border-ink px-2.5 py-1 text-xs text-muted disabled:opacity-40"
      >
        &lsaquo;
      </button>
      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onPageChange(pageNumber)}
          aria-current={pageNumber === page ? 'page' : undefined}
          className={cn(
            'rounded-full border px-2.5 py-1 text-xs',
            pageNumber === page ? 'border-ink bg-yellow text-ink' : 'border-ink text-muted',
          )}
        >
          {pageNumber}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
        className="rounded-full border border-ink px-2.5 py-1 text-xs text-muted disabled:opacity-40"
      >
        &rsaquo;
      </button>
    </nav>
  );
}
