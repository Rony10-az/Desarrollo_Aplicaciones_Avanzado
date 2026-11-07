import { db } from '@/prisma/db';

export async function GET() {
  const authors = await db.orm.public.Author
    .select('id', 'name', 'email', 'bio', 'nationality', 'birthYear', 'createdAt')
    .include('books', (books) => books.select('id', 'title', 'publishedYear'))
    .orderBy((a) => a.createdAt.desc())
    .all();

  return Response.json({ authors });
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, bio, nationality, birthYear } = body;

  if (!name || !email) {
    return Response.json(
      { error: 'name y email son obligatorios' },
      { status: 400 },
    );
  }

  const author = await db.orm.public.Author.create({
    name,
    email,
    bio: bio ?? null,
    nationality: nationality ?? null,
    birthYear: birthYear ?? null,
  });

  return Response.json({ author }, { status: 201 });
}
