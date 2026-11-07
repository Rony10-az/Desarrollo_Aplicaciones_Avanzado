'use client';

import Link from 'next/link';
import { spineColorFor } from './spineColor';
import { BookmarkIcon, EditIcon, TrashIcon, ChevronIcon } from './icons';
import type { Author } from './types';

type Props = {
    author: Author;
    index: number;
    onEdit: (author: Author) => void;
    onDelete: (author: Author) => void;
};

export function AuthorCard({ author, index, onEdit, onDelete }: Props) {
    const spine = spineColorFor(author.name + author.id);
    const initial = author.name.trim()[0]?.toUpperCase() ?? 'A';

    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-[1.25rem] border border-stone-200/70 bg-white opacity-0 shadow-[0_18px_34px_-22px_rgba(28,25,23,0.3)] [animation-fill-mode:forwards] [animation-duration:560ms] [animation-name:spine-rise]"
            style={{ animationDelay: `${Math.min(index, 10) * 60}ms` }}
        >
            <div
                className="relative flex items-start justify-between p-6"
                style={{ backgroundColor: spine.bg, color: spine.fg }}
            >
                <span className="font-serif text-4xl">{initial}</span>
                <div className="flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                    <button
                        type="button"
                        aria-label={`Editar ${author.name}`}
                        onClick={() => onEdit(author)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-black/35 active:scale-95"
                    >
                        <EditIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        aria-label={`Eliminar ${author.name}`}
                        onClick={() => onDelete(author)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-red-900/60 active:scale-95"
                    >
                        <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                </div>
            </div>

            <div className="flex flex-1 flex-col gap-3 p-6">
                <div>
                    <p className="font-serif text-xl leading-snug tracking-tight text-stone-900 [text-wrap:balance]">
                        {author.name}
                    </p>
                    <p className="mt-1 text-[13px] text-stone-500">
                        {author.nationality ?? 'Nacionalidad sin registrar'}
                        {author.birthYear ? ` · n. ${author.birthYear}` : ''}
                    </p>
                </div>

                <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-stone-500">
                    {author.bio || 'Todavia no tiene una biografia registrada.'}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-stone-400">
                    <BookmarkIcon className="h-3.5 w-3.5" />
                    {author.books.count} {author.books.count === 1 ? 'libro' : 'libros'}
                </div>

                <Link
                    href={`/authors/${author.id}`}
                    className="mt-1 inline-flex items-center justify-between rounded-full bg-stone-900 px-4 py-2.5 text-sm font-medium text-stone-50 transition-transform active:scale-[0.98] hover:bg-stone-800"
                >
                    Ver libros
                    <ChevronIcon className="h-4 w-4" />
                </Link>
            </div>
        </div>
    );
}
