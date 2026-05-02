import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../shared/auth/AuthContext";

function buildDisplayName(user?: {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
} | null) {
  const fullName = user?.fullName?.trim();
  if (fullName) {
    return fullName;
  }

  const combinedName = [user?.firstName?.trim(), user?.lastName?.trim()].filter(Boolean).join(" ");
  if (combinedName) {
    return combinedName;
  }

  if (user?.username?.trim()) {
    return user.username.trim();
  }

  if (user?.email?.trim()) {
    return user.email.trim();
  }

  return "Hesabim";
}

function getInitials(sourceText?: string) {
  const source = sourceText?.trim() || "?";
  const parts = source.split(/\s+/).filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}

const utilityLinks = ["Kampanyalar", "Yardim & Destek", "Siparis Takip"];

function LocationIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-9 w-9 text-brand-600">
      <path
        d="M24 43s14-11.2 14-24A14 14 0 1 0 10 19c0 12.8 14 24 14 24Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="19" r="5.5" fill="none" stroke="currentColor" strokeWidth="3.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-9 w-9 text-brand-600">
      <path
        d="M8 10h5l4 18h18l4-13H16"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="36" r="2.8" fill="currentColor" />
      <circle cx="34" cy="36" r="2.8" fill="currentColor" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-9 w-9 text-brand-600">
      <path
        d="M24 40 9.5 25.7a9 9 0 0 1 12.7-12.7L24 14.8l1.8-1.8a9 9 0 1 1 12.7 12.7Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AppShell() {
  const { authenticated, loginUrl, signupUrl, user } = useAuth();
  const accountDisplayName = buildDisplayName(user);
  const utilityNav = import.meta.env.DEV ? [...utilityLinks, "Dev Panel"] : utilityLinks;

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-ink">
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[28rem] bg-hero-grid opacity-80 blur-3xl" />
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 shadow-[0_6px_24px_rgba(15,23,42,0.05)] backdrop-blur-md">
        <div className="border-b border-slate-100 bg-[#fbfbfd]">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-sm text-slate-500 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <span className="text-brand-600">◎</span>
              <span>Bugune ozel kargo bedava.</span>
              <span className="hidden md:inline">500 TL ve uzeri alisverislerde gecerli.</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {utilityNav.map((label) => (
                <a
                  key={label}
                  href={label === "Dev Panel" ? "/dev/session" : "/"}
                  className="transition hover:text-brand-700"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-[4.35rem] w-[4.35rem] object-contain" />
            </Link>

            <div className="flex min-w-0 flex-[1.35] items-center rounded-full bg-[#fbf1fb] px-5 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
              <span className="shrink-0 text-[2rem] leading-none text-slate-900">⌕</span>
              <input
                aria-label="Urun arama"
                placeholder="Urun, kategori, marka ara"
                className="min-w-0 flex-1 border-0 bg-transparent px-4 text-[1.05rem] font-semibold text-slate-900 outline-none placeholder:font-semibold placeholder:text-slate-700"
              />
            </div>

            <div className="flex items-center justify-end gap-4 lg:-ml-2 lg:min-w-[26rem] lg:pl-0">
              <div className="flex items-center gap-3">
                <LocationIcon />
                <div className="leading-none">
                  <p className="text-[0.64rem] font-black uppercase tracking-[0.08em] text-slate-400">
                    Teslimat Adresi
                  </p>
                  <a
                    href="/"
                    className="mt-1 block text-[0.88rem] font-extrabold text-slate-600 underline decoration-[2px] underline-offset-[5px]"
                  >
                    Istanbul/Kadikoy
                  </a>
                </div>
              </div>

              <span className="h-14 w-px bg-slate-200" />

              <Link to="/" className="relative flex h-14 w-14 items-center justify-center" aria-label="Sepet">
                <CartIcon />
                <span className="absolute right-0 top-0 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-lime-300 px-1 text-[10px] font-black text-slate-900">
                  4
                </span>
              </Link>

              <Link to="/" className="flex h-14 w-14 items-center justify-center" aria-label="Favoriler">
                <HeartIcon />
              </Link>

              {authenticated ? (
                <div className="flex items-center">
                  <Link
                    to="/account"
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 text-[1.05rem] font-extrabold text-white"
                    aria-label={accountDisplayName}
                  >
                    {getInitials(accountDisplayName)}
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-[1.05rem] font-extrabold text-white">
                    @
                  </div>
                  <div className="text-[0.76rem] font-bold leading-4 text-slate-800">
                    <a href={signupUrl ?? "#"} className="block transition hover:text-brand-700">
                      Uye Ol
                    </a>
                    <a href={loginUrl ?? "#"} className="block transition hover:text-brand-700">
                      Giris Yap
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="pb-12">
        <Outlet />
      </main>
    </div>
  );
}
