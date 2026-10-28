'use client'

import { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'motion/react';
import BackgroundPhoto from './BackgroundPhoto';

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
            <div className="sticky top-0 flex h-dvh flex-col items-center justify-end overflow-hidden bg-[#05060d] px-6 pb-14 pt-14">
                <Link
                    href="#"
                    className="absolute left-8 top-6 z-40 text-sm text-cyan-200/80 transition hover:text-cyan-100"
                >
                    Hero
                </Link>

                {/* fondo: tres fotos encadenadas */}
                <motion.div aria-hidden style={{ scale: warpScale }} className="absolute -inset-[14%]">
                    <motion.div style={{ opacity: bg1Opacity }} className="absolute inset-0">
                        <BackgroundPhoto src="/rickandmorty/chase.jpg" priority />
                    </motion.div>
                    <motion.div style={{ opacity: bg2Opacity }} className="absolute inset-0">
                        <BackgroundPhoto src="/rickandmorty/falling.jpg" />
                    </motion.div>
                    <motion.div style={{ opacity: bg3Opacity }} className="absolute inset-0">
                        <BackgroundPhoto src="/rickandmorty/tunnel.jpg" />
                    </motion.div>
                    <div
                        className="absolute inset-0"
                        style={{
                            background: 'linear-gradient(rgba(5,6,13,0.35), rgba(5,6,13,0.9))',
                        }}
                    />
                </motion.div>

                {/* flash radial: verde encendido que se apaga hacia afuera */}
                <motion.div
                    aria-hidden
                    style={{ opacity: flashOpacity }}
                    className="pointer-events-none absolute inset-0 z-20"
                >
                    <div
                        className="absolute inset-0"
                        style={{
                            background:
                                'radial-gradient(circle, #eaffd6 0%, #39ff14 55%, transparent 100%)',
                        }}
                    />
                </motion.div>

                {/* subtítulo superior */}
                <motion.p
                    style={{ opacity: glitchOpacity }}
                    className="rm-glitch absolute top-14 z-30 px-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-teal-200"
                >
                    Señal interdimensional
                </motion.p>

                {/* captions, ancladas abajo como en el lienzo */}
                <div className="relative z-30 max-w-xl text-center">
                    <motion.p
                        style={{ opacity: cap1Opacity }}
                        className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
                    >
                        Activando el portal
                    </motion.p>

                    <motion.p
                        style={{ opacity: cap2Opacity }}
                        className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
                    >
                        Calibrando coordenadas
                    </motion.p>

                    <motion.p
                        style={{ opacity: cap3Opacity, scale: cap3Scale }}
                        className="relative text-3xl font-extrabold text-[#bef264] [text-shadow:0_0_18px_rgba(163,230,53,0.6)]"
                    >
                        Bienvenido a la Dimensión C-137
                    </motion.p>
                </div>

                <motion.a
                    href="#personajes"
                    style={{ opacity: ctaOpacity }}
                    className="relative z-30 mt-7 rounded-xl bg-[#0f6e56] px-7 py-3 font-bold text-[#eafff5]"
                    whileHover={{ scale: 1.05 }}
                >
                    Continuar
                </motion.a>
            </div>
        </section>
    );
}
