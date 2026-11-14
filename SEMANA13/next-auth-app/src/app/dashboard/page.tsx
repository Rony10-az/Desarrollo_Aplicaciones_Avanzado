import { getServerSession } from 'next-auth';
import Image from 'next/image';
import {
  FaCalendarDay,
  FaClock,
  FaGithub,
  FaGoogle,
  FaHourglassHalf,
  FaKey,
  FaUserShield,
} from 'react-icons/fa';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RevealGroup, RevealItem } from '@/app/components/Reveal';

const PROVIDER_META: Record<string, { label: string; icon: typeof FaGoogle }> = {
  google: { label: 'Google', icon: FaGoogle },
  github: { label: 'GitHub', icon: FaGithub },
  credentials: { label: 'Correo y contraseña', icon: FaKey },
};

function getGreeting(hour: number) {
  if (hour < 6) return 'Buenas noches';
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const now = new Date();

  const firstName = session?.user?.name?.split(' ')[0] ?? 'Usuario';
  const greeting = getGreeting(now.getHours());
  const provider = session?.user?.provider
    ? PROVIDER_META[session.user.provider]
    : undefined;

  const today = now.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  const time = now.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  const expires = session?.expires
    ? new Date(session.expires).toLocaleString('es-PE', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '—';

  const stats = [
    {
      icon: FaCalendarDay,
      label: 'Hoy es',
      value: today.charAt(0).toUpperCase() + today.slice(1),
    },
    {
      icon: FaClock,
      label: 'Última verificación',
      value: time,
    },
    {
      icon: FaUserShield,
      label: 'Proveedor de acceso',
      value: provider?.label ?? 'Desconocido',
    },
    {
      icon: FaHourglassHalf,
      label: 'Sesión válida hasta',
      value: expires,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-950 px-8 py-10 sm:px-12 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.35),transparent_55%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.07)_1px,transparent_0)] bg-[length:24px_24px]" />

        <RevealGroup className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <RevealItem>
            {session?.user?.image ? (
              <Image
                src={session.user.image}
                alt={session.user.name ?? 'Perfil'}
                width={88}
                height={88}
                className="h-20 w-20 rounded-2xl object-cover ring-4 ring-white/10 sm:h-24 sm:w-24"
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-2xl font-semibold text-zinc-950 ring-4 ring-white/10">
                {firstName.charAt(0).toUpperCase()}
              </span>
            )}
          </RevealItem>

          <div>
            <RevealItem className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              Sesión activa
            </RevealItem>
            <RevealItem>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {greeting}, {firstName}
              </h1>
            </RevealItem>
            <RevealItem>
              <p className="mt-2 text-sm text-zinc-400">{session?.user?.email}</p>
            </RevealItem>
          </div>
        </RevealGroup>
      </div>

      {/* Stats — qué pasó hoy */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Resumen de hoy
      </h2>

      <RevealGroup className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ icon: Icon, label, value }) => (
          <RevealItem
            key={label}
            className="group rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_20px_30px_-15px_rgba(0,0,0,0.12)]"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-soft text-accent transition-transform duration-200 group-hover:scale-110">
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-zinc-400">
              {label}
            </p>
            <p className="mt-1 text-lg font-semibold text-zinc-900">{value}</p>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
}
