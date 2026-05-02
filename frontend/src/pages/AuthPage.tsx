import { useMemo, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useAuth } from "../shared/auth/AuthContext";
import type { LoginInput, SignupInput } from "../shared/types/auth";

function buildEmptySignupForm(): SignupInput {
  return {
    username: "",
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  };
}

export function AuthPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loginForm, setLoginForm] = useState<LoginInput>({ username: "", password: "" });
  const [signupForm, setSignupForm] = useState<SignupInput>(() => buildEmptySignupForm());
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mode = searchParams.get("mode") === "signup" ? "signup" : "login";
  const title = useMemo(
    () =>
      mode === "signup"
        ? "Alisverisim ailesine katil"
        : "Alisverisim hesabina giris yap",
    [mode],
  );

  async function submitLogin() {
    setSubmitting(true);
    setError(null);

    try {
      await auth.login(loginForm);
      navigate("/");
    } catch (submitError) {
      setError("Giris yapilamadi. Kullanici adi veya sifreni kontrol et.");
    } finally {
      setSubmitting(false);
    }
  }

  async function submitSignup() {
    setSubmitting(true);
    setError(null);

    try {
      await auth.signup(signupForm);
      navigate("/");
    } catch (submitError) {
      setError("Kayit olusturulamadi. Kullanici adi veya email zaten kullaniliyor olabilir.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitLogin();
  }

  async function handleSignupSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitSignup();
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-12rem)] max-w-7xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
      <section className="w-full max-w-xl">
        <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
          <div className="bg-[radial-gradient(circle_at_top_left,_rgba(255,68,239,0.18),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.18),_transparent_35%),linear-gradient(135deg,#fff,#fff7fd)] px-6 py-8 text-center sm:px-10">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-brand-700">Guvenli Giris</p>
            <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-slate-900">{title}</h1>
            <p className="mt-4 text-sm leading-7 text-slate-600 sm:text-base">
              Keycloak altyapisi arka planda calisiyor, fakat artik tum login ve kayit deneyimi Alisverisim tasarimi icinde devam ediyor.
            </p>

            <div className="mt-6 inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
              <button
                type="button"
                onClick={() => setSearchParams({ mode: "login" })}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                  mode === "login" ? "bg-brand-700 text-white" : "text-slate-500 hover:text-brand-700"
                }`}
              >
                Giris Yap
              </button>
              <button
                type="button"
                onClick={() => setSearchParams({ mode: "signup" })}
                className={`rounded-full px-5 py-2 text-sm font-bold transition ${
                  mode === "signup" ? "bg-brand-700 text-white" : "text-slate-500 hover:text-brand-700"
                }`}
              >
                Uye Ol
              </button>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10">
            {error ? (
              <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            ) : null}

            {mode === "login" ? (
              <form className="grid gap-4" onSubmit={handleLoginSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Kullanici adi</span>
                  <input
                    value={loginForm.username}
                    onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-300"
                    placeholder="kullaniciadin"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Sifre</span>
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-300"
                    placeholder="Sifreni gir"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => void submitLogin()}
                  disabled={submitting}
                  className="mt-2 rounded-2xl bg-brand-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Giris yapiliyor..." : "Giris Yap"}
                </button>
              </form>
            ) : (
              <form className="grid gap-4 sm:grid-cols-2" onSubmit={handleSignupSubmit}>
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Ad</span>
                  <input
                    value={signupForm.firstName}
                    onChange={(event) => setSignupForm((current) => ({ ...current, firstName: event.target.value }))}
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-300"
                    placeholder="Cagdas"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Soyad</span>
                  <input
                    value={signupForm.lastName}
                    onChange={(event) => setSignupForm((current) => ({ ...current, lastName: event.target.value }))}
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-300"
                    placeholder="Bilgin"
                  />
                </label>

                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">Email</span>
                  <input
                    type="email"
                    value={signupForm.email}
                    onChange={(event) => setSignupForm((current) => ({ ...current, email: event.target.value }))}
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-300"
                    placeholder="ornek@mail.com"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Kullanici adi</span>
                  <input
                    value={signupForm.username}
                    onChange={(event) => setSignupForm((current) => ({ ...current, username: event.target.value }))}
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-300"
                    placeholder="cagdasbilgin"
                  />
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Sifre</span>
                  <input
                    type="password"
                    value={signupForm.password}
                    onChange={(event) => setSignupForm((current) => ({ ...current, password: event.target.value }))}
                    className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-300"
                    placeholder="En az 8 karakter"
                  />
                </label>

                <button
                  type="button"
                  onClick={() => void submitSignup()}
                  disabled={submitting}
                  className="sm:col-span-2 mt-2 rounded-2xl bg-brand-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? "Hesap olusturuluyor..." : "Uyeligi Tamamla"}
                </button>
              </form>
            )}
            <div className="mt-6 flex justify-center">
              <Link
                to="/"
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-brand-200 hover:text-brand-700"
              >
                Ana sayfaya don
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
