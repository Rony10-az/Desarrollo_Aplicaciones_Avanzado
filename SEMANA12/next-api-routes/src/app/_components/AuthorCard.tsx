'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { spineColorFor } from './spineColor';
import { authorPhotoFor } from './authorPhotos';
import { BookmarkIcon, EditIcon, TrashIcon, ChevronIcon } from './icons';
import type { Author } from './types';

type Props = {
    author: Author;
    index: number;
    onEdit: (author: Author) => void;
    onDelete: (author: Author) => void;
};

export function AuthorCard({ author, index, onEdit, onDelete }: Props) {
    const [photoFailed, setPhotoFailed] = useState(false);
    const spine = spineColorFor(author.name + author.id);
    const initial = author.name.trim()[0]?.toUpperCase() ?? 'A';
    const photo = authorPhotoFor(author.name);
    const showPhoto = Boolean(photo) && !photoFailed;

    return (
        <div
            className="group relative flex flex-col overflow-hidden rounded-[1.25rem] border border-stone-200/70 bg-white opacity-0 shadow-[0_18px_34px_-22px_rgba(28,25,23,0.3)] [animation-fill-mode:forwards] [animation-duration:560ms] [animation-name:spine-rise]"
            style={{ animationDelay: `${Math.min(index, 10) * 60}ms` }}
        >
            <div
                className="relative flex aspect-[4/3] items-start justify-between overflow-hidden p-5"
                style={{ backgroundColor: spine.bg, color: spine.fg }}
            >
                {showPhoto && (
                    <>
                        <Image
                            src={photo!}
                            alt=""
                            fill
                            sizes="(min-width: 1280px) 22vw, (min-width: 640px) 45vw, 90vw"
                            className="object-cover object-top"
                            onError={() => setPhotoFailed(true)}
                        />
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />
                    </>
                )}
                {!showPhoto && <span className="relative font-serif text-4xl">{initial}</span>}
                <div className="relative ml-auto flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                    <button
                        type="button"
                        aria-label={`Editar ${author.name}`}
                        onClick={() => onEdit(author)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 active:scale-95"
                    >
                        <EditIcon className="h-3.5 w-3.5" />
                    </button>
                    <button
                        type="button"
                        aria-label={`Eliminar ${author.name}`}
                        onClick={() => onDelete(author)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-red-900/70 active:scale-95"
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

                <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-stone-500">
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
