export const ApartmentCardSkeleton = () => {
  return (
    <article
      className="flex h-full flex-col gap-4 rounded-[32px] border border-slate-100 bg-white p-4 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
      aria-label="Đang tải thông tin căn hộ"
    >
      <div className="relative h-48 w-full overflow-hidden rounded-3xl bg-slate-200 animate-pulse" />
      <div className="flex flex-1 flex-col gap-3">
        <div className="h-4 w-2/3 rounded-full bg-slate-200 animate-pulse" />
        <div className="h-4 w-1/2 rounded-full bg-slate-200 animate-pulse" />
        <div className="h-3 w-full rounded-full bg-slate-200 animate-pulse" />
        <div className="h-3 w-5/6 rounded-full bg-slate-200 animate-pulse" />
        <div className="mt-auto flex items-center justify-between">
          <div className="h-5 w-24 rounded-full bg-slate-200 animate-pulse" />
          <div className="h-10 w-24 rounded-full bg-slate-200 animate-pulse" />
        </div>
      </div>
    </article>
  );
};


