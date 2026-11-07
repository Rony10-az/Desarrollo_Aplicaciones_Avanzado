'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const LINKS = [
    { href: '/', label: 'Panel' },
    { href: '/books', label: 'Libros' },
] as const;

export function ActiveNavLinks() {
    const pathname = usePathname();

    return (
        <div className="flex items-center gap-1">
            {LINKS.map((link) => {
                const active = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href);
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={
                            active
                                ? 'rounded-full bg-stone-900 px-4 py-1.5 text-sm font-medium text-stone-50'
                                : 'rounded-full px-4 py-1.5 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800'
                        }
                    >
                        {link.label}
                    </Link>
                );
            })}
        </div>
    );
}
