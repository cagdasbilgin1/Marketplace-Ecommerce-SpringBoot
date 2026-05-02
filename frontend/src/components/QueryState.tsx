type QueryStateProps = {
  label: string;
};

export function LoadingState({ label }: QueryStateProps) {
  return (
    <div className="rounded-[2rem] border border-white/80 bg-white/90 p-10 shadow-[0_16px_50px_rgba(22,17,39,0.08)]">
      <div className="flex items-center gap-4">
        <span className="h-3 w-3 animate-pulse rounded-full bg-brand-500" />
        <p className="text-sm font-semibold text-slate-600">{label}</p>
      </div>
    </div>
  );
}

export function ErrorState({ label }: QueryStateProps) {
  return (
    <div className="rounded-[2rem] border border-rose-200 bg-rose-50 p-10">
      <p className="font-display text-2xl font-bold text-rose-700">Veri getirilemedi</p>
      <p className="mt-3 text-sm leading-6 text-rose-600">{label}</p>
    </div>
  );
}
