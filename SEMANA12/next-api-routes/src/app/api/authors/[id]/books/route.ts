import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';

// GET - obtener los libros de un autor especifico
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
        .orderBy((b) => b.publishedYear.asc({ nulls: 'last' }))
        .all();

    return NextResponse.json(books);
}
