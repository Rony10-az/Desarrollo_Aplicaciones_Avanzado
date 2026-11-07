import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';

// GET - estadisticas completas de un autor
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const author = await db.orm.public.Author.where({ id }).first();
    if (!author) {
        return NextResponse.json({ error: 'Autor no encontrado' }, { status: 404 });
    }

    const books = await db.orm.public.Book
        .where({ authorId: id })
        .select('title', 'publishedYear', 'pages', 'genre')
        .all();

    if (books.length === 0) {
        return NextResponse.json({
            authorId: id,
            authorName: author.name,
            totalBooks: 0,
            firstBook: null,
            latestBook: null,
            averagePages: null,
            genres: [],
            longestBook: null,
            shortestBook: null,
        });
    }

    const withYear = books.filter((b) => b.publishedYear != null);
    const byYearAsc = [...withYear].sort((a, b) => a.publishedYear! - b.publishedYear!);
    const firstBook = byYearAsc.length
        ? { title: byYearAsc[0]!.title, year: byYearAsc[0]!.publishedYear }
        : null;
    const latestBook = byYearAsc.length
        ? { title: byYearAsc[byYearAsc.length - 1]!.title, year: byYearAsc[byYearAsc.length - 1]!.publishedYear }
        : null;

    const withPages = books.filter((b) => b.pages != null);
    const averagePages = withPages.length
        ? Math.round(withPages.reduce((sum, b) => sum + b.pages!, 0) / withPages.length)
        : null;

    const genres = [...new Set(books.map((b) => b.genre).filter((g): g is string => g != null))];

    const byPagesDesc = [...withPages].sort((a, b) => b.pages! - a.pages!);
    const longestBook = byPagesDesc.length
        ? { title: byPagesDesc[0]!.title, pages: byPagesDesc[0]!.pages }
        : null;
    const shortestBook = byPagesDesc.length
        ? { title: byPagesDesc[byPagesDesc.length - 1]!.title, pages: byPagesDesc[byPagesDesc.length - 1]!.pages }
        : null;

    return NextResponse.json({
        authorId: id,
        authorName: author.name,
        totalBooks: books.length,
        firstBook,
        latestBook,
        averagePages,
        genres,
        longestBook,
        shortestBook,
    });
}
