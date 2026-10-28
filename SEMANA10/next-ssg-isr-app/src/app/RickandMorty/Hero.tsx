'use client'

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import BackgroundPhoto from './BackgroundPhoto';
import { drip } from './fonts';

const INTRO_MS = 5600;

const chips = [
    { src: '/rickandmorty/evil-morty.jpg', alt: 'Evil Morty', top: '16%', size: 60, duration: 42, delay: -4 },
    {
        src: '/rickandmorty/chase.jpg',
        alt: 'Rick y Morty escapando por un portal',
        top: '68%',
        size: 50,
        duration: 55,
        delay: -18,
        objectPosition: 'center 30%',
    },
    { src: '/rickandmorty/falling.jpg', alt: 'Rick y Morty cayendo entre portales', top: '42%', size: 56, duration: 48, delay: -30 },
];

/*
 * Intro cinemática: un aro hueco que se expande y se apaga, el retrato de
 * Rick y Morty en zoom, "Bienvenido" y por último el título sellado en
 * verde. Se juega una sola vez al montar y luego se desmonta; respeta
 * prefers-reduced-motion.
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
            transition={{ duration: INTRO_MS / 1000, times: [0, 0.75, 1], ease: 'easeInOut' }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#05060d] px-6"
        >
            <div aria-hidden className="starfield animate-twinkle absolute inset-0 opacity-70" />

            <div className="relative h-72 w-60 sm:h-80 sm:w-64">
                {/* aro hueco que se expande y se apaga */}
                <motion.div
                    aria-hidden
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: [0, 0.8, 0], scale: [0.6, 1, 1.6] }}
                    transition={{ duration: 1.4, delay: 0.1, ease: 'easeOut' }}
                    className="absolute -inset-6 rounded-full border-2 border-emerald-400"
                />

                {/* retrato con mascara de viñeta, sin forma circular */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.55 }}
                    animate={{ opacity: 1, scale: [0.55, 1.04, 1] }}
                    transition={{ duration: 1, times: [0, 0.6, 1], delay: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                    className="relative h-full w-full overflow-hidden rounded-2xl"
                    style={{
                        maskImage: 'radial-gradient(ellipse 82% 90% at 50% 38%, #000 65%, transparent 100%)',
                        WebkitMaskImage:
                            'radial-gradient(ellipse 82% 90% at 50% 38%, #000 65%, transparent 100%)',
                    }}
                >
                    <Image
                        src="/rickandmorty/chase.jpg"
                        alt="Rick corriendo con Morty hacia un portal"
                        fill
                        priority
                        sizes="256px"
                        className="object-cover object-[center_35%]"
                    />
                </motion.div>
            </div>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.5, ease: 'easeOut' }}
                className="mt-6 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200"
            >
                Bienvenido
            </motion.p>

            <motion.p
                initial={{ opacity: 0, scale: 1.35 }}
                animate={{ opacity: 1, scale: [1.35, 0.94, 1] }}
                transition={{ duration: 0.8, times: [0, 0.65, 1], delay: 2.1, ease: [0.2, 0.8, 0.2, 1] }}
                className={`${drip.className} mt-1.5 px-6 text-center text-5xl leading-none text-[#39ff14] [text-shadow:0_0_18px_rgba(57,255,20,0.65),0_0_48px_rgba(57,255,20,0.35)] sm:text-7xl`}
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
        <section className="relative isolate flex min-h-[calc(100dvh-57px)] flex-col overflow-hidden">
            {introVisible && (
                <IntroOverlay
                    onDone={(reducedMotion) => {
                        setIntroVisible(false);
                        if (reducedMotion) setSkipIntro(true);
                    }}
                />
            )}

            {/* fondo a página completa, oscurecido hacia el texto (izquierda) */}
            <div className="absolute inset-0 -z-10">
                <BackgroundPhoto src="/rickandmorty/landscape.jpg" priority />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            'linear-gradient(100deg, rgba(7,6,15,0.97) 20%, rgba(7,6,15,0.78) 45%, rgba(7,6,15,0.35) 75%)',
                    }}
                />
            </div>

            {/* chips flotantes: a la deriva de lado a lado, sin parar */}
            {chips.map((chip) => (
                <div
                    key={chip.src}
                    aria-hidden
                    className="rm-drift absolute hidden overflow-hidden rounded-full ring-2 ring-emerald-400/70 shadow-[0_0_16px_rgba(16,185,129,0.4)] sm:block"
                    style={{
                        top: chip.top,
                        left: 0,
                        width: chip.size,
                        height: chip.size,
                        animationDuration: `${chip.duration}s`,
                        animationDelay: `${chip.delay}s`,
                    }}
                >
                    <Image
                        src={chip.src}
                        alt={chip.alt}
                        fill
                        sizes="64px"
                        className="object-cover"
                        style={chip.objectPosition ? { objectPosition: chip.objectPosition } : undefined}
                    />
                </div>
            ))}

            <div className="relative z-10 flex flex-1 items-center px-6 py-16 sm:px-10 lg:px-16">
                <div className="max-w-xl text-left">
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
                        className="mt-5 text-4xl font-extrabold leading-[1.1] text-white sm:text-5xl"
                    >
                        Cruza el portal al universo de
                        <br />
                        <span className={`${drip.className} rm-title-glow inline-block text-cyan-300`}>
                            Rick and Morty
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: contentDelay + 0.3 }}
                        className="mt-6 max-w-sm text-base leading-relaxed text-slate-300"
                    >
                        {total} personajes, infinitas dimensiones... y tú, del otro lado de la pantalla,
                        viéndolo todo.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: contentDelay + 0.5 }}
                        className="mt-10 flex flex-wrap items-center gap-7"
                    >
                        <div className="group/peek relative inline-flex">
                            <motion.a
                                href="#cruzar-portal"
                                whileHover={{ scaleX: 1.1, scaleY: 0.92 }}
                                whileTap={{ scaleX: 0.93, scaleY: 1.07 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 12 }}
                                className="inline-block rounded-xl px-8 py-3.5 font-bold text-[#022c22] shadow-lg shadow-emerald-500/30"
                                style={{
                                    background: 'linear-gradient(135deg,#a3e635,#34d399 55%,#0f9e8f)',
                                }}
                            >
                                Cruzar el portal
                            </motion.a>

                            {/* easter egg: alguien te está viendo */}
                            <div className="pointer-events-none absolute inset-x-0 bottom-full mb-3 flex flex-col items-center gap-1.5 opacity-0 transition duration-300 group-hover/peek:opacity-100">
                                <span className="whitespace-nowrap rounded-[10px] bg-[#0b0d16] px-3.5 py-1.5 text-xs text-slate-200 ring-1 ring-white/20">
                                    Alguien te está viendo...
                                </span>
                                <div className="h-13 w-13 overflow-hidden rounded-full ring-2 ring-emerald-400">
                                    <Image
                                        src="/rickandmorty/evil-morty.jpg"
                                        alt=""
                                        width={52}
                                        height={52}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        <a
                            href="#personajes"
                            className="text-sm font-semibold text-slate-200 transition hover:text-emerald-300"
                        >
                            Explorar personajes →
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Indicador de scroll hacia la secuencia del portal */}
            <motion.a
                href="#cruzar-portal"
                aria-label="Desliza para cruzar el portal"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10 mx-auto flex w-fit flex-col items-center gap-1 pb-7 text-emerald-300/80 transition hover:text-emerald-200"
            >
                <span className="text-[11px] font-medium uppercase tracking-[0.3em]">Scroll</span>
                <ChevronDown size={22} strokeWidth={1.75} />
            </motion.a>
        </section>
    );
}
