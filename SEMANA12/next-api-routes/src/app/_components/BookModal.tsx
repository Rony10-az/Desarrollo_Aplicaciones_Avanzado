'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { spineColorFor } from './spineColor';
import { cardImageFor, OPEN_BOOK_IMAGE, openLibraryCoverUrl } from './libraryImages';
import { AuthorAvatar } from './AuthorAvatar';
import { CloseIcon, EditIcon, TrashIcon, BookmarkIcon } from './icons';
import type { AuthorOption, Book, BookFormValues } from './types';
import { emptyBookForm } from './types';

type Mode = 'view' | 'edit' | 'create';

type Props = {
    mode: Mode;
    book: Book | null;
    origin: { x: number; y: number };
    authors: AuthorOption[];
    onClose: () => void;
    onEditRequested: () => void;
    onDelete: (book: Book) => void;
    onSubmit: (values: BookFormValues) => Promise<{ error?: string } | void>;
};

function bookToForm(book: Book | null): BookFormValues {
    if (!book) return emptyBookForm;
    return {
        title: book.title,
        description: book.description ?? '',
        isbn: book.isbn ?? '',
        publishedYear: book.publishedYear?.toString() ?? '',
        genre: book.genre ?? '',
        pages: book.pages?.toString() ?? '',
        authorId: book.authorId,
    };
}

