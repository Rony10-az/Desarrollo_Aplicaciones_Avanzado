'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardHero } from './DashboardHero';
import { StatTile } from './StatTile';
import { AuthorCard } from './AuthorCard';
import { AuthorModal } from './AuthorModal';
import { SearchIcon, PlusIcon, SparkPagesIcon } from './icons';
import type { Author, AuthorFormValues } from './types';

type Stats = {
    totalAuthors: number;
    totalBooks: number;
    totalPages: number;
    totalGenres: number;
};

type ModalState = { mode: 'edit'; author: Author } | { mode: 'create'; author: null } | null;

export function AuthorsBoard({ initialAuthors, stats }: { initialAuthors: Author[]; stats: Stats }) {
    const router = useRouter();
    const [authors, setAuthors] = useState<Author[]>(initialAuthors);
    const [query, setQuery] = useState('');
    const [modal, setModal] = useState<ModalState>(null);

    async function refresh() {
        const res = await fetch('/api/authors');
        if (res.ok) setAuthors(await res.json());
        // Las estadisticas generales vienen pre-calculadas del server component
        // padre (Dashboard): router.refresh() lo vuelve a correr para que
        // cuenten los cambios, sin perder el estado de este componente cliente.
        router.refresh();
    }

    async function handleSubmit(values: AuthorFormValues): Promise<{ error?: string } | void> {
        const payload = {
            name: values.name.trim(),
            email: values.email.trim(),
            bio: values.bio.trim() || undefined,
            nationality: values.nationality.trim() || undefined,
            birthYear: values.birthYear ? Number(values.birthYear) : undefined,
        };

        const isEdit = modal?.mode === 'edit';
        const url = isEdit ? `/api/authors/${modal.author.id}` : '/api/authors';
        const method = isEdit ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            return { error: body.error ?? 'Algo salio mal. Intenta de nuevo.' };
        }

        setModal(null);
        refresh();
    }

    async function handleDelete(author: Author) {
        const confirmed = window.confirm(
            author.books.count > 0
                ? `Eliminar a "${author.name}" tambien eliminara sus ${author.books.count} libro(s). Continuar?`
                : `Eliminar a "${author.name}" de la biblioteca?`,
        );
        if (!confirmed) return;

        const response = await fetch(`/api/authors/${author.id}`, { method: 'DELETE' });
        if (response.ok) refresh();
    }

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return authors;
        return authors.filter((a) => a.name.toLowerCase().includes(q) || (a.nationality ?? '').toLowerCase().includes(q));
    }, [authors, query]);

    return (
        <div className="flex flex-1 flex-col bg-stone-50">
            <DashboardHero totalAuthors={stats.totalAuthors} />

            <section className="border-b border-stone-200/70 bg-white">
                <div className="mx-auto max-w-[1400px] px-6 py-10 sm:px-10 lg:px-16">
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                        <StatTile label="Autores" value={stats.totalAuthors} />
                        <StatTile label="Libros" value={stats.totalBooks} />
                        <StatTile label="Paginas catalogadas" value={stats.totalPages.toLocaleString('es-PE')} />
                        <StatTile label="Generos distintos" value={stats.totalGenres} />
                    </div>
                </div>
            </section>

            <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-10 sm:px-10 lg:px-16">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative max-w-xs flex-1">
                        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
                        <input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar autor..."
                            aria-label="Buscar autor"
                            className="w-full rounded-full border border-stone-200 bg-white py-2.5 pl-11 pr-4 text-sm text-stone-800 outline-none transition-colors placeholder:text-stone-400 focus:border-amber-700"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => setModal({ mode: 'create', author: null })}
                        className="ml-auto inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50 transition-transform active:scale-[0.98] hover:bg-stone-800"
                    >
                        <PlusIcon className="h-4 w-4" />
                        Agregar autor
                    </button>
                </div>

                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center gap-4 py-24 text-center">
                        <SparkPagesIcon className="h-16 w-16 text-stone-300" />
                        <p className="font-serif text-xl text-stone-700">
                            {authors.length === 0 ? 'Todavia no hay autores registrados.' : 'Ningun autor coincide con esa busqueda.'}
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map((author, index) => (
                            <AuthorCard
                                key={author.id}
                                author={author}
                                index={index}
                                onEdit={(a) => setModal({ mode: 'edit', author: a })}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </main>

            {modal && (
                <AuthorModal
                    key={`${modal.mode}-${modal.author?.id ?? 'new'}`}
                    mode={modal.mode}
                    author={modal.author}
                    onClose={() => setModal(null)}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}
