'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { spineColorFor } from './spineColor';
import { authorPhotoFor } from './authorPhotos';
import { StatTile } from './StatTile';
import { AuthorModal } from './AuthorModal';
import { BookModal } from './BookModal';
import { BookSpineCard } from './BookSpineCard';
import { EmptyShelf } from './GridStates';
import { EditIcon, PlusIcon, ChevronIcon } from './icons';
import type { AuthorFormValues, AuthorStats, AuthorWithBooks, Book, BookFormValues } from './types';

type BookModalState =
    | { mode: 'view' | 'edit'; book: Book; origin: { x: number; y: number } }
    | { mode: 'create'; book: null; origin: { x: number; y: number } }
    | null;

export function AuthorDetail({ author: initialAuthor, books: initialBooks, stats: initialStats }: {
    author: AuthorWithBooks;
    books: Book[];
    stats: AuthorStats;
}) {
    const router = useRouter();
    const [author, setAuthor] = useState(initialAuthor);
    const [books, setBooks] = useState(initialBooks);
    const [stats, setStats] = useState(initialStats);
    const [editingAuthor, setEditingAuthor] = useState(false);
    const [bookModal, setBookModal] = useState<BookModalState>(null);

    const [photoFailed, setPhotoFailed] = useState(false);
    const spine = spineColorFor(author.name + author.id);
    const initial = author.name.trim()[0]?.toUpperCase() ?? 'A';
    const photo = authorPhotoFor(author.name);
    const showPhoto = Boolean(photo) && !photoFailed;
    const authorOptions = [{ id: author.id, name: author.name }];

    async function refreshStatsAndBooks() {
        const [booksRes, statsRes] = await Promise.all([
            fetch(`/api/authors/${author.id}/books`),
            fetch(`/api/authors/${author.id}/stats`),
        ]);
        if (booksRes.ok) {
            const rawBooks: Omit<Book, 'author'>[] = await booksRes.json();
            setBooks(rawBooks.map((book) => ({ ...book, author: { id: author.id, name: author.name, nationality: author.nationality } })));
        }
        if (statsRes.ok) setStats(await statsRes.json());
    }

    async function handleAuthorSubmit(values: AuthorFormValues): Promise<{ error?: string } | void> {
        const payload = {
            name: values.name.trim(),
            email: values.email.trim(),
            bio: values.bio.trim() || undefined,
            nationality: values.nationality.trim() || undefined,
            birthYear: values.birthYear ? Number(values.birthYear) : undefined,
        };

        const response = await fetch(`/api/authors/${author.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            return { error: body.error ?? 'Algo salio mal. Intenta de nuevo.' };
        }

        const updated = await response.json();
        setAuthor((prev) => ({ ...prev, ...updated }));
        setBooks((prev) => prev.map((b) => ({ ...b, author: { id: updated.id, name: updated.name, nationality: updated.nationality } })));
        setEditingAuthor(false);
        router.refresh();
    }

    async function handleBookSubmit(values: BookFormValues): Promise<{ error?: string } | void> {
        const payload = {
            title: values.title.trim(),
            description: values.description.trim() || undefined,
            isbn: values.isbn.trim() || undefined,
            genre: values.genre.trim() || undefined,
            publishedYear: values.publishedYear ? Number(values.publishedYear) : undefined,
            pages: values.pages ? Number(values.pages) : undefined,
            authorId: values.authorId || author.id,
        };

        const isEdit = bookModal?.mode === 'edit' && bookModal.book;
        const url = isEdit ? `/api/books/${bookModal.book!.id}` : '/api/books';
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

        setBookModal(null);
        refreshStatsAndBooks();
    }

    async function handleBookDelete(book: Book) {
        const confirmed = window.confirm(`Eliminar "${book.title}" de la biblioteca?`);
        if (!confirmed) return;

        const response = await fetch(`/api/books/${book.id}`, { method: 'DELETE' });
        if (response.ok) {
            setBookModal(null);
            refreshStatsAndBooks();
        }
    }

    return (
        <div className="flex flex-1 flex-col bg-stone-50">
            <Link
                href="/"
                className="mx-auto mt-6 flex w-full max-w-[1400px] items-center gap-1.5 px-6 text-sm text-stone-500 transition-colors hover:text-stone-800 sm:px-10 lg:px-16"
            >
                <ChevronIcon className="h-3.5 w-3.5 rotate-180" />
                Volver al panel
            </Link>

            <section className="mx-auto w-full max-w-[1400px] px-6 py-8 sm:px-10 lg:px-16">
                <div className="grid grid-cols-1 gap-8 overflow-hidden rounded-[1.75rem] border border-stone-200/70 bg-white shadow-[0_18px_40px_-28px_rgba(28,25,23,0.35)] md:grid-cols-[0.4fr_0.6fr]">
                    <div
                        className="relative flex min-h-[260px] flex-col justify-end gap-3 p-9 sm:p-12"
                        style={{ backgroundColor: spine.bg, color: spine.fg }}
                    >
                        {showPhoto ? (
                            <>
                                <Image
                                    src={photo!}
                                    alt=""
                                    fill
                                    sizes="(min-width: 768px) 40vw, 100vw"
                                    className="object-cover object-top"
                                    onError={() => setPhotoFailed(true)}
                                />
                                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                            </>
                        ) : (
                            <div
                                aria-hidden="true"
                                className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
                                style={{
                                    backgroundImage:
                                        'repeating-linear-gradient(115deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 6px)',
                                }}
                            />
                        )}
                        {!showPhoto && <span className="relative font-serif text-6xl">{initial}</span>}
                        <p className={`relative mt-2 text-xs uppercase tracking-[0.2em] ${showPhoto ? 'text-white/70' : 'opacity-60'}`}>Autor</p>
                    </div>

                    <div className="flex flex-col justify-center gap-4 p-9 sm:p-12">
                        <div>
                            <h1 className="font-serif text-3xl leading-[1.1] tracking-tight text-stone-900 sm:text-4xl [text-wrap:balance]">
                                {author.name}
                            </h1>
                            <p className="mt-2 text-sm text-stone-500">
                                {author.nationality ?? 'Nacionalidad sin registrar'}
                                {author.birthYear ? ` · n. ${author.birthYear}` : ''}
                            </p>
                            <p className="mt-0.5 text-sm text-stone-400">{author.email}</p>
                        </div>

                        <p className="max-w-[60ch] text-[15px] leading-relaxed text-stone-600">
                            {author.bio || 'Este autor todavia no tiene una biografia registrada.'}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-3">
                            <button
                                type="button"
                                onClick={() => setEditingAuthor(true)}
                                className="inline-flex items-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50 transition-transform active:scale-[0.98] hover:bg-stone-800"
                            >
                                <EditIcon className="h-4 w-4" />
                                Editar autor
                            </button>
                            <button
                                type="button"
                                onClick={(event) =>
                                    setBookModal({
                                        mode: 'create',
                                        book: null,
                                        origin: { x: event.clientX, y: event.clientY },
                                    })
                                }
                                className="inline-flex items-center gap-2 rounded-full border border-stone-300 px-5 py-2.5 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
                            >
                                <PlusIcon className="h-4 w-4" />
                                Agregar libro
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto w-full max-w-[1400px] px-6 pb-6 sm:px-10 lg:px-16">
                <div className="grid grid-cols-2 gap-6 border-t border-stone-200 pt-6 sm:grid-cols-4">
                    <StatTile label="Libros" value={stats.totalBooks} />
                    <StatTile
                        label="Promedio de paginas"
                        value={stats.averagePages ?? '—'}
                    />
                    <StatTile
                        label="Primer libro"
                        value={stats.firstBook?.year ?? '—'}
                        hint={stats.firstBook?.title}
                    />
                    <StatTile
                        label="Ultimo libro"
                        value={stats.latestBook?.year ?? '—'}
                        hint={stats.latestBook?.title}
                    />
                </div>
                {stats.genres.length > 0 && (
                    <div className="mt-6 flex flex-wrap items-center gap-2">
                        <span className="text-xs uppercase tracking-[0.14em] text-stone-400">Generos</span>
                        {stats.genres.map((genre) => (
                            <span key={genre} className="rounded-full bg-amber-800/10 px-3 py-1 text-xs font-medium text-amber-900">
                                {genre}
                            </span>
                        ))}
                    </div>
                )}
            </section>

            <main className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-6 sm:px-10 lg:px-16">
                <h2 className="font-serif text-2xl tracking-tight text-stone-900">Su coleccion</h2>
                {books.length === 0 ? (
                    <EmptyShelf
                        hasFilters={false}
                        onReset={() => {}}
                    />
                ) : (
                    <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {books.map((book, index) => (
                            <BookSpineCard
                                key={book.id}
                                book={book}
                                index={index}
                                onOpen={(b, origin) => setBookModal({ mode: 'view', book: b, origin })}
                                onEdit={(b, origin) => setBookModal({ mode: 'edit', book: b, origin })}
                                onDelete={handleBookDelete}
                            />
                        ))}
                    </div>
                )}
            </main>

            {editingAuthor && (
                <AuthorModal mode="edit" author={author} onClose={() => setEditingAuthor(false)} onSubmit={handleAuthorSubmit} />
            )}

            {bookModal && (
                <BookModal
                    key={`${bookModal.mode}-${bookModal.book?.id ?? 'new'}`}
                    mode={bookModal.mode}
                    book={bookModal.book}
                    origin={bookModal.origin}
                    authors={authorOptions}
                    onClose={() => setBookModal(null)}
                    onEditRequested={() => bookModal.book && setBookModal({ mode: 'edit', book: bookModal.book, origin: bookModal.origin })}
                    onDelete={handleBookDelete}
                    onSubmit={handleBookSubmit}
                />
            )}
        </div>
    );
}
