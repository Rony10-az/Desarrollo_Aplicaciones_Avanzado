export type AuthorOption = {
    id: string;
    name: string;
};

export type BookAuthor = {
    id: string;
    name: string;
    nationality: string | null;
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
