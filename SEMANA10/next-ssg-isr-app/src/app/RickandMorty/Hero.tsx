'use client'

import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import Backdrop from './Backdrop';

const avatar = (id: number) => `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`;

// Personajes que orbitan alrededor del portal: [id, nombre, ángulo]
const orbiters = [
    { id: 2, name: 'Morty', angle: 0 },
    { id: 3, name: 'Summer', angle: 90 },
    { id: 4, name: 'Beth', angle: 180 },
    { id: 5, name: 'Jerry', angle: 270 },
];

const ORBIT_SECONDS = 36;

function Portal() {
    return (
        <>
            {/* resplandor */}
            <motion.div
                className="absolute -inset-6 rounded-full bg-emerald-400/30 blur-3xl"
                animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* aro exterior del portal */}
            <motion.div
                className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#39ff14,#0a3a0a,#b6ff8a,#0a3a0a,#39ff14)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            />
            {/* remolino interior */}
            <motion.div
                className="absolute inset-3 rounded-full bg-[conic-gradient(from_90deg,#d6ffb0,#2fd10f,#073a07,#7dff4a,#d6ffb0)] opacity-90"
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,#eaffd6_0%,#7dff4a_35%,#0b4a0b_80%,#031a03_100%)] shadow-[inset_0_0_60px_#031a03]" />
        </>
    );
}

export default function Hero({ total }: { total: number }) {
    // Parallax suave: Rick se inclina hacia el mouse
    const mx = useMotionValue(0);
    const my = useMotionValue(0);
    const sx = useSpring(mx, { stiffness: 60, damping: 15 });
    const sy = useSpring(my, { stiffness: 60, damping: 15 });
    const rotateY = useTransform(sx, [-1, 1], [-12, 12]);
    const rotateX = useTransform(sy, [-1, 1], [8, -8]);

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

            <div className="relative z-10 mx-auto grid min-h-[calc(100vh-57px)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2">
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
                        Conoce a los {total} personajes de la serie: de dónde vienen,
                        en qué dimensión viven y en qué episodios aparecen.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.5 }}
                        className="mt-10 flex flex-wrap justify-center gap-4 lg:justify-start"
                    >
                        <a
                            href="#personajes"
                            className="rounded-xl bg-emerald-400 px-8 py-3.5 font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:scale-105 hover:bg-lime-300"
                        >
                            Explorar personajes
                        </a>
                        <Link
                            href="/RickandMorty/1"
                            className="rounded-xl border border-white/20 px-8 py-3.5 font-semibold text-white transition hover:scale-105 hover:bg-white/10"
                        >
                            Conocer a Rick
                        </Link>
                    </motion.div>
                </div>

                {/* Portal con Rick saliendo de él */}
                <div className="relative mx-auto h-80 w-80 sm:h-112 sm:w-md" style={{ perspective: 1000 }}>
                    <Portal />

                    <motion.div
                        className="absolute inset-9"
                        style={{ rotateX, rotateY }}
                        initial={{ opacity: 0, scale: 0.3 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -14, 0], rotate: [-2, 2, -2] }}
                        transition={{
                            opacity: { duration: 0.8 },
                            scale: { type: 'spring', stiffness: 70, damping: 12 },
                            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                            rotate: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                        }}
                    >
                        <Image
                            src={avatar(1)}
                            alt="Rick Sanchez"
                            width={300}
                            height={300}
                            priority
                            className="h-full w-full rounded-full object-cover shadow-[0_20px_60px_rgba(0,0,0,0.6)] ring-4 ring-white/80"
                        />
                    </motion.div>

                    {/* Familia orbitando */}
                    {orbiters.map((o) => (
                        <motion.div
                            key={o.id}
                            className="absolute inset-0"
                            initial={{ rotate: o.angle }}
                            animate={{ rotate: o.angle + 360 }}
                            transition={{ duration: ORBIT_SECONDS, repeat: Infinity, ease: 'linear' }}
                        >
                            <motion.div
                                className="absolute left-1/2 top-0 -ml-8 -mt-8 h-16 w-16"
                                initial={{ rotate: -o.angle }}
                                animate={{ rotate: -o.angle - 360 }}
                                transition={{ duration: ORBIT_SECONDS, repeat: Infinity, ease: 'linear' }}
                            >
                                <Image
                                    src={avatar(o.id)}
                                    alt={o.name}
                                    width={64}
                                    height={64}
                                    className="h-full w-full rounded-full object-cover ring-2 ring-emerald-300 shadow-lg shadow-emerald-500/40"
                                />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
