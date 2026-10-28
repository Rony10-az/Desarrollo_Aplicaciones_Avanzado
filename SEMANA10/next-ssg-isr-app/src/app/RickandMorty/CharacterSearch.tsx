'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
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
    variants,
}: {
    initialData: CharacterListResponse;
    variants: Character[];
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
            {/* banner de llegada: la misma foto con la que termina el cruce del portal */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-80px' }}
                className="relative mb-10 h-56 overflow-hidden sm:h-72"
            >
                <motion.div
                    variants={{ hidden: { scale: 1.7 }, visible: { scale: 1 } }}
                    transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
                    className="absolute inset-0"
                >
                    <Image
                        src="/rickandmorty/tunnel.jpg"
                        alt="El interior del túnel interdimensional por el que acabas de cruzar"
                        fill
                        sizes="100vw"
                        className="object-cover object-[center_40%]"
                    />
                </motion.div>
                <motion.div
                    variants={{ hidden: { opacity: 0.9 }, visible: { opacity: 0 } }}
                    transition={{ duration: 0.7 }}
                    aria-hidden
                    className="absolute inset-0 bg-[#eaffd6]"
                />
                <div className="absolute inset-0 bg-linear-to-b from-[#07060f]/15 via-[#07060f]/55 to-[#07060f]" />
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="absolute inset-x-0 bottom-6 text-center"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal-200">
                        Llegaste
                    </p>
                    <p className="mt-1.5 text-xl font-bold text-white sm:text-2xl">
                        Esto es lo que encontraste del otro lado del portal.
                    </p>
                </motion.div>
            </motion.div>

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

            <div className="mb-3 flex items-baseline justify-between">
                <h3 className="text-base font-bold text-slate-200">Personajes principales</h3>
                <span className="text-xs text-teal-300">se desliza →</span>
            </div>
            </div>

            {/* El carrusel se alimenta del mismo estado que la búsqueda: siempre está sincronizado */}
            <CharacterCarousel
                key={Object.values(filters).join('|')}
                characters={characters}
            />

            {info.next && (
                <div className="max-w-7xl mx-auto px-6 text-center -mt-6 mb-16">
                    <button
                        onClick={loadMore}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-8 py-3 rounded-xl transition cursor-pointer"
                    >
                        {loading ? 'Cargando...' : 'Cargar más'}
                    </button>
                </div>
            )}

            {variants.length > 0 && (
                <div className="relative">
                    <Image
                        src="/rickandmorty/variant-texture.jpg"
                        alt=""
                        fill
                        sizes="100vw"
                        aria-hidden
                        className="object-cover opacity-10"
                    />
                    <div className="relative max-w-7xl mx-auto px-6 pt-4">
                        <div className="group/peek relative mb-3 flex items-baseline justify-between">
                            <h3 className="text-base font-bold text-slate-200">
                                Variantes del multiverso
                            </h3>
                            <span className="text-xs text-teal-300">← se desliza</span>

                            <div className="pointer-events-none absolute -top-20 left-0 flex items-center gap-2 opacity-0 transition duration-300 group-hover/peek:opacity-100">
                                <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/30 shadow-lg">
                                    <Image
                                        src="/rickandmorty/rick-throne.jpg"
                                        alt=""
                                        width={40}
                                        height={40}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <span className="whitespace-nowrap rounded-full bg-slate-950/90 px-3 py-1 text-xs text-slate-200 ring-1 ring-white/15">
                                    Yo también soy una variante, por si no lo sabías.
                                </span>
                            </div>
                        </div>
                    </div>
                    <CharacterCarousel characters={variants} reverse />
                </div>
            )}
        </section>
    );
}
