import { cacheLife } from 'next/cache';
import {
    Character,
    CharacterListResponse,
} from '@/types/rickandmorty';

const API = 'https://rickandmortyapi.com/api/character';

const TEN_DAYS = 60 * 60 * 24 * 10; // 864000 s

// Variantes del multiverso que se muestran en su propio carrusel en la lista
const VARIANT_NAMES = ['Evil Morty', 'Rick Prime', 'Doofus Rick', 'Tiny Rick'];

// La API responde 429 si se hacen muchas peticiones seguidas (pasa en el build).
// Se reintenta con una espera creciente antes de rendirse.
async function fetchWithRetry(url: string, init?: RequestInit): Promise<Response> {
    for (let attempt = 1; ; attempt++) {
        const res = await fetch(url, init);
        if (res.status !== 429 || attempt === 5) return res;

        const wait = Number(res.headers.get('retry-after')) * 1000 || attempt * 3000;
        await new Promise((resolve) => setTimeout(resolve, wait));
    }
}

// Lista de la página principal: respuesta cacheada de forma forzada (SSG)
export async function getCharacters(page = 1): Promise<CharacterListResponse> {
    const res = await fetchWithRetry(`${API}?page=${page}`, { cache: 'force-cache' });

    if (!res.ok) throw new Error(`Error al cargar los personajes (${res.status})`);
    return res.json();
}

/*
 * Todos los personajes en UNA sola petición (/character/1,2,3,...).
 * Evita hacer ~830 peticiones durante el build, que la API bloquea con 429.
 * Se regenera cada 10 días (ISR).
 */
async function getAllCharacters(): Promise<Character[]> {
    'use cache';
    cacheLife({ stale: 3600, revalidate: TEN_DAYS, expire: TEN_DAYS * 2 });

    const first = await getCharacters(1);
    const ids = Array.from({ length: first.info.count }, (_, i) => i + 1);

    const res = await fetchWithRetry(`${API}/${ids.join(',')}`);
    if (!res.ok) throw new Error(`Error al cargar los personajes (${res.status})`);
    return res.json();
}

// Personajes "variantes" reales de la API (hay varios Rick/Morty catalogados
// por separado): se busca cada nombre y se toma la coincidencia exacta.
export async function getVariantCharacters(): Promise<Character[]> {
    'use cache';
    cacheLife({ stale: 3600, revalidate: TEN_DAYS, expire: TEN_DAYS * 2 });

    const found = await Promise.all(
        VARIANT_NAMES.map(async (name) => {
            const res = await fetchWithRetry(`${API}?name=${encodeURIComponent(name)}`);
            if (!res.ok) return null;
            const data: CharacterListResponse = await res.json();
            const exact = data.results.find((c) => c.name.toLowerCase() === name.toLowerCase());
            return exact ?? data.results[0] ?? null;
        })
    );

    return found.filter((c): c is Character => c !== null);
}

// Ids de todos los personajes para generateStaticParams
export async function getAllCharacterIds(): Promise<string[]> {
    const characters = await getAllCharacters();
    return characters.map((c) => String(c.id));
}

// Detalle: se regenera cada 10 días (ISR). Devuelve null si el id no existe.
// Con cacheComponents el cache se define con 'use cache' + cacheLife.
export async function getCharacter(id: string): Promise<Character | null> {
    'use cache';
    cacheLife({ stale: 3600, revalidate: TEN_DAYS, expire: TEN_DAYS * 2 });

    const characters = await getAllCharacters();
    const found = characters.find((c) => String(c.id) === id);
    if (found) return found;

    // Personaje nuevo que aún no está en la lista cacheada
    const res = await fetchWithRetry(`${API}/${id}`);
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Error al cargar el personaje (${res.status})`);
    return res.json();
}
