// Fotografias de referencia (Unsplash, licencia libre) verificadas antes de usarlas.
// Un unico set reutilizado en todo el modulo: hero, tarjetas y el libro grande.

export const HERO_IMAGE = {
    src: 'https://images.unsplash.com/photo-1587397070638-81d3cce10435?q=80&w=2400&auto=format&fit=crop',
    alt: 'Sala de la Long Room, biblioteca del Trinity College, estanterias de madera a dos alturas',
};

export const OPEN_BOOK_IMAGE = {
    src: 'https://images.unsplash.com/photo-1517770413964-df8ca61194a6?q=80&w=1600&auto=format&fit=crop',
    alt: 'Libro abierto en una mesa, con luces calidas de fondo desenfocadas',
};

// Ciclan de forma deterministica por libro (mismo id -> misma imagen siempre).
export const CARD_IMAGES = [
    'https://images.unsplash.com/photo-1533669955142-6a73332af4db?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1670523781755-8185f71c2285?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1524401597352-ec4463663233?q=80&w=800&auto=format&fit=crop',
] as const;

export function cardImageFor(seed: string): string {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return CARD_IMAGES[hash % CARD_IMAGES.length];
}
