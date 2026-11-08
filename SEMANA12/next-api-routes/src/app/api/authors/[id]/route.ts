import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET - obtener un autor por id (con sus libros)
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const author = await db.orm.public.Author
        .where({ id })
        .include('books', (books) => books.orderBy((b) => b.publishedYear.asc()))
        .first();

    if (!author) {
        return NextResponse.json({ error: 'Autor no encontrado' }, { status: 404 });
    }

    return NextResponse.json(author);
}

// PUT - actualizar un autor
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    try {
        const existing = await db.orm.public.Author.where({ id }).first();
        if (!existing) {
            return NextResponse.json({ error: 'Autor no encontrado' }, { status: 404 });
        }

        const body = await request.json();
        const { name, email, bio, nationality, birthYear, photoUrl } = body;

        if (email !== undefined && !emailRegex.test(email)) {
            return NextResponse.json({ error: 'El correo electrónico no tiene un formato válido' }, { status: 400 });
        }

        const author = await db.orm.public.Author
            .where({ id })
            .update({
                ...(name !== undefined && { name }),
                ...(email !== undefined && { email }),
                ...(bio !== undefined && { bio }),
                ...(nationality !== undefined && { nationality }),
                ...(birthYear !== undefined && { birthYear: birthYear ? parseInt(birthYear, 10) : null }),
                ...(photoUrl !== undefined && { photoUrl: photoUrl?.trim() || null }),
            });

        return NextResponse.json(author);
    } catch (error: any) {
        if (error?.sqlState === '23505') {
            return NextResponse.json({ error: 'El correo electrónico ya está en uso' }, { status: 409 });
        }
        console.error('Error al actualizar el autor:', error);
        return NextResponse.json({ error: 'Error al actualizar el autor' }, { status: 500 });
    }
}

// DELETE - eliminar un autor (elimina en cascada sus libros)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> },
) {
    const { id } = await params;

    const existing = await db.orm.public.Author.where({ id }).first();
    if (!existing) {
        return NextResponse.json({ error: 'Autor no encontrado' }, { status: 404 });
    }

    await db.orm.public.Author.where({ id }).delete();

    return NextResponse.json({ message: 'Autor eliminado correctamente' });
}
