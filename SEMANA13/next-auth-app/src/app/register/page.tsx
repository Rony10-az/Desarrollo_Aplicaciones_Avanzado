'use client';

import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from 'react-icons/fa';
import TiltCard from '../components/TiltCard';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setSubmitting(true);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      setError(data.error ?? 'No se pudo crear la cuenta.');
      setSubmitting(false);
      return;
    }

    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.ok) {
      router.push('/dashboard');
      return;
    }

    router.push('/signIn');
  };

  return (
    <div className="relative flex min-h-[calc(100dvh-65px)] items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_1px_1px,#e4e4e7_1px,transparent_0)] bg-[length:28px_28px] px-4 py-16">
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
              <FaUserPlus className="h-4 w-4" />
            </span>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
              Crea tu cuenta
            </h1>
            <p className="mt-1.5 max-w-[28ch] text-sm leading-relaxed text-zinc-500">
              Regístrate con tu correo para acceder al panel.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 [transform:translateZ(25px)]"
          >
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-xs font-medium text-zinc-600">
                Nombre completo
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 transition-colors focus-within:border-accent">
                <FaUser className="h-3.5 w-3.5 text-zinc-400" />
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>

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
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="confirmPassword" className="text-xs font-medium text-zinc-600">
                Confirmar contraseña
              </label>
              <div className="flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 transition-colors focus-within:border-accent">
                <FaLock className="h-3.5 w-3.5 text-zinc-400" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="w-full text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
            >
              {submitting && (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              Crear cuenta
            </button>
          </form>

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-center text-xs text-red-600">
              {error}
            </p>
          )}

          <p className="mt-5 text-center text-xs text-zinc-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/signIn" className="font-medium text-accent hover:underline">
              Inicia sesión
            </Link>
          </p>
        </motion.div>
      </TiltCard>
    </div>
  );
}
