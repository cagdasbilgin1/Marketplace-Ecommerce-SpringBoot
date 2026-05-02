import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.35em] text-brand-700">404</p>
      <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-ink">Sayfa bulunamadi</h1>
      <p className="mt-4 text-base leading-7 text-slate-600">
        Vitrinden cikmis gibiyiz. Ana sayfaya donup katalog akisina devam edebilirsin.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-full bg-brand-500 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-400"
      >
        Ana sayfaya git
      </Link>
    </div>
  );
}
