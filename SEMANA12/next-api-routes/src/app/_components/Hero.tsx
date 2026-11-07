'use client';

import Image from 'next/image';
import { SearchIcon } from './icons';
import { HERO_IMAGE } from './libraryImages';

type Props = {
    query: string;
    onQueryChange: (value: string) => void;
    totalBooks: number;
};

export function Hero({ query, onQueryChange, totalBooks }: Props) {
    return (
        <section className="relative isolate flex min-h-[86dvh] items-end overflow-hidden bg-stone-950">
            <Image
                src={HERO_IMAGE.src}
                alt={HERO_IMAGE.alt}
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-80 [animation:ken-burns_22s_ease-in-out_infinite_alternate]"
            />

            {/* legibilidad del texto + fundido hacia el color de la pagina */}
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/55 to-stone-950/20"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-stone-50"
            />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 64px)',
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-20 pt-32 sm:px-10 md:pb-28 lg:px-16">
                <div className="max-w-xl animate-[fade-in_700ms_ease-out]">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-100 backdrop-blur-sm">
                        Catalogo vivo · {totalBooks} volumenes
                    </span>

                    <h1 className="mt-6 font-serif text-4xl leading-[1.05] tracking-tight text-white md:text-6xl [text-wrap:balance]">
                        Cada estante guarda
                        <br />
                        una pregunta sin hacer.
                    </h1>

                    <p className="mt-5 max-w-[48ch] text-base leading-relaxed text-stone-200">
                        Recorre la coleccion por titulo, autor o genero. Acerca el cursor a
                        cualquier libro y abrelo como si pasaras la lupa sobre su lomo.
                    </p>

                    <div className="relative mt-9 max-w-md">
                        <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-stone-400" />
                        <input
                            value={query}
                            onChange={(e) => onQueryChange(e.target.value)}
                            placeholder="Busca por titulo..."
                            aria-label="Buscar libros por titulo"
                            className="w-full rounded-full border border-white/20 bg-white/95 py-3.5 pl-11 pr-5 text-sm text-stone-800 shadow-[0_18px_40px_-15px_rgba(0,0,0,0.6)] outline-none backdrop-blur-md transition-colors placeholder:text-stone-400 focus:border-amber-700"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
