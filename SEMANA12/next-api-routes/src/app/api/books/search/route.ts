import { NextRequest, NextResponse } from 'next/server';
import { orderByField } from '@prisma/orm-postgres/orm-client';
import { db } from '@/prisma/db';

const SORTABLE_FIELDS = ['title', 'publishedYear', 'createdAt'] as const;

// GET - busqueda de libros con filtros, orden y paginacion
export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;

    const search = params.get('search');
    const genre = params.get('genre');
    const authorName = params.get('authorName');

    const page = Math.max(1, parseInt(params.get('page') ?? '1', 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(params.get('limit') ?? '10', 10) || 10));
    const offset = (page - 1) * limit;

    const sortByParam = params.get('sortBy') ?? 'createdAt';
    const sortBy = (SORTABLE_FIELDS as readonly string[]).includes(sortByParam) ? sortByParam : 'createdAt';
    const order = params.get('order') === 'asc' ? 'asc' : 'desc';

    let base = db.orm.public.Book;

    if (search) {
        base = base.where((b) => b.title.ilike(`%${search}%`));
    }
    if (genre) {
        base = base.where({ genre });
    }
    if (authorName) {
        const matchingAuthors = await db.orm.public.Author
            .where((a) => a.name.ilike(`%${authorName}%`))
            .select('id')
            .all();
        const authorIds = matchingAuthors.map((a) => a.id);

        if (authorIds.length === 0) {
            return NextResponse.json({
                data: [],
                pagination: { page, limit, total: 0, totalPages: 0, hasNext: false, hasPrev: page > 1 },
            });
        }

        base = base.where((b) => b.authorId.in(authorIds));
    }

    const [data, { total }] = await Promise.all([
        base
            .include('author', (author) => author.select('id', 'name', 'nationality'))
            .orderBy(orderByField(db.orm.public.Book, sortBy, order, SORTABLE_FIELDS))
            .limit(limit)
            .offset(offset)
            .all(),
        base.aggregate((aggregate) => ({ total: aggregate.count() })),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    });
}
