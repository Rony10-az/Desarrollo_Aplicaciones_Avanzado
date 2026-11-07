import { redirect } from 'next/navigation';

// La experiencia de busqueda de libros vive ahora en la ruta principal ("/").
// Se deja este redirect para no romper enlaces existentes a /books.
export default function BooksPage() {
    redirect('/');
}