export function BookModal({ mode, book, origin, authors, onClose, onEditRequested, onDelete, onSubmit }: Props) {
    const [revealed, setRevealed] = useState(false);
    const [closing, setClosing] = useState(false);
    const [opened, setOpened] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    // El padre monta este componente con `key={mode + (book?.id ?? 'new')}`, asi que un
    // cambio de libro o de modo remonta el formulario con su estado inicial correcto,
    // en vez de sincronizarlo con un efecto.
    const [form, setForm] = useState<BookFormValues>(() => {
        const base = bookToForm(book);
        // Si solo hay un autor posible (p. ej. "Agregar libro" desde la ficha
        // de un autor), lo preseleccionamos: no tiene sentido pedir elegir
        // entre una sola opcion.
        if (!base.authorId && authors.length === 1) {
            return { ...base, authorId: authors[0]!.id };
        }
        return base;
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [realCoverFailed, setRealCoverFailed] = useState(false);
    const bookRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const raf = requestAnimationFrame(() => setRevealed(true));
        const openTimer = setTimeout(() => setOpened(true), 120);
        function onKey(event: KeyboardEvent) {
            if (event.key === 'Escape') handleClose();
        }
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(openTimer);
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleClose() {
        setClosing(true);
        setRevealed(false);
        setOpened(false);
        setTimeout(onClose, 420);
    }

    function handleBookMouseMove(event: MouseEvent<HTMLDivElement>) {
        const rect = bookRef.current?.getBoundingClientRect();
        if (!rect) return;
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: px * -6, y: py * 5 });
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!form.title.trim() || !form.authorId) {
            setError('El titulo y el autor son obligatorios.');
            return;
        }
        setSaving(true);
        setError(null);
        const result = await onSubmit(form);
        setSaving(false);
        if (result?.error) {
            setError(result.error);
        }
    }

    const seed = book ? book.title + book.id : 'nuevo-libro';
    const spine = spineColorFor(seed);
    const fallbackCoverImage = cardImageFor(seed);
    const realCover = book?.isbn ? openLibraryCoverUrl(book.isbn) : null;
    const showRealCover = Boolean(realCover) && !realCoverFailed;
    const isForm = mode === 'edit' || mode === 'create';

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-10"
            style={{
                clipPath: revealed && !closing
                    ? `circle(150% at ${origin.x}px ${origin.y}px)`
                    : `circle(0px at ${origin.x}px ${origin.y}px)`,
                transition: 'clip-path 520ms cubic-bezier(0.16, 1, 0.3, 1)',
            }}
        >
            <div
                aria-hidden="true"
                onClick={handleClose}
                className="absolute inset-0 bg-stone-950/75 backdrop-blur-sm"
            />

            {/* escenario 3D: el perspective vive aqui, preserve-3d en el libro */}
            <div
                className="relative w-full max-w-6xl"
                style={{ perspective: '2400px' }}
                onMouseMove={handleBookMouseMove}
                onMouseLeave={() => setTilt({ x: 0, y: 0 })}
            >
                <div
                    ref={bookRef}
                    role="dialog"
                    aria-modal="true"
                    aria-label={book ? book.title : 'Nuevo libro'}
                    className="relative grid max-h-[88vh] w-full grid-cols-1 overflow-visible rounded-[1.25rem] md:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]"
                    style={{
                        transformStyle: 'preserve-3d',
                        transform: `rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
                        transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    <button
                        type="button"
                        onClick={handleClose}
                        aria-label="Cerrar"
                        className="absolute -right-3 -top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-stone-50 text-stone-700 shadow-lg transition-transform hover:scale-105 active:scale-95"
                    >
                        <CloseIcon className="h-4 w-4" />
                    </button>

                    {/* tapa: gira sobre su bisagra derecha, como una portada abriendose */}
                    <div
                        className="relative flex flex-col justify-between overflow-hidden rounded-l-[1.25rem] rounded-r-sm p-9 sm:p-12 md:rounded-r-none"
                        style={{
                            transformStyle: 'preserve-3d',
                            transformOrigin: 'right center',
                            transform: opened ? 'rotateY(0deg)' : 'rotateY(-32deg)',
                            transition: 'transform 640ms cubic-bezier(0.22, 1, 0.36, 1)',
                            boxShadow: '18px 0 40px -20px rgba(0,0,0,0.55)',
                        }}
                    >
                        {showRealCover ? (
                            <>
                                {/* portada real del libro (Open Library), limpia */}
                                <Image
                                    src={realCover!}
                                    alt=""
                                    fill
                                    sizes="(min-width: 768px) 40vw, 100vw"
                                    className="object-cover"
                                    onError={() => setRealCoverFailed(true)}
                                />
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/40 to-transparent"
                                />
                                <BookmarkIcon className="relative z-[1] h-7 w-7 text-white drop-shadow" />
                                <div className="relative z-[1] mt-auto -mx-9 -mb-9 bg-stone-950/85 px-9 py-6 backdrop-blur-sm sm:-mx-12 sm:-mb-12 sm:px-12">
                                    <p className="font-serif text-2xl leading-[1.1] tracking-tight text-white [text-wrap:balance] sm:text-3xl">
                                        {mode === 'create' ? 'Nuevo volumen' : book?.title}
                                    </p>
                                    {mode !== 'create' && book && (
                                        <>
                                            <p className="mt-2 flex items-center gap-2 text-sm text-stone-200">
                                                <AuthorAvatar name={book.author.name} id={book.author.id} photoUrl={book.author.photoUrl} size={24} />
                                                {book.author.name}
                                            </p>
                                            {book.author.nationality && (
                                                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-400">{book.author.nationality}</p>
                                            )}
                                        </>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                {/* respaldo: textura + velo de color de la coleccion */}
                                <Image
                                    src={fallbackCoverImage}
                                    alt=""
                                    fill
                                    sizes="(min-width: 768px) 40vw, 100vw"
                                    className="object-cover"
                                />
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0"
                                    style={{ backgroundColor: spine.bg, opacity: 0.45, mixBlendMode: 'multiply' }}
                                />
                                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/5 to-black/20" />
                                {/* sombra de la bisagra, para que se sienta el lomo del libro */}
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-black/50 to-transparent"
                                />

                                <BookmarkIcon className="relative z-[1] h-7 w-7 text-stone-100 opacity-80" />
                                <div className="relative z-[1]" style={{ color: spine.fg }}>
                                    <p className="font-serif text-3xl leading-[1.08] tracking-tight text-white [text-wrap:balance] sm:text-4xl">
                                        {mode === 'create' ? 'Nuevo volumen' : book?.title}
                                    </p>
                                    {mode !== 'create' && book && (
                                        <>
                                            <p className="mt-3 flex items-center gap-2 text-sm text-stone-200">
                                                <AuthorAvatar name={book.author.name} id={book.author.id} photoUrl={book.author.photoUrl} size={24} />
                                                {book.author.name}
                                            </p>
                                            {book.author.nationality && (
                                                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-300">{book.author.nationality}</p>
                                            )}
                                        </>
                                    )}
                                </div>
                                <p className="relative z-[1] text-[11px] uppercase tracking-[0.2em] text-stone-300">
                                    {mode === 'create' ? 'Catalogacion' : 'Ficha bibliografica'}
                                </p>
                            </>
                        )}
                    </div>

                    {/* paginas: panel de contenido, con textura de papel de fondo */}
                    <div
                        className="relative max-h-[88vh] overflow-y-auto rounded-r-[1.25rem] bg-stone-50 p-9 sm:p-12"
                        style={{
                            transformStyle: 'preserve-3d',
                            boxShadow: 'inset 14px 0 30px -24px rgba(28,25,23,0.5)',
                        }}
                    >
                        <Image
                            src={OPEN_BOOK_IMAGE.src}
                            alt=""
                            fill
                            sizes="60vw"
                            className="pointer-events-none object-cover opacity-[0.05]"
                        />
                        <div
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-y-0 left-0 hidden w-10 bg-gradient-to-r from-black/10 to-transparent md:block"
                        />

                        <div className="relative">
                            {!isForm && book && (
                                <div className="animate-[fade-in_400ms_ease-out]">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="rounded-full bg-amber-800/10 px-3 py-1 text-xs font-medium text-amber-900">
                                            {book.genre ?? 'Sin genero'}
                                        </span>
                                        <span className="text-xs text-stone-400">·</span>
                                        <span className="text-xs text-stone-500">{book.publishedYear ?? 'Sin fecha de publicacion'}</span>
                                        {book.pages && (
                                            <>
                                                <span className="text-xs text-stone-400">·</span>
                                                <span className="text-xs text-stone-500">{book.pages} paginas</span>
                                            </>
                                        )}
                                    </div>

                                    <p className="mt-5 max-w-[60ch] text-[15px] leading-relaxed text-stone-600">
                                        {book.description || 'Este volumen todavia no tiene una descripcion registrada.'}
                                    </p>

                                    <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-stone-200 pt-6 text-sm">
                                        <div>
                                            <dt className="text-xs uppercase tracking-wide text-stone-400">ISBN</dt>
                                            <dd className="mt-1 font-mono text-stone-700">{book.isbn ?? '—'}</dd>
                                        </div>
                                        <div>
                                            <dt className="text-xs uppercase tracking-wide text-stone-400">Catalogado</dt>
                                            <dd className="mt-1 text-stone-700">
                                                {new Date(book.createdAt).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </dd>
                                        </div>
                                    </dl>

                                    <div className="mt-8 flex flex-wrap gap-3">
                                        <button
                                            type="button"
                                            onClick={onEditRequested}
                                            className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50 transition-transform active:scale-[0.98] hover:bg-stone-800"
                                        >
                                            <EditIcon className="h-4 w-4" />
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(book)}
                                            className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-2.5 text-sm font-medium text-red-700 transition-transform active:scale-[0.98] hover:bg-red-50"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            )}

                            {isForm && (
                                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="title" className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                            Titulo
                                        </label>
                                        <input
                                            id="title"
                                            value={form.title}
                                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                                            placeholder="Cien anos de soledad"
                                            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-amber-700"
                                            required
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="authorId" className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                            Autor
                                        </label>
                                        <select
                                            id="authorId"
                                            value={form.authorId}
                                            onChange={(e) => setForm((f) => ({ ...f, authorId: e.target.value }))}
                                            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-amber-700"
                                            required
                                        >
                                            <option value="" disabled>
                                                Selecciona un autor
                                            </option>
                                            {authors.map((author) => (
                                                <option key={author.id} value={author.id}>
                                                    {author.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="genre" className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                                Genero
                                            </label>
                                            <input
                                                id="genre"
                                                value={form.genre}
                                                onChange={(e) => setForm((f) => ({ ...f, genre: e.target.value }))}
                                                placeholder="Novela"
                                                className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-amber-700"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="publishedYear" className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                                Ano
                                            </label>
                                            <input
                                                id="publishedYear"
                                                type="number"
                                                value={form.publishedYear}
                                                onChange={(e) => setForm((f) => ({ ...f, publishedYear: e.target.value }))}
                                                placeholder="1967"
                                                className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-amber-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="pages" className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                                Paginas
                                            </label>
                                            <input
                                                id="pages"
                                                type="number"
                                                value={form.pages}
                                                onChange={(e) => setForm((f) => ({ ...f, pages: e.target.value }))}
                                                placeholder="417"
                                                className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-amber-700"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <label htmlFor="isbn" className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                                ISBN
                                            </label>
                                            <input
                                                id="isbn"
                                                value={form.isbn}
                                                onChange={(e) => setForm((f) => ({ ...f, isbn: e.target.value }))}
                                                placeholder="978-0307474728"
                                                className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-amber-700"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label htmlFor="description" className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                            Descripcion
                                        </label>
                                        <textarea
                                            id="description"
                                            value={form.description}
                                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                                            rows={3}
                                            placeholder="Obra maestra del realismo magico..."
                                            className="resize-none rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-amber-700"
                                        />
                                    </div>

                                    {error && (
                                        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>
                                    )}

                                    <div className="mt-2 flex gap-3">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50 transition-all active:scale-[0.98] hover:bg-stone-800 disabled:opacity-60"
                                        >
                                            {saving ? (
                                                <>
                                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-stone-50/40 border-t-stone-50" />
                                                    Guardando
                                                </>
                                            ) : mode === 'create' ? (
                                                'Agregar a la biblioteca'
                                            ) : (
                                                'Guardar cambios'
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleClose}
                                            className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>

                {/* sombra de contacto del libro sobre el fondo */}
                <div
                    aria-hidden="true"
                    className="absolute -bottom-6 left-1/2 h-10 w-[80%] -translate-x-1/2 rounded-full bg-black/40 blur-2xl"
                />
            </div>
        </div>
    );
}
