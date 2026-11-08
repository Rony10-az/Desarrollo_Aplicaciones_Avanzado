export type AuthorOption = {
    id: string;
    name: string;
};

export type AuthorBookSummary = {
    id: string;
    title: string;
    publishedYear: number | null;
};

export type AuthorBase = {
    id: string;
    name: string;
    email: string;
    bio: string | null;
    nationality: string | null;
    birthYear: number | null;
    photoUrl: string | null;
    createdAt: string | Date;
    updatedAt: string | Date;
};

export type Author = AuthorBase & {
    books: { items: AuthorBookSummary[]; count: number };
};

export type AuthorFormValues = {
    name: string;
    email: string;
    bio: string;
    nationality: string;
    birthYear: string;
    photoUrl: string;
};

export const emptyAuthorForm: AuthorFormValues = {
    name: '',
    email: '',
    bio: '',
    nationality: '',
    birthYear: '',
    photoUrl: '',
};

// Forma que devuelve GET /api/authors/[id]: el autor con sus libros
// completos (sin el objeto `author` anidado en cada uno, porque ya estamos
// en su contexto) -- distinta de `Author.books` (que es {items, count}).
export type AuthorWithBooks = AuthorBase & {
    books: Omit<Book, 'author'>[];
};

export type AuthorStats = {
    authorId: string;
    authorName: string;
    totalBooks: number;
    firstBook: { title: string; year: number | null } | null;
    latestBook: { title: string; year: number | null } | null;
    averagePages: number | null;
    genres: string[];
    longestBook: { title: string; pages: number | null } | null;
    shortestBook: { title: string; pages: number | null } | null;
};

export type BookAuthor = {
    id: string;
    name: string;
    nationality: string | null;
    photoUrl: string | null;
};

export type Book = {
    id: string;
    title: string;
    description: string | null;
    isbn: string | null;
    publishedYear: number | null;
    pages: number | null;
    genre: string | null;
    authorId: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    author: BookAuthor;
};

export type Pagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
};

export type SearchResponse = {
    data: Book[];
    pagination: Pagination;
};

export type BookFormValues = {
    title: string;
    description: string;
    isbn: string;
    publishedYear: string;
    genre: string;
    pages: string;
    authorId: string;
};

export const emptyBookForm: BookFormValues = {
    title: '',
    description: '',
    isbn: '',
    publishedYear: '',
    genre: '',
    pages: '',
    authorId: '',
};
