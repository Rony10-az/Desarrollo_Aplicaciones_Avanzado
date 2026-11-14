'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="rounded-full border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all duration-200 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
        >
            Cerrar sesión
        </button>
    );
}