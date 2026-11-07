import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/prisma/db';

// GET - obtener todos los libros, con filtro opcional por genero exacto
export async function GET(request: NextRequest) {
    const genre = request.nextUrl.searchParams.get('genre');

    let query = db.orm.public.Book.include('author', (author) =>
        author.select('id', 'name', 'email'),
    );

    if (genre) {
        query = query.where({ genre });
    }

    const books = await query.orderBy((b) => b.createdAt.desc()).all();

    return NextResponse.json(books);
}

// POST - crear un nuevo libro
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, isbn, publishedYear, genre, pages, authorId } = body;

        if (!title || !authorId) {
            return NextResponse.json({ error: 'title y authorId son obligatorios' }, { status: 400 });
        }

        const author = await db.orm.public.Author.where({ id: authorId }).first();
        if (!author) {
            return NextResponse.json({ error: 'El autor indicado no existe' }, { status: 404 });
        }

        const book = await db.orm.public.Book.create({
            title,
            description: description ?? null,
            isbn: isbn ?? null,
            publishedYear: publishedYear ? parseInt(publishedYear, 10) : null,
            genre: genre ?? null,
            pages: pages ? parseInt(pages, 10) : null,
            authorId,
        });

        return NextResponse.json(book, { status: 201 });
    } catch (error: any) {
        if (error?.sqlState === '23505') {
            return NextResponse.json({ error: 'El ISBN ya está en uso' }, { status: 409 });
        }
        console.error('Error al crear el libro:', error);
        return NextResponse.json({ error: 'Error al crear el libro' }, { status: 500 });
    }
}
