'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import BackgroundPhoto from './BackgroundPhoto';
import { drip } from './fonts';

const INTRO_MS = 5600;

const chips = [
    { src: '/rickandmorty/evil-morty.jpg', alt: 'Evil Morty', className: 'left-[6%] top-[18%] h-16 w-16 sm:h-20 sm:w-20', path: [0, 14, -6, 0], delay: 0 },
    { src: '/rickandmorty/chase.jpg', alt: 'Rick y Morty escapando por un portal', className: 'right-[10%] top-[12%] h-14 w-14 sm:h-24 sm:w-24', path: [0, -10, 10, 0], delay: 1.1 },
    { src: '/rickandmorty/falling.jpg', alt: 'Rick y Morty cayendo entre portales', className: 'right-[4%] bottom-[16%] h-16 w-16 sm:h-20 sm:w-20', path: [0, 12, -8, 0], delay: 2 },
];

/*
 * Intro cinemática: aro que se expande, el retrato de Rick y Morty entra en
 * zoom, "Bienvenido" y por último el título sellado en verde. Se juega una
 * sola vez al montar y luego se desmonta; respeta prefers-reduced-motion.
 */
function IntroOverlay({ onDone }: { onDone: (reducedMotion: boolean) => void }) {
    useEffect(() => {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const t = setTimeout(() => onDone(reduced), reduced ? 0 : INTRO_MS);
        return () => clearTimeout(t);
    }, [onDone]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0] }}
            transition={{ duration: INTRO_MS / 1000, times: [0, 0.86, 1], ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[#07060f]"
        >
            <div aria-hidden className="starfield animate-twinkle absolute inset-0 opacity-70" />

            <motion.div
                aria-hidden
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute h-64 w-64 rounded-full bg-[conic-gradient(from_0deg,#39ff14,#0a3a0a,#b6ff8a,#0a3a0a,#39ff14)] blur-[2px] sm:h-80 sm:w-80"
            />

            <motion.div
                initial={{ opacity: 0, scale: 1.3 }}
                animate={{ opacity: [0, 1, 1, 0], scale: [1.3, 1, 1, 1.05] }}
                transition={{ duration: 2.6, times: [0, 0.3, 0.75, 1], delay: 0.5, ease: 'easeOut' }}
                className="absolute h-48 w-48 overflow-hidden rounded-full ring-4 ring-emerald-300/70 shadow-[0_0_60px_rgba(57,255,20,0.5)] sm:h-64 sm:w-64"
            >
                <Image
                    src="/rickandmorty/chase.jpg"
                    alt=""
                    fill
                    priority
                    sizes="256px"
                    className="object-cover"
                />
            </motion.div>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: [0, 1, 1, 0], y: 0 }}
                transition={{ duration: 1.4, times: [0, 0.3, 0.75, 1], delay: 2.0, ease: 'easeOut' }}
                className="absolute top-[28%] text-2xl font-semibold tracking-wide text-cyan-100 sm:text-3xl"
            >
                Bienvenido
            </motion.p>

            <motion.p
                initial={{ opacity: 0, scale: 1.4, rotate: -4 }}
                animate={{ opacity: [0, 1, 1], scale: [1.4, 0.95, 1], rotate: [-4, 1, 0] }}
                transition={{ duration: 1.8, times: [0, 0.6, 1], delay: 2.9, ease: 'easeOut' }}
                className={`${drip.className} px-6 text-center text-5xl leading-none text-[#39ff14] [text-shadow:0_0_24px_rgba(57,255,20,0.8),0_0_4px_rgba(57,255,20,1)] sm:text-7xl`}
            >
                Rick and Morty
            </motion.p>
        </motion.div>
    );
}

export default function Hero({ total }: { total: number }) {
    // la intro se muestra por defecto (igual en servidor y primer render del
    // cliente, sin parpadeo de hidratación) y ella misma decide, ya montada,
    // si el usuario prefiere menos movimiento.
    const [introVisible, setIntroVisible] = useState(true);
    const [skipIntro, setSkipIntro] = useState(false);

    // el contenido del hero empieza a aparecer justo cuando termina la intro
    const contentDelay = skipIntro ? 0 : INTRO_MS / 1000;

    return (
        <section className="relative isolate overflow-hidden">
            {introVisible && (
                <IntroOverlay
                    onDone={(reducedMotion) => {
                        setIntroVisible(false);
                        if (reducedMotion) setSkipIntro(true);
                    }}
                />
            )}

            {/* fondo a página completa */}
            <div className="absolute inset-0 -z-10">
                <BackgroundPhoto src="/rickandmorty/landscape.jpg" priority />
                <div className="absolute inset-0 bg-linear-to-t from-[#07060f] via-[#07060f]/70 to-[#07060f]/20" />
                <div className="absolute inset-0 bg-linear-to-r from-[#07060f]/70 via-transparent to-[#07060f]/40" />
            </div>

            {/* chips flotantes decorativos */}
            {chips.map((chip) => (
                <motion.div
                    key={chip.src}
                    aria-hidden
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: chip.path, y: chip.path.map((v) => v * 0.6) }}
                    transition={{
                        opacity: { duration: 1, delay: contentDelay + 0.3 },
                        x: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: chip.delay },
                        y: { duration: 9, repeat: Infinity, ease: 'easeInOut', delay: chip.delay },
                    }}
                    className={`absolute hidden overflow-hidden rounded-full ring-2 ring-white/20 shadow-xl shadow-black/50 sm:block ${chip.className}`}
                >
                    <Image src={chip.src} alt={chip.alt} fill sizes="96px" className="object-cover" />
                </motion.div>
            ))}

            <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center lg:min-h-[calc(100dvh-57px)] lg:flex lg:flex-col lg:justify-center">
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: contentDelay }}
                    className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400"
                >
                    Guía de personajes
                </motion.p>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: contentDelay + 0.1 }}
                    className="mt-5 text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl xl:text-7xl"
                >
                    Cruza el portal al universo de{' '}
                    <span className={`${drip.className} rm-title-glow inline-block text-cyan-300`}>
                        Rick and Morty
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: contentDelay + 0.3 }}
                    className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300"
                >
                    {total} personajes, infinitas dimensiones... y tú, del otro lado de la pantalla,
                    viéndolo todo.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: contentDelay + 0.5 }}
                    className="mt-10 flex flex-col items-center gap-5"
                >
                    <div className="group/peek relative">
                        <motion.a
                            href="#cruzar-portal"
                            whileHover={{ scaleX: 1.08, scaleY: 0.94 }}
                            whileTap={{ scaleX: 0.92, scaleY: 1.08 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                            className="inline-block rounded-xl px-9 py-3.5 font-semibold text-slate-950 shadow-lg shadow-emerald-500/30"
                            style={{
                                background: 'linear-gradient(135deg,#a3e635,#34d399 55%,#0f9e8f)',
                            }}
                        >
                            Cruzar el portal
                        </motion.a>

                        {/* easter egg: alguien te está viendo */}
                        <div className="pointer-events-none absolute inset-x-0 -top-20 flex flex-col items-center gap-1.5 opacity-0 transition duration-300 group-hover/peek:opacity-100">
                            <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-red-500/70 shadow-lg shadow-red-900/60">
                                <Image
                                    src="/rickandmorty/evil-morty.jpg"
                                    alt=""
                                    width={48}
                                    height={48}
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <span className="whitespace-nowrap rounded-full bg-slate-950/90 px-3 py-1 text-xs text-red-300 ring-1 ring-red-500/30">
                                Alguien te está viendo...
                            </span>
                        </div>
                    </div>

                    <a
                        href="#personajes"
                        className="font-medium text-slate-300 underline-offset-4 transition hover:text-emerald-300 hover:underline"
                    >
                        Explorar personajes →
                    </a>
                </motion.div>
            </div>

            {/* Indicador de scroll hacia la secuencia del portal */}
            <motion.a
                href="#cruzar-portal"
                aria-label="Desliza para cruzar el portal"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-x-0 bottom-6 z-10 mx-auto flex w-fit flex-col items-center gap-1 text-emerald-300/80 transition hover:text-emerald-200"
            >
                <span className="text-[11px] font-medium uppercase tracking-[0.3em]">Scroll</span>
                <ChevronDown size={22} strokeWidth={1.75} />
            </motion.a>
        </section>
    );
}
