'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Hero } from './Hero';
import { SectionDivider } from './SectionDivider';
import { Toolbar, type SortValue } from './Toolbar';
import { BookSpineCard } from './BookSpineCard';
import { BookModal } from './BookModal';
import { Pagination } from './Pagination';
import { BookGridSkeleton, EmptyShelf, GridError } from './GridStates';
import type { AuthorOption, Book, BookFormValues, Pagination as PaginationType } from './types';

type ModalState =
    | { mode: 'view' | 'edit'; book: Book; origin: { x: number; y: number } }
    | { mode: 'create'; book: null; origin: { x: number; y: number } }
    | null;

type Props = {
    initialBooks: Book[];
    initialPagination: PaginationType;
    initialGenres: string[];
    initialAuthors: AuthorOption[];
    catalogSize: number;
};

export function LibraryExplorer({ initialBooks, initialPagination, initialGenres, initialAuthors, catalogSize }: Props) {
    const [query, setQuery] = useState('');
    const [genre, setGenre] = useState('');
    const [authorName, setAuthorName] = useState('');
    const [sort, setSort] = useState<SortValue>('createdAt-desc');
    const [page, setPage] = useState(1);

    const [books, setBooks] = useState<Book[]>(initialBooks);
    const [pagination, setPagination] = useState<PaginationType | null>(initialPagination);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [genres, setGenres] = useState<string[]>(initialGenres);
    const [authors, setAuthors] = useState<AuthorOption[]>(initialAuthors);
    const [catalog, setCatalog] = useState(catalogSize);

    const [modal, setModal] = useState<ModalState>(null);
    const resultsTopRef = useRef<HTMLDivElement | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const requestIdRef = useRef(0);

    async function performSearch(next: { query: string; genre: string; authorName: string; sort: SortValue; page: number }) {
        const requestId = ++requestIdRef.current;
        setLoading(true);
        setError(null);

        const [sortBy, order] = next.sort.split('-') as [string, string];
        const params = new URLSearchParams();
        if (next.query.trim()) params.set('search', next.query.trim());
        if (next.genre) params.set('genre', next.genre);
        if (next.authorName) params.set('authorName', next.authorName);
        params.set('page', String(next.page));
        params.set('limit', '10');
        params.set('sortBy', sortBy);
        params.set('order', order);

        try {
            const response = await fetch(`/api/books/search?${params.toString()}`);
            if (!response.ok) throw new Error('No se pudo cargar el catalogo.');
            const json = await response.json();
            if (requestId !== requestIdRef.current) return;
            setBooks(json.data);
            setPagination(json.pagination);
        } catch {
            if (requestId !== requestIdRef.current) return;
            setError('No se pudo conectar con la biblioteca. Intenta de nuevo.');
        } finally {
            if (requestId === requestIdRef.current) setLoading(false);
        }
    }

    async function refreshCatalogMeta() {
        try {
            const [booksRes, authorsRes] = await Promise.all([fetch('/api/books'), fetch('/api/authors')]);
            if (!booksRes.ok || !authorsRes.ok) return;
            const allBooks: Book[] = await booksRes.json();
            const allAuthors: { id: string; name: string }[] = await authorsRes.json();

            const uniqueGenres = [...new Set(allBooks.map((b) => b.genre).filter((g): g is string => Boolean(g)))].sort();
            setGenres(uniqueGenres);
            setAuthors(allAuthors.map((a) => ({ id: a.id, name: a.name })));
            setCatalog(allBooks.length);
        } catch {
            // los filtros se quedan como estaban si esto falla.
        }
    }

    function handleQueryChange(value: string) {
        setQuery(value);
        setPage(1);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            performSearch({ query: value, genre, authorName, sort, page: 1 });
        }, 320);
    }

    useEffect(() => {
        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, []);

    function handleGenreChange(value: string) {
        setGenre(value);
        setPage(1);
        performSearch({ query, genre: value, authorName, sort, page: 1 });
    }

    function handleAuthorChange(value: string) {
        setAuthorName(value);
        setPage(1);
        performSearch({ query, genre, authorName: value, sort, page: 1 });
    }

    function handleSortChange(value: SortValue) {
        setSort(value);
        setPage(1);
        performSearch({ query, genre, authorName, sort: value, page: 1 });
    }

    function handlePageChange(nextPage: number) {
        setPage(nextPage);
        performSearch({ query, genre, authorName, sort, page: nextPage });
        resultsTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function handleRetry() {
        performSearch({ query, genre, authorName, sort, page });
    }

    function handleResetFilters() {
        setQuery('');
        setGenre('');
        setAuthorName('');
        setPage(1);
        performSearch({ query: '', genre: '', authorName: '', sort, page: 1 });
    }

    function openView(book: Book, origin: { x: number; y: number }) {
        setModal({ mode: 'view', book, origin });
    }

    function openEdit(book: Book, origin: { x: number; y: number }) {
        setModal({ mode: 'edit', book, origin });
    }

    function openCreate(origin: { x: number; y: number }) {
        setModal({ mode: 'create', book: null, origin });
    }

    async function handleDelete(book: Book) {
        const confirmed = window.confirm(`Eliminar "${book.title}" de la biblioteca?`);
        if (!confirmed) return;

        const response = await fetch(`/api/books/${book.id}`, { method: 'DELETE' });
        if (response.ok) {
            setModal(null);
            performSearch({ query, genre, authorName, sort, page });
            refreshCatalogMeta();
        }
    }

    async function handleSubmit(values: BookFormValues): Promise<{ error?: string } | void> {
        const payload = {
            title: values.title.trim(),
            description: values.description.trim() || undefined,
            isbn: values.isbn.trim() || undefined,
            genre: values.genre.trim() || undefined,
            publishedYear: values.publishedYear ? Number(values.publishedYear) : undefined,
            pages: values.pages ? Number(values.pages) : undefined,
            authorId: values.authorId,
        };

        const isEdit = modal?.mode === 'edit' && modal.book;
        const url = isEdit ? `/api/books/${modal.book!.id}` : '/api/books';
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
        performSearch({ query, genre, authorName, sort, page });
        refreshCatalogMeta();
    }

    const hasFilters = Boolean(query.trim() || genre || authorName);

    const resultsLabel = useMemo(() => {
        if (!pagination) return '';
        if (pagination.total === 0) return '0 resultados';
        const from = (pagination.page - 1) * pagination.limit + 1;
        const to = Math.min(pagination.page * pagination.limit, pagination.total);
        return `${from}–${to} de ${pagination.total} resultado${pagination.total === 1 ? '' : 's'}`;
    }, [pagination]);

    return (
        <div className="flex flex-1 flex-col bg-stone-50">
            <Hero query={query} onQueryChange={handleQueryChange} totalBooks={catalog} />

            <SectionDivider label="Explorar el catalogo" />

            <Toolbar
                genres={genres}
                authors={authors}
                genre={genre}
                authorName={authorName}
                sort={sort}
                onGenreChange={handleGenreChange}
                onAuthorChange={handleAuthorChange}
                onSortChange={handleSortChange}
                onCreate={() => openCreate({ x: window.innerWidth / 2, y: window.innerHeight / 2 })}
            />

            <main ref={resultsTopRef} className="mx-auto w-full max-w-[1400px] flex-1 px-6 py-10 sm:px-10 lg:px-16">
                {!loading && !error && pagination && (
                    <p className="mb-6 text-sm text-stone-500">{resultsLabel}</p>
                )}

                {loading ? (
                    <BookGridSkeleton />
                ) : error ? (
                    <GridError message={error} onRetry={handleRetry} />
                ) : books.length === 0 ? (
                    <EmptyShelf hasFilters={hasFilters} onReset={handleResetFilters} />
                ) : (
                    <>
                        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                            {books.map((book, index) => (
                                <BookSpineCard
                                    key={book.id}
                                    book={book}
                                    index={index}
                                    onOpen={openView}
                                    onEdit={openEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </div>
                        {pagination && <Pagination pagination={pagination} onPageChange={handlePageChange} />}
                    </>
                )}
            </main>

            {modal && (
                <BookModal
                    key={`${modal.mode}-${modal.book?.id ?? 'new'}`}
                    mode={modal.mode}
                    book={modal.book}
                    origin={modal.origin}
                    authors={authors}
                    onClose={() => setModal(null)}
                    onEditRequested={() => modal.book && setModal({ mode: 'edit', book: modal.book, origin: modal.origin })}
                    onDelete={handleDelete}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}
