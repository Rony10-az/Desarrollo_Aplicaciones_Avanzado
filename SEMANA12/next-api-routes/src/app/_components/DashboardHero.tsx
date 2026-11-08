import Image from 'next/image';

const TITLE_WORDS = ['Las', 'manos', 'detras', 'de', 'cada', 'estante.'];

export function DashboardHero({ totalAuthors }: { totalAuthors: number }) {
    return (
        <section className="relative isolate flex min-h-[64dvh] items-end overflow-hidden bg-stone-950">
            <Image
                src="/images/hero-authors.jpg"
                alt="Maquina de escribir vintage sobre un escritorio de madera, junto a un libro y una taza de cafe"
                fill
                priority
                sizes="100vw"
                className="object-cover opacity-75 [animation:ken-burns_24s_ease-in-out_infinite_alternate]"
            />

            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-stone-950/92 via-stone-950/60 to-stone-950/25" />
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-stone-50" />
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
                style={{
                    backgroundImage:
                        'repeating-linear-gradient(90deg, #ffffff 0px, #ffffff 1px, transparent 1px, transparent 64px)',
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-[1400px] px-6 pb-16 pt-28 sm:px-10 lg:px-16">
                <span className="inline-flex animate-[fade-in_600ms_ease-out] items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-stone-100 backdrop-blur-sm">
                    Panel de la biblioteca · {totalAuthors} {totalAuthors === 1 ? 'autor' : 'autores'}
                </span>

                <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight text-white md:text-5xl [text-wrap:balance]">
                    {TITLE_WORDS.map((word, i) => (
                        <span
                            key={i}
                            className="mr-[0.28em] inline-block animate-[fade-in_600ms_cubic-bezier(0.16,1,0.3,1)_backwards]"
                            style={{ animationDelay: `${120 + i * 70}ms` }}
                        >
                            {word}
                        </span>
                    ))}
                </h1>

                <p className="mt-5 max-w-[56ch] animate-[fade-in_700ms_ease-out_backwards] text-base leading-relaxed text-stone-200" style={{ animationDelay: '560ms' }}>
                    Aqui decides quien entra a la coleccion: da de alta autores, corrige sus
                    datos cuando haga falta y entra a la obra completa de cada uno.
                </p>
            </div>
        </section>
    );
}
