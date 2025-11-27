import Link from "next/link";

interface PaginationProps {
  current: number;
  totalPages: number;
  basePath?: string;
}

const createPageNumbers = (current: number, total: number) => {
  const pages: number[] = [];
  const start = Math.max(1, current - 1);
  const end = Math.min(total, start + 2);

  for (let page = Math.max(1, end - 2); page <= end; page += 1) {
    pages.push(page);
  }

  return pages;
};

export const Pagination = ({ current, totalPages, basePath = "/can-ho-the-song" }: PaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = createPageNumbers(current, totalPages);

  const buildHref = (page: number) => {
    const params = new URLSearchParams({ current: page.toString() });
    return `${basePath}?${params.toString()}`;
  };

  return (
    <nav className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-600" aria-label="Pagination">
      <Link
        href={buildHref(Math.max(1, current - 1))}
        className="rounded-full border border-slate-200 px-3 py-2 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        aria-disabled={current === 1}
      >
        Trước
      </Link>
      {pageNumbers.map((page) => (
        <Link
          key={page}
          href={buildHref(page)}
          aria-current={page === current ? "page" : undefined}
          className={`rounded-full px-4 py-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#80b9ff] ${
            page === current
              ? "bg-[#0055A4] text-white shadow-lg"
              : "border border-slate-200 text-slate-700 hover:border-slate-400 hover:text-slate-900"
          }`}
        >
          {page}
        </Link>
      ))}
      <Link
        href={buildHref(Math.min(totalPages, current + 1))}
        className="rounded-full border border-slate-200 px-3 py-2 transition hover:border-slate-400 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
        aria-disabled={current === totalPages}
      >
        Sau
      </Link>
    </nav>
  );
};

