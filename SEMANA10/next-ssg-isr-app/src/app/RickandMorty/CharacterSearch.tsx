'use client'

import { useEffect, useState } from 'react';
import {
    Character,
    CharacterFilters,
    CharacterInfo,
    CharacterListResponse,
} from '@/types/rickandmorty';
import { searchCharacters } from './search';
import CharacterCarousel from './CharacterCarousel';

const emptyFilters: CharacterFilters = { name: '', status: '', type: '', gender: '' };

const inputClass =
    'w-full bg-white/5 text-white placeholder-slate-400 border border-white/15 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 [&>option]:bg-slate-900';

interface View {
    characters: Character[];
    info: CharacterInfo;
    page: number;
}

export default function CharacterSearch({
    initialData,
}: {
    initialData: CharacterListResponse;
}) {
    const [filters, setFilters] = useState<CharacterFilters>(emptyFilters);
    // base: lista inicial del servidor / found: resultado de la búsqueda
    const [base, setBase] = useState<View>({
        characters: initialData.results,
        info: initialData.info,
        page: 1,
    });
    const [found, setFound] = useState<View | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const hasFilters = Object.values(filters).some((v) => v.trim() !== '');
    const view = hasFilters && found ? found : base;
    const { characters, info } = view;

    const updateFilter = (key: keyof CharacterFilters, value: string) => {
        const next = { ...filters, [key]: value };
        setFilters(next);
        if (Object.values(next).every((v) => v.trim() === '')) {
            setFound(null);
            setError(null);
        }
    };

    const clearFilters = () => {
        setFilters(emptyFilters);
        setFound(null);
        setError(null);
    };

    // Búsqueda en tiempo real: espera 400 ms tras la última pulsación
    useEffect(() => {
        if (!hasFilters) return;

        const controller = new AbortController();
        const timeout = setTimeout(async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await searchCharacters(filters, 1, controller.signal);
                setFound({ characters: data.results, info: data.info, page: 1 });
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    setError('No se pudo realizar la búsqueda');
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }, 400);

        return () => {
            clearTimeout(timeout);
            controller.abort();
        };
    }, [filters, hasFilters]);

    const loadMore = async () => {
        const nextPage = view.page + 1;
        setLoading(true);
        try {
            // Sin filtros, searchCharacters pide la lista completa paginada
            const data = await searchCharacters(filters, nextPage);
            const merged: View = {
                characters: [...view.characters, ...data.results],
                info: data.info,
                page: nextPage,
            };
            if (hasFilters) setFound(merged);
            else setBase(merged);
        } catch {
            setError('No se pudieron cargar más personajes');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section id="personajes" className="scroll-mt-20">
            <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-white mb-2">Personajes</h2>
            <p className="text-slate-400 mb-8">
                Busca por nombre, tipo, estado o género. Arrastra el carrusel o deja que avance solo.
            </p>
            <div id="buscar" className="scroll-mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Buscar por nombre..."
                    value={filters.name}
                    onChange={(e) => updateFilter('name', e.target.value)}
                    className={`${inputClass} lg:col-span-2`}
                />
                <input
                    type="text"
                    placeholder="Tipo (ej. Parasite)"
                    value={filters.type}
                    onChange={(e) => updateFilter('type', e.target.value)}
                    className={inputClass}
                />
                <select
                    value={filters.status}
                    onChange={(e) => updateFilter('status', e.target.value)}
                    className={inputClass}
                >
                    <option value="">Todos los estados</option>
                    <option value="alive">Vivo</option>
                    <option value="dead">Muerto</option>
                    <option value="unknown">Desconocido</option>
                </select>
                <select
                    value={filters.gender}
                    onChange={(e) => updateFilter('gender', e.target.value)}
                    className={inputClass}
                >
                    <option value="">Todos los géneros</option>
                    <option value="female">Femenino</option>
                    <option value="male">Masculino</option>
                    <option value="genderless">Sin género</option>
                    <option value="unknown">Desconocido</option>
                </select>
            </div>

            {hasFilters && (
                <div className="flex items-center justify-between mb-6 text-slate-300">
                    <span>{loading ? 'Buscando...' : `${info.count} resultados`}</span>
                    <button
                        onClick={clearFilters}
                        className="text-sm underline hover:text-lime-300 cursor-pointer"
                    >
                        Limpiar filtros
                    </button>
                </div>
            )}

            {error && <p className="text-red-400 mb-6">{error}</p>}

            {!loading && !error && characters.length === 0 && (
                <p className="text-center text-slate-300 py-16 text-lg">
                    No se encontraron personajes con esos filtros.
                </p>
            )}
            </div>

            {/* El carrusel se alimenta del mismo estado que la búsqueda: siempre está sincronizado */}
            <CharacterCarousel
                key={Object.values(filters).join('|')}
                characters={characters}
            />

            {info.next && (
                <div className="text-center mt-10">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition cursor-pointer"
                    >
                        {loading ? 'Cargando...' : 'Cargar más'}
                    </button>
                </div>
            )}
        </section>
    );
}
