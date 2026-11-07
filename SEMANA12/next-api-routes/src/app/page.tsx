import type { Metadata } from 'next';
import { connection } from 'next/server';
import { db } from '@/prisma/db';
import { LibraryExplorer } from './_components/LibraryExplorer';
import type { Book } from './_components/types';

export const metadata: Metadata = {
    title: 'La Biblioteca',
    description: 'Explora, agrega y edita el catalogo de libros y autores.',
};

const PAGE_SIZE = 10;

export default async function HomePage() {
    // El catalogo cambia con cada CRUD que esta misma pagina ofrece, asi que no
    // tiene sentido pre-renderizarlo estaticamente: siempre se calcula por request.
    await connection();

    const [initialBooks, { total }, genreRows, authorRows] = await Promise.all([
        db.orm.public.Book
            .include('author', (author) => author.select('id', 'name', 'nationality'))
            .orderBy((b) => b.createdAt.desc())
            .limit(PAGE_SIZE)
            .offset(0)
            .all(),
        db.orm.public.Book.aggregate((aggregate) => ({ total: aggregate.count() })),
        db.orm.public.Book.select('genre').all(),
        db.orm.public.Author.select('id', 'name').orderBy((a) => a.name.asc()).all(),
    ]);

    const genres = [...new Set(genreRows.map((row) => row.genre).filter((g): g is string => Boolean(g)))].sort();
    const totalPages = Math.ceil(total / PAGE_SIZE) || 0;

    return (
        <LibraryExplorer
            initialBooks={initialBooks as Book[]}
            initialPagination={{
                page: 1,
                limit: PAGE_SIZE,
                total,
                totalPages,
                hasNext: totalPages > 1,
                hasPrev: false,
            }}
            initialGenres={genres}
            initialAuthors={authorRows}
            catalogSize={total}
        />
    );
}
