import { useQueries } from "@tanstack/react-query";

import { useAuth } from "../shared/auth/AuthContext";
import { getServiceStatus, serviceChecks } from "../shared/api/devtools";

function formatDate(value?: number) {
  if (!value) {
    return "Bilinmiyor";
  }

  return new Intl.DateTimeFormat("tr-TR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(value);
}

function maskToken(token?: string) {
  if (!token) {
    return "Yok";
  }

  if (token.length < 36) {
    return token;
  }

  return `${token.slice(0, 24)}...${token.slice(-24)}`;
}

export function DevSessionPage() {
  const auth = useAuth();
  const checks = useQueries({
    queries: serviceChecks.map((service) => ({
      queryKey: ["dev-service-status", service.name],
      queryFn: () => getServiceStatus(service),
      refetchInterval: 15_000,
      staleTime: 5_000,
    })),
  });

  if (!import.meta.env.DEV) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-900">
          Bu sayfa sadece development modunda kullanilabilir.
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-semibold text-amber-900">
        Development Panel: Bu ekran sadece lokal gelistirme ve hata ayiklama icin aciktir.
      </div>

      <section className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_32px_rgba(15,23,42,0.06)]">
        <div className="border-b border-slate-100 px-5 py-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Session ve Servis Durumu</h1>
          <p className="mt-1 text-sm text-slate-500">
            Aktif kullanici, token omurleri, login akisi ve mikroservis sagligi tek ekranda gorunur.
          </p>
        </div>

        <div className="grid gap-5 px-5 py-5 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="grid gap-4">
            <div className="rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Session</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">
                {!auth.initialized ? "Hazirlaniyor" : auth.authenticated ? "Authenticated" : "Guest"}
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Kullanici: <span className="font-semibold text-slate-900">{auth.user?.fullName ?? "-"}</span></p>
                <p>Kullanici adi: <span className="font-semibold text-slate-900">{auth.user?.username ?? "-"}</span></p>
                <p>Email: <span className="font-semibold text-slate-900">{auth.user?.email ?? "-"}</span></p>
                <p>Roller: <span className="font-semibold text-slate-900">{auth.user?.roles.join(", ") || "-"}</span></p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Token Omurleri</p>
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>Access token bitis: <span className="font-semibold text-slate-900">{formatDate(auth.tokens?.accessTokenExpiresAt)}</span></p>
                <p>Refresh token bitis: <span className="font-semibold text-slate-900">{formatDate(auth.tokens?.refreshTokenExpiresAt)}</span></p>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {!auth.authenticated ? (
                  <>
                    <a
                      href={auth.loginUrl ?? "#"}
                      className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
                    >
                      Giris Akisini Baslat
                    </a>
                    <a
                      href={auth.signupUrl ?? "#"}
                      className="rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
                    >
                      Kayit Akisini Baslat
                    </a>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => void auth.refreshSession()}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
                    >
                      Token Yenile
                    </button>
                    <button
                      type="button"
                      onClick={() => void auth.logout()}
                      className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700"
                    >
                      Oturumu Kapat
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Ham Tokenlar</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Access Token</p>
                  <p className="mt-2 break-all rounded-xl bg-slate-50 px-3 py-3 font-mono text-xs text-slate-600">
                    {maskToken(auth.tokens?.accessToken)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Refresh Token</p>
                  <p className="mt-2 break-all rounded-xl bg-slate-50 px-3 py-3 font-mono text-xs text-slate-600">
                    {maskToken(auth.tokens?.refreshToken)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Servisler</p>
                <h2 className="mt-2 text-xl font-bold text-slate-900">Canli Saglik Kontrolu</h2>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                15 sn otomatik yenilenir
              </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
              <div className="grid grid-cols-[1.5fr_0.7fr_0.6fr] gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                <span>Servis</span>
                <span>Durum</span>
                <span>Sure</span>
              </div>

              <div className="divide-y divide-slate-100">
                {checks.map((query, index) => {
                  const result = query.data;
                  const service = serviceChecks[index];

                  return (
                    <div key={service.name} className="grid grid-cols-[1.5fr_0.7fr_0.6fr] gap-3 px-4 py-4 text-sm">
                      <div>
                        <p className="font-semibold text-slate-900">{service.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {query.isLoading ? "Kontrol ediliyor..." : result?.summary ?? "Durum alinmadi"}
                        </p>
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            query.isLoading
                              ? "bg-slate-100 text-slate-500"
                              : result?.ok
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-rose-50 text-rose-700"
                          }`}
                        >
                          {query.isLoading ? "BEKLIYOR" : result?.ok ? "UP" : "DOWN"}
                        </span>
                      </div>
                      <div className="flex items-center text-slate-500">
                        {query.isLoading ? "-" : `${result?.responseTimeMs ?? 0} ms`}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
