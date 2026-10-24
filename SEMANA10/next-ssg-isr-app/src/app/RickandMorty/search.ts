import { CharacterFilters, CharacterListResponse } from '@/types/rickandmorty';

const API = 'https://rickandmortyapi.com/api/character';

// Archivo aparte de api.ts: lo importa un Client Component (CSR)
// Búsqueda en el cliente (CSR) por name, status, type y gender
export async function searchCharacters(
    filters: CharacterFilters,
    page = 1,
    signal?: AbortSignal
): Promise<CharacterListResponse> {
    const params = new URLSearchParams({ page: String(page) });
    (Object.keys(filters) as (keyof CharacterFilters)[]).forEach((key) => {
        const value = filters[key].trim();
        if (value) params.set(key, value);
    });

    const res = await fetch(`${API}?${params}`, { signal });

    // La API responde 404 cuando no hay coincidencias
    if (res.status === 404) {
        return {
            info: { count: 0, pages: 0, next: null, prev: null },
            results: [],
        };
    }
    if (!res.ok) throw new Error('Error en la búsqueda');
    return res.json();
}
