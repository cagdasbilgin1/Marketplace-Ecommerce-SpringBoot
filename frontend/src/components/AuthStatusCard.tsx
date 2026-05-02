import { useAuth } from "../shared/auth/AuthContext";

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

  if (token.length < 24) {
    return token;
  }

  return `${token.slice(0, 18)}...${token.slice(-18)}`;
}

export function AuthStatusCard() {
  const { authenticated, initialized, loginUrl, signupUrl, tokens, user, logout, refreshSession } = useAuth();

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_10px_32px_rgba(15,23,42,0.06)]">
      <div className="border-b border-slate-100 px-5 py-4">
        <h2 className="text-[1.35rem] font-bold tracking-tight text-slate-900">Authentication Durumu</h2>
        <p className="mt-1 text-sm text-slate-500">
          Login, signup, access token ve refresh token akisi Keycloak ile burada yonetiliyor.
        </p>
      </div>

      <div className="grid gap-6 px-5 py-5 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-2xl bg-slate-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Oturum</p>
          <p className="mt-2 text-2xl font-bold text-slate-900">
            {!initialized ? "Kontrol ediliyor" : authenticated ? "Giris yapildi" : "Misafir"}
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {authenticated
              ? "Access token ve refresh token bellekte tutuluyor; refresh sureci otomatik calisiyor."
              : "Keycloak uzerinden giris veya uye ol akisini baslatabilirsin."}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {!authenticated ? (
              <>
                <a
                  href={loginUrl ?? "#"}
                  className="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-brand-600"
                >
                  Giris Yap
                </a>
                <a
                  href={signupUrl ?? "#"}
                  className="rounded-xl border border-brand-200 bg-white px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
                >
                  Uye Ol
                </a>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => void refreshSession()}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-brand-200 hover:text-brand-700"
                >
                  Token Yenile
                </button>
                <button
                  type="button"
                  onClick={() => void logout()}
                  className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-700"
                >
                  Cikis Yap
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Kullanici</p>
            <p className="mt-3 text-sm text-slate-600">Ad Soyad: <span className="font-semibold text-slate-900">{user?.fullName ?? "-"}</span></p>
            <p className="mt-2 text-sm text-slate-600">Kullanici adi: <span className="font-semibold text-slate-900">{user?.username ?? "-"}</span></p>
            <p className="mt-2 text-sm text-slate-600">Email: <span className="font-semibold text-slate-900">{user?.email ?? "-"}</span></p>
            <p className="mt-2 text-sm text-slate-600">Roller: <span className="font-semibold text-slate-900">{user?.roles.join(", ") || "-"}</span></p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Token Omru</p>
            <p className="mt-3 text-sm text-slate-600">
              Access token bitis: <span className="font-semibold text-slate-900">{formatDate(tokens?.accessTokenExpiresAt)}</span>
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Refresh token bitis: <span className="font-semibold text-slate-900">{formatDate(tokens?.refreshTokenExpiresAt)}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 p-4 md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Access Token</p>
            <p className="mt-3 break-all rounded-xl bg-slate-50 px-3 py-3 font-mono text-xs text-slate-600">
              {maskToken(tokens?.accessToken)}
            </p>

            <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-slate-400">Refresh Token</p>
            <p className="mt-3 break-all rounded-xl bg-slate-50 px-3 py-3 font-mono text-xs text-slate-600">
              {maskToken(tokens?.refreshToken)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
