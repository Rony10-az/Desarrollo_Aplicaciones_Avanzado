'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaGithub, FaShieldAlt, FaUserCheck, FaBolt, FaEnvelope, FaLock } from 'react-icons/fa';
import TiltCard from '../components/TiltCard';

type Submitting = 'google' | 'github' | 'credentials' | null;

const ERROR_MESSAGES: Record<string, string> = {
  OAuthSignin: 'No se pudo iniciar la solicitud con el proveedor. Intenta de nuevo.',
  OAuthCallback: 'El proveedor rechazó la respuesta. Verifica la configuración del callback.',
  OAuthAccountNotLinked: 'Ese correo ya está asociado a otro proveedor de inicio de sesión.',
  AccessDenied: 'Acceso denegado por el proveedor.',
  CredentialsSignin: 'Correo o contraseña incorrectos.',
  Default: 'Ocurrió un error al iniciar sesión. Intenta de nuevo.',
};

const FEATURES = [
  { icon: FaShieldAlt, text: 'Autenticación OAuth 2.0 verificada en cada acceso' },
  { icon: FaUserCheck, text: 'Sesiones protegidas y rutas privadas por usuario' },
  { icon: FaBolt, text: 'Acceso instantáneo con Google, GitHub o tu correo' },
];

function GoogleLogo() {
  return (
    <svg viewBox="0 0 48 48" className="h-4.5 w-4.5">
      <path
        fill="#FFC107"
        d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"
      />
      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34.6 6 29.6 4 24 4 16.3 4 9.6 8.3 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.5 0 10.4-1.9 14.3-5.1l-6.6-5.6c-2 1.5-4.6 2.5-7.7 2.5-5.3 0-9.7-3.4-11.3-8.1l-6.6 5.1C9.5 39.6 16.2 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.6 5.6C41.6 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"
      />
    </svg>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [submitting, setSubmitting] = useState<Submitting>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(() => {
    const code = searchParams.get('error');
    return code ? ERROR_MESSAGES[code] ?? ERROR_MESSAGES.Default : null;
  });

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setError(null);
    setSubmitting(provider);

    // OAuth providers always navigate away to the provider's consent screen —
    // `redirect: false` is only honored for Credentials/Email sign-in and, if
    // used here, leaves the button stuck mid-navigation showing a stale error.
    await signIn(provider, { callbackUrl: '/dashboard' });
  };

  const handleCredentialsSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting('credentials');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.ok) {
      router.push('/dashboard');
      return;
    }

    setError(result?.error ?? ERROR_MESSAGES.Default);
    setSubmitting(null);
  };

  const disabled = submitting !== null;

  return (
    <div className="grid min-h-[calc(100dvh-65px)] lg:grid-cols-2">
      {/* Left — brand / imagery panel */}
      <div className="relative hidden overflow-hidden bg-zinc-950 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Image
          src="https://picsum.photos/seed/myauthapp-gateway/1200/1600"
          alt=""
          fill
          priority
          className="object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-zinc-950/30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(16,185,129,0.25),transparent_55%)]" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 flex items-center gap-2"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-sm font-bold text-zinc-950">
            A
          </span>
          <span className="font-mono text-lg font-semibold text-white">
            MyAuth<span className="text-accent">App</span>
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 max-w-md"
        >
          <h2 className="text-4xl font-semibold leading-[1.1] tracking-tight text-white">
            Tu identidad, verificada en segundos.
          </h2>
          <p className="mt-4 max-w-[42ch] text-sm leading-relaxed text-zinc-300">
            Una puerta de entrada única para administrar sesiones, proteger rutas y
            confirmar quién eres realmente.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {FEATURES.map(({ icon: Icon, text }, i) => (
              <motion.li
                key={text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.25 + i * 0.12 }}
                className="flex items-center gap-3 text-sm text-zinc-200"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-accent">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                {text}
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <span className="relative z-10 text-xs text-zinc-500">
          © {new Date().getFullYear()} MyAuthApp — Laboratorio de autenticación
        </span>
      </div>

      {/* Right — login card */}
      <div className="relative flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_1px_1px,#e4e4e7_1px,transparent_0)] bg-[length:28px_28px] px-4 py-16">
        <div
          className="pointer-events-none absolute left-1/2 top-0 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-accent-soft opacity-70 blur-3xl"
          aria-hidden
        />

        <TiltCard className="relative w-full max-w-sm [transform-style:preserve-3d]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)]"
          >
            <div className="mb-6 flex flex-col items-center text-center [transform:translateZ(40px)]">
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-white shadow-lg shadow-accent/30">
                <FaShieldAlt className="h-4 w-4" />
              </span>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                Bienvenido de nuevo
              </h1>
              <p className="mt-1.5 max-w-[26ch] text-sm leading-relaxed text-zinc-500">
                Inicia sesión para continuar a tu panel.
              </p>
            </div>

            <form
              onSubmit={handleCredentialsSubmit}
              className="flex flex-col gap-3 [transform:translateZ(25px)]"
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="text-xs font-medium text-zinc-600">
                  Correo electrónico
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 transition-colors focus-within:border-accent">
                  <FaEnvelope className="h-3.5 w-3.5 text-zinc-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@ejemplo.com"
                    className="w-full text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="password" className="text-xs font-medium text-zinc-600">
                  Contraseña
                </label>
                <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 transition-colors focus-within:border-accent">
                  <FaLock className="h-3.5 w-3.5 text-zinc-400" />
                  <input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={disabled}
                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
              >
                {submitting === 'credentials' && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                Iniciar sesión
              </button>
            </form>

            <p className="mt-3 text-center text-xs text-zinc-500">
              ¿No tienes cuenta?{' '}
              <Link href="/register" className="font-medium text-accent hover:underline">
                Regístrate
              </Link>
            </p>

            <div className="my-5 flex items-center gap-3">
              <span className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                O continúa con
              </span>
              <span className="h-px flex-1 bg-zinc-200" />
            </div>

            <div className="flex flex-col gap-3 [transform:translateZ(25px)]">
              <button
                onClick={() => handleOAuthSignIn('google')}
                disabled={disabled}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-200 bg-white py-2.5 text-sm font-medium text-zinc-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-sm active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
              >
                {submitting === 'google' ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
                ) : (
                  <GoogleLogo />
                )}
                Continuar con Google
              </button>

              <button
                onClick={() => handleOAuthSignIn('github')}
                disabled={disabled}
                className="flex w-full items-center justify-center gap-3 rounded-xl bg-zinc-900 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-zinc-800 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
              >
                {submitting === 'github' ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-600 border-t-white" />
                ) : (
                  <FaGithub className="h-4 w-4" />
                )}
                Continuar con GitHub
              </button>
            </div>

            {error && (
              <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-600">
                {error}
              </p>
            )}
          </motion.div>
        </TiltCard>
      </div>
    </div>
  );
}
