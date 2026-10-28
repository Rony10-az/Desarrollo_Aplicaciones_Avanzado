import { ReactNode } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { drip } from './fonts';

export const metadata: Metadata = {
    title: 'Rick and Morty - Guía de personajes',
    description:
        'Conoce a todos los personajes de Rick and Morty: especie, origen, estado y los episodios en los que aparecen.',
};

const links = [
    { href: '/RickandMorty', label: 'Inicio' },
    { href: '/RickandMorty/lista', label: 'Personajes' },
    { href: '/RickandMorty/lista#buscar', label: 'Buscar' },
];

function PortalLogo() {
    return (
        <span className="relative inline-block h-8 w-8">
            <span className="absolute inset-0 rounded-full bg-[conic-gradient(#39ff14,#0b3d0b,#b6ff8a,#0b3d0b,#39ff14)] animate-spin [animation-duration:6s]" />
            <span className="absolute inset-1.25 rounded-full bg-[#07060f]" />
            <span className="absolute inset-2 rounded-full bg-[#9dff6b]/80 blur-[1px]" />
        </span>
    );
}

export default function RickAndMortyLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-[#07060f] text-slate-100">
            {/* fija y transparente: el fondo de cada pantalla pasa detrás, no una
                barra de color sólido encima */}
            <header className="fixed inset-x-0 top-0 z-50 h-[57px] border-b border-white/10 bg-linear-to-b from-[#07060f]/70 to-transparent backdrop-blur-sm">
                <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
                    <Link href="/RickandMorty" className="flex items-center gap-2.5">
                        <PortalLogo />
                        <span
                            className={`${drip.className} text-2xl leading-none text-cyan-300 [text-shadow:0_0_10px_rgba(57,255,20,0.55),0_0_2px_rgba(57,255,20,0.8)] sm:text-3xl`}
                        >
                            Rick and Morty
                        </span>
                    </Link>
                    <ul className="flex items-center gap-0.5 sm:gap-2">
                        {links.map((link) => (
                            <li key={link.label}>
                                <Link
                                    href={link.href}
                                    className="rounded-lg px-2 py-2 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white sm:px-3 sm:text-sm"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </header>

            {children}

            <footer className="border-t border-white/10 bg-black/40">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-slate-400 sm:flex-row">
                    <p>Sitio de fans de Rick and Morty. No afiliado a Adult Swim.</p>
                    <p>
                        Datos de{' '}
                        <a
                            href="https://rickandmortyapi.com"
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 hover:underline"
                        >
                            The Rick and Morty API
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
}
