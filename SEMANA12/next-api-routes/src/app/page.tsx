import type { Metadata } from 'next';
import { Suspense } from 'react';
import { connection } from 'next/server';
import { db } from '@/prisma/db';
import { AuthorsBoard } from './_components/AuthorsBoard';
import { DashboardSkeleton } from './_components/DashboardSkeleton';
import type { Author } from './_components/types';

export const metadata: Metadata = {
    title: 'Panel — La Biblioteca',
    description: 'Crea, edita y elimina autores; mira las estadisticas generales del catalogo.',
};

export default function HomePage() {
    return (
        <Suspense fallback={<DashboardSkeleton />}>
            <Dashboard />
        </Suspense>
    );
}

async function Dashboard() {
    // El panel cambia con cada CRUD que ofrece, asi que no tiene sentido
    // pre-renderizarlo estaticamente: siempre se calcula por request.
    await connection();

    const [authors, authorCount, bookCount, { totalPages }, genreRows] = await Promise.all([
        db.orm.public.Author
            .include('books', (books) =>
                books.combine({
                    items: books.select('id', 'title', 'publishedYear'),
                    count: books.count(),
                }),
            )
            .orderBy((a) => a.name.asc())
            .all(),
        db.orm.public.Author.aggregate((aggregate) => ({ total: aggregate.count() })),
        db.orm.public.Book.aggregate((aggregate) => ({ total: aggregate.count() })),
        db.orm.public.Book.aggregate((aggregate) => ({ totalPages: aggregate.sum('pages') })),
        db.orm.public.Book.select('genre').all(),
    ]);

    const totalGenres = new Set(genreRows.map((row) => row.genre).filter(Boolean)).size;

    return (
        <AuthorsBoard
            initialAuthors={authors as unknown as Author[]}
            stats={{
                totalAuthors: authorCount.total,
                totalBooks: bookCount.total,
                totalPages: totalPages ?? 0,
                totalGenres,
            }}
        />
    );
}
