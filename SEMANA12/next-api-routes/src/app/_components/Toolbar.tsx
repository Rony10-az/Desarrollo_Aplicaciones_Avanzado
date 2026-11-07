'use client';

import type { ReactNode } from 'react';
import { ChevronIcon, PlusIcon } from './icons';
import type { AuthorOption } from './types';

export type SortValue = 'createdAt-desc' | 'createdAt-asc' | 'title-asc' | 'title-desc' | 'publishedYear-desc' | 'publishedYear-asc';

const SORT_OPTIONS: { value: SortValue; label: string }[] = [
    { value: 'createdAt-desc', label: 'Agregados recientemente' },
    { value: 'createdAt-asc', label: 'Agregados hace tiempo' },
    { value: 'title-asc', label: 'Titulo, A a Z' },
    { value: 'title-desc', label: 'Titulo, Z a A' },
    { value: 'publishedYear-desc', label: 'Mas recientes publicados' },
    { value: 'publishedYear-asc', label: 'Mas antiguos publicados' },
];

type Props = {
    genres: string[];
    authors: AuthorOption[];
    genre: string;
    authorName: string;
    sort: SortValue;
    onGenreChange: (value: string) => void;
    onAuthorChange: (value: string) => void;
    onSortChange: (value: SortValue) => void;
    onCreate: () => void;
};

function Select({
    value,
    onChange,
    children,
    ariaLabel,
}: {
    value: string;
    onChange: (value: string) => void;
    children: ReactNode;
    ariaLabel: string;
}) {
    return (
        <div className="relative">
            <select
                aria-label={ariaLabel}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="appearance-none rounded-full border border-stone-200 bg-white py-2.5 pl-4 pr-9 text-sm text-stone-700 outline-none transition-colors hover:border-stone-300 focus:border-amber-700"
            >
                {children}
            </select>
            <ChevronIcon className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rotate-90 text-stone-400" />
        </div>
    );
}

export function Toolbar({ genres, authors, genre, authorName, sort, onGenreChange, onAuthorChange, onSortChange, onCreate }: Props) {
    return (
        <div className="sticky top-0 z-20 border-b border-stone-200/70 bg-stone-50/85 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-3 px-6 py-4 sm:px-10 lg:px-16">
                <Select ariaLabel="Filtrar por genero" value={genre} onChange={onGenreChange}>
                    <option value="">Todos los generos</option>
                    {genres.map((g) => (
                        <option key={g} value={g}>
                            {g}
                        </option>
                    ))}
                </Select>

                <Select ariaLabel="Filtrar por autor" value={authorName} onChange={onAuthorChange}>
                    <option value="">Todos los autores</option>
                    {authors.map((a) => (
                        <option key={a.id} value={a.name}>
                            {a.name}
                        </option>
                    ))}
                </Select>

                <Select ariaLabel="Ordenar resultados" value={sort} onChange={(v) => onSortChange(v as SortValue)}>
                    {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </Select>

                <button
                    type="button"
                    onClick={onCreate}
                    className="ml-auto inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50 transition-transform active:scale-[0.98] hover:bg-stone-800"
                >
                    <PlusIcon className="h-4 w-4" />
                    Agregar libro
                </button>
            </div>
        </div>
    );
}
