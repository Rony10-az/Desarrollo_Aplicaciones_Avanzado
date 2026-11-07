import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';

// GET - obtener un libro por id (con su autor)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const book = await db.orm.public.Book
        .where({ id })
        .include('author', (author) => author.select('id', 'name', 'email'))
        .first();

    if (!book) {
        return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 });
    }

    return NextResponse.json(book);
}

// PUT - actualizar un libro
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        const existing = await db.orm.public.Book.where({ id }).first();
        if (!existing) {
            return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 });
        }

        const body = await request.json();
        const { title, description, isbn, publishedYear, genre, pages, authorId } = body;

        if (authorId !== undefined) {
            const author = await db.orm.public.Author.where({ id: authorId }).first();
            if (!author) {
                return NextResponse.json({ error: 'El autor indicado no existe' }, { status: 404 });
            }
        }

        const book = await db.orm.public.Book
            .where({ id })
            .update({
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(isbn !== undefined && { isbn }),
                ...(publishedYear !== undefined && { publishedYear: publishedYear ? parseInt(publishedYear, 10) : null }),
                ...(genre !== undefined && { genre }),
                ...(pages !== undefined && { pages: pages ? parseInt(pages, 10) : null }),
                ...(authorId !== undefined && { authorId }),
            });

        return NextResponse.json(book);
    } catch (error: any) {
        if (error?.sqlState === '23505') {
            return NextResponse.json({ error: 'El ISBN ya está en uso' }, { status: 409 });
        }
        console.error('Error al actualizar el libro:', error);
        return NextResponse.json({ error: 'Error al actualizar el libro' }, { status: 500 });
    }
}

// DELETE - eliminar un libro
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const existing = await db.orm.public.Book.where({ id }).first();
    if (!existing) {
        return NextResponse.json({ error: 'Libro no encontrado' }, { status: 404 });
    }

    await db.orm.public.Book.where({ id }).delete();

    return NextResponse.json({ message: 'Libro eliminado correctamente' });
}
