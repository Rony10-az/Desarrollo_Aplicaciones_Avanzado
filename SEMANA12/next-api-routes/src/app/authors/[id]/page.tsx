import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { AuthorDetail } from '../../_components/AuthorDetail';
import { AuthorDetailSkeleton } from '../../_components/AuthorDetailSkeleton';
import type { AuthorStats, AuthorWithBooks, Book } from '../../_components/types';

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
    const { id } = await params;
    const author = await fetchAuthor(id);
    return {
        title: author ? `${author.name} — La Biblioteca` : 'Autor — La Biblioteca',
    };
}

export default function AuthorPage({ params }: { params: Params }) {
    return (
        <Suspense fallback={<AuthorDetailSkeleton />}>
            <AuthorPageContent params={params} />
        </Suspense>
    );
}

async function AuthorPageContent({ params }: { params: Params }) {
    // La ficha cambia con cada CRUD que ofrece (editar autor, agregar libro),
    // asi que no tiene sentido pre-renderizarla estaticamente.
    await connection();

    const { id } = await params;

    const [author, stats] = await Promise.all([fetchAuthor(id), fetchStats(id)]);

    if (!author || !stats) {
        notFound();
    }

    // Los libros llegan desde la relacion books del autor (sin el objeto
    // `author` anidado, porque ya estamos dentro de su contexto): se
    // completa aqui para que calcen con el tipo Book que usan las tarjetas
    // y el modal del libro grande.
    const books: Book[] = author.books.map((book) => ({
        ...book,
        author: { id: author.id, name: author.name, nationality: author.nationality, photoUrl: author.photoUrl },
    }));

    return <AuthorDetail author={author} books={books} stats={stats} />;
}

async function getBaseUrl() {
    const h = await headers();
    const host = h.get('host');
    const protocol = host?.startsWith('localhost') || host?.startsWith('127.0.0.1') ? 'http' : 'https';
    return `${protocol}://${host}`;
}

async function fetchAuthor(id: string): Promise<AuthorWithBooks | null> {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/authors/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}

async function fetchStats(id: string): Promise<AuthorStats | null> {
    const baseUrl = await getBaseUrl();
    const res = await fetch(`${baseUrl}/api/authors/${id}/stats`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
}
