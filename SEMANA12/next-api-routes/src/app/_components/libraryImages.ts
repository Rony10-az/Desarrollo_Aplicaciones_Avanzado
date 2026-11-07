// Fotografias de referencia (Unsplash, licencia libre), descargadas a
// public/images/ y servidas localmente -- images.unsplash.com tiende a
// cortarse ("upstream image response timed out") en esta red, y para este
// puñado de fotos fijas no tiene sentido depender de un fetch externo en
// cada carga. Verificadas antes de descargarlas.

export const HERO_IMAGE = {
    src: '/images/hero-library.jpg',
    alt: 'Sala de la Long Room, biblioteca del Trinity College, estanterias de madera a dos alturas',
};

export const OPEN_BOOK_IMAGE = {
    src: '/images/open-book.jpg',
    alt: 'Libro abierto en una mesa, con luces calidas de fondo desenfocadas',
};

// Ciclan de forma deterministica por libro (mismo id -> misma imagen siempre).
export const CARD_IMAGES = [
    '/images/card-1.jpg',
    '/images/card-2.jpg',
    '/images/card-3.jpg',
    '/images/card-4.jpg',
] as const;

export function cardImageFor(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return CARD_IMAGES[hash % CARD_IMAGES.length];
}

// Portada real del libro (Open Library Covers API, publica y sin API key).
// ?default=false hace que devuelva 404 en vez de un placeholder cuando no hay
// portada para ese ISBN -- asi el <Image onError> puede caer al diseno de lomo.
export function openLibraryCoverUrl(isbn: string): string {
    const clean = isbn.replace(/[^0-9Xx]/g, '');
    return `https://covers.openlibrary.org/b/isbn/${clean}-L.jpg?default=false`;
}
