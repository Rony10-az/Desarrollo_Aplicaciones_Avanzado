import { Suspense } from 'react';
import Link from 'next/link';
import { SparkPagesIcon } from './icons';
import { ActiveNavLinks } from './ActiveNavLinks';

// Duplicado a proposito: importar un array (no un componente) desde un
// modulo 'use client' hacia un Server Component no viaja bien a traves del
// límite server/client en Turbopack -- queda como una referencia, no como
// dato real (de ahi "LINKS.map is not a function"). Se repite aqui porque
// son dos literales, no vale la pena un tercer archivo solo para esto.
const NAV_LINKS = [
    { href: '/', label: 'Panel' },
    { href: '/books', label: 'Libros' },
] as const;

// usePathname() solo se conoce en tiempo de request, asi que vive en un
// componente aparte envuelto en <Suspense> -- si no, bloquea el prerender
// de TODA la app (SiteNav esta en el layout raiz, fuera de cualquier otro
// Suspense). El fallback replica el mismo marcado sin el estado activo.
export function SiteNav() {
    return (
        <header className="sticky top-0 z-30 border-b border-stone-200/70 bg-stone-50/90 backdrop-blur-md">
            <nav className="mx-auto flex max-w-[1400px] items-center gap-8 px-6 py-3.5 sm:px-10 lg:px-16">
                <Link href="/" className="flex items-center gap-2 text-stone-900">
                    <SparkPagesIcon className="h-6 w-6" />
                    <span className="font-serif text-lg tracking-tight">La Biblioteca</span>
                </Link>
                <Suspense
                    fallback={
                        <div className="flex items-center gap-1">
                            {NAV_LINKS.map((link) => (
                                <span key={link.href} className="rounded-full px-4 py-1.5 text-sm font-medium text-stone-500">
                                    {link.label}
                                </span>
                            ))}
                        </div>
                    }
                >
                    <ActiveNavLinks />
                </Suspense>
            </nav>
        </header>
    );
}
