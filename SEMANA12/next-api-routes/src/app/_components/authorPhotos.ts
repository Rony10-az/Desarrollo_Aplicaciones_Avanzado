// Fotos reales de autores (Wikipedia/Wikimedia Commons, dominio publico o
// licencia libre), descargadas a public/images/authors/ y verificadas antes
// de usarlas. Como el nombre de un autor futuro no tiene una foto predecible
// (a diferencia del ISBN de un libro), este es un mapa fijo en vez de una
// funcion derivada: un autor que no esta aqui simplemente usa el monograma
// de color como respaldo.
const AUTHOR_PHOTOS: Record<string, string> = {
    'carlos ruiz zafon': '/images/authors/ruiz-zafon.jpg',
    'carlos ruiz zafón': '/images/authors/ruiz-zafon.jpg',
    'gabriel garcia marquez': '/images/authors/garcia-marquez.jpg',
    'gabriel garcía márquez': '/images/authors/garcia-marquez.jpg',
    'isabel allende': '/images/authors/allende.jpg',
    'jorge luis borges': '/images/authors/borges.jpg',
    'juan rulfo': '/images/authors/rulfo.jpg',
    'julio cortazar': '/images/authors/cortazar.jpg',
    'julio cortázar': '/images/authors/cortazar.jpg',
    'miguel de cervantes': '/images/authors/cervantes.jpg',
};

export function authorPhotoFor(name: string): string | null {
    return AUTHOR_PHOTOS[name.trim().toLowerCase()] ?? null;
}
