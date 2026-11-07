'use client';

import Image from 'next/image';
import { useRef, useState, type MouseEvent } from 'react';
import { spineColorFor } from './spineColor';
import { cardImageFor, openLibraryCoverUrl } from './libraryImages';
import { MagnifierIcon, EditIcon, TrashIcon } from './icons';
import type { Book } from './types';

type Props = {
    book: Book;
    index: number;
    onOpen: (book: Book, origin: { x: number; y: number }) => void;
    onEdit: (book: Book, origin: { x: number; y: number }) => void;
    onDelete: (book: Book) => void;
};

export function BookSpineCard({ book, index, onOpen, onEdit, onDelete }: Props) {
    const cardRef = useRef<HTMLDivElement | null>(null);
    const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null);
    const [realCoverFailed, setRealCoverFailed] = useState(false);
    const { bg, fg } = spineColorFor(book.title + book.id);
    const fallbackImage = cardImageFor(book.title + book.id);
    const realCover = book.isbn ? openLibraryCoverUrl(book.isbn) : null;
    const showRealCover = Boolean(realCover) && !realCoverFailed;

    function handleMouseMove(event: MouseEvent<HTMLDivElement>) {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    }

    function originFromEvent(event: MouseEvent<HTMLElement>) {
        return { x: event.clientX, y: event.clientY };
    }

    const editDeleteButtons = (
        <div className="flex gap-1.5 opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
            <button
                type="button"
                aria-label={`Editar ${book.title}`}
                onClick={(event) => {
                    event.stopPropagation();
                    onEdit(book, originFromEvent(event));
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-black/55 active:scale-95"
            >
                <EditIcon className="h-3.5 w-3.5" />
            </button>
            <button
                type="button"
                aria-label={`Eliminar ${book.title}`}
                onClick={(event) => {
                    event.stopPropagation();
                    onDelete(book);
                }}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition-colors hover:bg-red-900/70 active:scale-95"
            >
                <TrashIcon className="h-3.5 w-3.5" />
            </button>
        </div>
    );

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setCursor(null)}
            onClick={(event) => onOpen(book, originFromEvent(event))}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                    const rect = cardRef.current?.getBoundingClientRect();
                    onOpen(book, rect ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 } : { x: 0, y: 0 });
                }
            }}
            className="group relative flex aspect-[2/3] cursor-pointer flex-col justify-between overflow-hidden rounded-[1.25rem] opacity-0 shadow-[0_18px_34px_-18px_rgba(28,25,23,0.35)] outline-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] [animation-fill-mode:forwards] [animation-duration:620ms] [animation-name:spine-rise] hover:-translate-y-1.5 focus-visible:-translate-y-1.5 focus-visible:ring-2 focus-visible:ring-amber-200"
            style={{ animationDelay: `${Math.min(index, 10) * 60}ms` }}
        >
            {showRealCover ? (
                <>
                    {/* portada real del libro (Open Library) */}
                    <Image
                        src={realCover!}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 20vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                        onError={() => setRealCoverFailed(true)}
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                    />
                    <div className="relative flex items-start justify-between gap-2 p-4">
                        <span
                            className="rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide text-white shadow-sm backdrop-blur-sm"
                            style={{ backgroundColor: `${bg}cc` }}
                        >
                            {book.genre ?? 'Sin genero'}
                        </span>
                        {editDeleteButtons}
                    </div>

                    {/* placa de museo: metadata en una franja baja, la portada queda limpia */}
                    <div className="relative mt-auto bg-stone-950/85 px-4 py-3 text-white backdrop-blur-sm">
                        <p className="font-serif text-base leading-snug tracking-tight [text-wrap:balance] line-clamp-2">
                            {book.title}
                        </p>
                        <p className="mt-1 text-[12px] text-stone-300">{book.author.name}</p>
                    </div>
                </>
            ) : (
                <>
                    {/* respaldo: textura de biblioteca + velo de color por coleccion */}
                    <Image
                        src={fallbackImage}
                        alt=""
                        fill
                        sizes="(min-width: 1280px) 20vw, (min-width: 640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0"
                        style={{ backgroundColor: bg, opacity: 0.5, mixBlendMode: 'multiply' }}
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-transparent"
                    />
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-0 w-2.5"
                        style={{ backgroundColor: 'rgba(0,0,0,0.25)' }}
                    />

                    <div className="relative flex items-start justify-between gap-2 p-5" style={{ color: fg }}>
                        <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide" style={{ borderColor: `${fg}50` }}>
                            {book.genre ?? 'Sin genero'}
                        </span>
                        {editDeleteButtons}
                    </div>

                    <div className="relative p-5 pt-0" style={{ color: fg }}>
                        <p className="font-serif text-xl leading-snug tracking-tight [text-wrap:balance] line-clamp-4">
                            {book.title}
                        </p>
                        <p className="mt-2 text-[13px] opacity-90">{book.author.name}</p>
                        <p className="mt-0.5 text-[11px] uppercase tracking-[0.14em] opacity-70">
                            {book.publishedYear ?? 's. f.'}
                            {book.pages ? ` · ${book.pages} pag.` : ''}
                        </p>
                    </div>
                </>
            )}

            {/* cursor-lupa: solo dentro de la tarjeta, sobre hover */}
            {cursor && (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/40 bg-white/15 opacity-0 backdrop-blur-[2px] transition-opacity duration-150 group-hover:opacity-100"
                    style={{ left: cursor.x, top: cursor.y }}
                >
                    <MagnifierIcon className="h-5 w-5 text-white" />
                </div>
            )}
        </div>
    );
}
