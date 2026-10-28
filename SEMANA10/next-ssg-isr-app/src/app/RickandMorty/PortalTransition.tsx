'use client'

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';

/*
 * Secuencia cinematográfica dirigida por scroll: una sección alta (260vh)
 * con un panel "sticky" adentro. El fondo va cruzando por tres fotos
 * (persecución → caída → túnel) con un pulso de zoom y un flash verde en
 * cada corte, mientras unos subtítulos van marcando el momento del viaje.
 */
export default function PortalTransition() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

    const bg1Opacity = useTransform(scrollYProgress, [0, 0.26, 0.32], [1, 1, 0]);
    const bg2Opacity = useTransform(scrollYProgress, [0.26, 0.32, 0.58, 0.64], [0, 1, 1, 0]);
    const bg3Opacity = useTransform(scrollYProgress, [0.58, 0.64, 1], [0, 1, 1]);

    const cutPoints = [0, 0.27, 0.3, 0.33, 0.59, 0.62, 0.65, 1];
    const flashOpacity = useTransform(scrollYProgress, cutPoints, [0, 0, 0.9, 0, 0, 0.9, 0, 0]);
    const warpScale = useTransform(scrollYProgress, cutPoints, [1, 1, 1.15, 1, 1, 1.15, 1, 1]);

    const glitchOpacity = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.26], [0, 1, 1, 0]);
    const cap1Opacity = useTransform(scrollYProgress, [0.24, 0.29, 0.36, 0.4], [0, 1, 1, 0]);
    const cap2Opacity = useTransform(scrollYProgress, [0.42, 0.47, 0.54, 0.58], [0, 1, 1, 0]);
    const cap3Opacity = useTransform(scrollYProgress, [0.66, 0.72, 1], [0, 1, 1]);
    const cap3Scale = useTransform(scrollYProgress, [0.66, 0.72], [0.9, 1]);
    const ctaOpacity = useTransform(scrollYProgress, [0.85, 0.95, 1], [0, 1, 1]);

    return (
        <section id="cruzar-portal" ref={ref} className="relative h-[260vh] scroll-mt-14">
            <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden bg-[#07060f]">
                <Link
                    href="#"
                    className="absolute left-6 top-6 z-40 text-sm font-medium text-white/70 transition hover:text-white"
                >
                    ← Hero
                </Link>

                {/* fondo: tres fotos encadenadas */}
                <motion.div aria-hidden style={{ scale: warpScale }} className="absolute inset-0">
                    <motion.div style={{ opacity: bg1Opacity }} className="absolute inset-0">
                        <Image src="/rickandmorty/chase.jpg" alt="" fill priority sizes="100vw" className="object-cover" />
                    </motion.div>
                    <motion.div style={{ opacity: bg2Opacity }} className="absolute inset-0">
                        <Image src="/rickandmorty/falling.jpg" alt="" fill sizes="100vw" className="object-cover" />
                    </motion.div>
                    <motion.div style={{ opacity: bg3Opacity }} className="absolute inset-0">
                        <Image src="/rickandmorty/tunnel.jpg" alt="" fill sizes="100vw" className="object-cover" />
                    </motion.div>
                </motion.div>

                <div className="absolute inset-0 bg-linear-to-b from-[#07060f]/60 via-transparent to-[#07060f]/80" />

                <motion.div
                    aria-hidden
                    style={{ opacity: flashOpacity }}
                    className="pointer-events-none absolute inset-0 z-20 bg-[#eaffd6]"
                />

                {/* subtítulos */}
                <motion.div
                    style={{ opacity: glitchOpacity }}
                    className="absolute top-[16%] z-30 px-6 text-center"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/90">
                        Señal interdimensional
                    </p>
                    <p className="rm-glitch mt-2 text-2xl font-bold text-white sm:text-3xl">
                        No parpadees. Esto se pone raro.
                    </p>
                </motion.div>

                <motion.p
                    style={{ opacity: cap1Opacity }}
                    className="absolute z-30 px-6 text-center text-xl font-semibold text-white sm:text-2xl"
                >
                    Activando el portal
                </motion.p>

                <motion.p
                    style={{ opacity: cap2Opacity }}
                    className="absolute z-30 px-6 text-center text-xl font-semibold text-white sm:text-2xl"
                >
                    Calibrando coordenadas
                </motion.p>

                <motion.p
                    style={{ opacity: cap3Opacity, scale: cap3Scale }}
                    className="rm-title-glow absolute z-30 px-6 text-center text-3xl font-extrabold text-emerald-300 sm:text-5xl"
                >
                    Bienvenido a la Dimensión C-137
                </motion.p>

                <motion.a
                    href="#personajes"
                    style={{
                        opacity: ctaOpacity,
                        background: 'linear-gradient(135deg,#a3e635,#34d399 55%,#0f9e8f)',
                    }}
                    className="absolute bottom-16 z-30 rounded-xl px-8 py-3.5 font-semibold text-slate-950 shadow-lg shadow-emerald-500/30"
                    whileHover={{ scale: 1.05 }}
                >
                    Continuar
                </motion.a>
            </div>
        </section>
    );
}
