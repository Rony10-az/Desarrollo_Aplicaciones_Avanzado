'use client'

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import Backdrop from './Backdrop';
import PortalRings from './PortalRings';

const avatar = (id: number) => `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`;

// Render oficial de Rick (wiki), tratado con viñeta + tinte para integrarse al fondo
const RICK_FULL_BODY =
    'https://static.wikia.nocookie.net/rickandmorty/images/a/a6/Rick_Sanchez.png/revision/latest?cb=20250817060829';

const RICK_VIGNETTE = 'radial-gradient(ellipse 72% 88% at 50% 38%, black 60%, transparent 100%)';

// Personajes que orbitan alrededor del portal: [id, nombre, ángulo]
const orbiters = [
    { id: 2, name: 'Morty', angle: 0 },
    { id: 3, name: 'Summer', angle: 90 },
    { id: 4, name: 'Beth', angle: 180 },
    { id: 5, name: 'Jerry', angle: 270 },
];

const ORBIT_SECONDS = 36;

export default function Hero({ total }: { total: number }) {
    // Parallax suave: Rick se inclina hacia el mouse
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 60, damping: 15 });
    const sy = useSpring(my, { stiffness: 60, damping: 15 });
    const rotateY = useTransform(sx, [-1, 1], [-10, 10]);
    const rotateX = useTransform(sy, [-1, 1], [6, -6]);

    return (
        <section
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                mx.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
                my.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
            }}
            className="relative isolate overflow-hidden"
        >
            <Backdrop />

            <div className="relative z-10 mx-auto grid min-h-[calc(100dvh-57px)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
                <div className="text-center lg:text-left">
                    <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400"
                    >
                        Guía de personajes
                    </motion.p>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="mt-5 text-5xl font-extrabold leading-[1.05] text-white sm:text-6xl xl:text-7xl"
                    >
                        Cruza el portal al universo de{' '}
                        <span className="bg-linear-to-r from-emerald-300 via-lime-300 to-cyan-300 bg-clip-text text-transparent">
                            Rick and Morty
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.3 }}
                        className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-300 lg:mx-0"
                    >
                        Soy Rick, el científico más listo del multiverso. Conoce a los {total}{' '}
                        personajes de la serie: de dónde vienen, en qué dimensión viven y en qué
                        episodios aparecen. Desliza hacia abajo y cruza conmigo el portal.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
                    >
                        <a
                            href="#cruzar-portal"
                            className="rounded-xl bg-emerald-400 px-8 py-3.5 font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:scale-105 hover:bg-lime-300"
                        >
                            Cruzar el portal
                        </a>
                        <Link
                            href="/RickandMorty/1"
                            className="rounded-xl border border-white/20 px-8 py-3.5 font-semibold text-white transition hover:scale-105 hover:bg-white/10"
                        >
                            Conocer a Rick
                        </Link>
                    </motion.div>
                </div>

                {/* Portal con Rick saliendo de él, a cuerpo entero */}
                <div
                    className="relative mx-auto h-[26rem] w-72 sm:h-[34rem] sm:w-96"
                    style={{ perspective: 1000 }}
                >
                    {/* zona del portal: cuadrada, centrada, para que la órbita sea un círculo real */}
                    <div className="absolute left-1/2 top-6 h-52 w-52 -translate-x-1/2 sm:h-60 sm:w-60">
                        <PortalRings />

                        {/* Familia orbitando el portal */}
                        {orbiters.map((o) => (
                            <motion.div
                                key={o.id}
                                className="absolute inset-0 z-20"
                                initial={{ rotate: o.angle }}
                                animate={{ rotate: o.angle + 360 }}
                                transition={{ duration: ORBIT_SECONDS, repeat: Infinity, ease: 'linear' }}
                            >
                                <motion.div
                                    className="absolute left-1/2 top-0 -ml-7 -mt-7 h-14 w-14"
                                    initial={{ rotate: -o.angle }}
                                    animate={{ rotate: -o.angle - 360 }}
                                    transition={{
                                        duration: ORBIT_SECONDS,
                                        repeat: Infinity,
                                        ease: 'linear',
                                    }}
                                >
                                    <Image
                                        src={avatar(o.id)}
                                        alt={o.name}
                                        width={56}
                                        height={56}
                                        className="h-full w-full rounded-full object-cover ring-2 ring-emerald-300 shadow-lg shadow-emerald-500/40"
                                    />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Rick de cuerpo entero, emergiendo por delante del portal */}
                    <motion.div
                        className="absolute inset-x-0 bottom-0 top-0 z-10"
                        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                        initial={{ opacity: 0, scale: 0.6, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
                        transition={{
                            opacity: { duration: 0.9, delay: 0.2 },
                            scale: { type: 'spring', stiffness: 60, damping: 13, delay: 0.2 },
                            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                        }}
                    >
                        <div
                            className="relative h-full w-full"
                            style={{ maskImage: RICK_VIGNETTE, WebkitMaskImage: RICK_VIGNETTE }}
                        >
                            <Image
                                src={RICK_FULL_BODY}
                                alt="Rick Sánchez saliendo del portal"
                                fill
                                priority
                                sizes="(min-width: 640px) 384px, 288px"
                                className="object-cover object-top saturate-125 contrast-110 drop-shadow-[0_30px_60px_rgba(0,0,0,0.55)]"
                            />
                            {/* tinte para integrar la foto a la paleta esmeralda del sitio */}
                            <div className="absolute inset-0 bg-emerald-400/10 mix-blend-color" />
                            <div className="absolute inset-0 bg-linear-to-t from-[#07060f] via-transparent to-transparent" />
                        </div>
                    </motion.div>
                </div>
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
