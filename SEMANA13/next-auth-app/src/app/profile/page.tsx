import { getServerSession } from 'next-auth';
import Image from 'next/image';
import { FaEnvelope, FaGithub, FaGoogle, FaIdBadge, FaKey, FaShieldAlt } from 'react-icons/fa';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { RevealGroup, RevealItem } from '@/app/components/Reveal';

const PROVIDER_META: Record<string, { label: string; icon: typeof FaGoogle }> = {
  google: { label: 'Google', icon: FaGoogle },
  github: { label: 'GitHub', icon: FaGithub },
  credentials: { label: 'Correo y contraseña', icon: FaKey },
};

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  const name = session?.user?.name ?? 'Usuario';
  const provider = session?.user?.provider
    ? PROVIDER_META[session.user.provider]
    : undefined;
  const ProviderIcon = provider?.icon;

  const infoRows = [
    { icon: FaIdBadge, label: 'Nombre completo', value: name },
    { icon: FaEnvelope, label: 'Correo electrónico', value: session?.user?.email ?? '—' },
    {
      icon: FaShieldAlt,
      label: 'Proveedor de autenticación',
      value: provider?.label ?? 'Desconocido',
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <RevealGroup>
        {/* Cover + avatar */}
        <RevealItem className="relative h-44 overflow-hidden rounded-3xl bg-zinc-950 sm:h-56">
          <Image
            src="https://picsum.photos/seed/myauthapp-profile-cover/1200/500"
            alt=""
            fill
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />
        </RevealItem>

        <RevealItem className="relative -mt-14 flex flex-col items-center px-6 text-center sm:-mt-16">
          {session?.user?.image ? (
            <Image
              src={session.user.image}
              alt={name}
              width={112}
              height={112}
              className="h-28 w-28 rounded-3xl object-cover ring-4 ring-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]"
            />
          ) : (
            <span className="flex h-28 w-28 items-center justify-center rounded-3xl bg-accent text-3xl font-semibold text-white ring-4 ring-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]">
              {name.charAt(0).toUpperCase()}
            </span>
          )}

          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-zinc-900">
            {name}
          </h1>

          {provider && ProviderIcon && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-600 shadow-sm">
              <ProviderIcon className="h-3 w-3" />
              Conectado con {provider.label}
            </span>
          )}
        </RevealItem>

        {/* Info */}
        <RevealItem className="mt-10 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {infoRows.map(({ icon: Icon, label, value }, i) => (
            <div
              key={label}
              className={`flex items-center gap-4 px-6 py-4 ${
                i !== infoRows.length - 1 ? 'border-b border-zinc-100' : ''
              }`}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                  {label}
                </p>
                <p className="mt-0.5 text-sm font-medium text-zinc-900">{value}</p>
              </div>
            </div>
          ))}
        </RevealItem>
      </RevealGroup>
    </div>
  );
}
