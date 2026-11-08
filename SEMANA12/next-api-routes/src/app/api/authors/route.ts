import { NextResponse } from 'next/server';
import { db } from '@/prisma/db';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET - obtener todos los autores
export async function GET() {
    try {
        const authors = await db.orm.public.Author
            .include('books', (books) =>
                books.combine({
                    items: books.select('id', 'title', 'publishedYear'),
                    count: books.count(),
                }),
            )
            .orderBy((a) => a.name.asc())
            .all();

        return NextResponse.json(authors);
    } catch (error) {
        console.error('Error al obtener los autores:', error);
        return NextResponse.json({ error: 'Error al obtener los autores' }, { status: 500 });
    }
}

// POST - Crear un nuevo autor
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, bio, nationality, birthYear, photoUrl } = body;

        // validacion basica
        if (!name || !email) {
            return NextResponse.json({ error: 'El nombre y el correo electrónico son obligatorios' }, { status: 400 });
        }

        // validar formato de email
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: 'El correo electrónico no tiene un formato válido' }, { status: 400 });
        }

        const author = await db.orm.public.Author.create({
            name,
            email,
            bio: bio ?? null,
            nationality: nationality ?? null,
            birthYear: birthYear ? parseInt(birthYear, 10) : null,
            photoUrl: photoUrl?.trim() || null,
        });

        return NextResponse.json(author, { status: 201 });
    } catch (error: any) {
        if (error?.sqlState === '23505') {
            return NextResponse.json({ error: 'El correo electrónico ya está en uso' }, { status: 409 });
        }
        console.error('Error al crear el autor:', error);
        return NextResponse.json({ error: 'Error al crear el autor' }, { status: 500 });
    }
}
