'use client'

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import PortalRings from './PortalRings';

/*
 * Secuencia cinematográfica: una sección alta (260vh) con un panel "sticky"
 * adentro. Mientras se hace scroll, el portal crece hasta cubrir la pantalla
 * y un destello verde marca el cruce hacia la dimensión de los personajes.
 * Todo animado con scroll-linked transforms de Framer Motion (sin listeners
 * manuales de scroll), así que corre a 60fps en el hilo de composición.
 */
export default function PortalTransition() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

    const ringScale = useTransform(scrollYProgress, [0, 0.65, 1], [1, 16, 42]);
    const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 420]);
    const ringBlur = useTransform(scrollYProgress, [0, 0.5, 0.75], [0, 0, 8]);
    const ringFilter = useTransform(ringBlur, (b) => `blur(${b}px)`);

    const introOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
    const introY = useTransform(scrollYProgress, [0, 0.25], [0, -50]);

    const flashOpacity = useTransform(scrollYProgress, [0.58, 0.74, 0.92], [0, 0.85, 0]);

    const labelOpacity = useTransform(scrollYProgress, [0.32, 0.5, 0.78], [0, 1, 0]);
    const labelScale = useTransform(scrollYProgress, [0.32, 0.5], [0.85, 1]);

    const vignetteOpacity = useTransform(scrollYProgress, [0.78, 1], [0, 1]);

    return (
        <section id="cruzar-portal" ref={ref} className="relative h-[260vh] scroll-mt-14">
            <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden bg-[#07060f]">
                <div aria-hidden className="starfield animate-twinkle absolute inset-0 opacity-70" />

                <motion.div
                    style={{ opacity: introOpacity, y: introY }}
                    className="absolute top-[18%] z-20 px-6 text-center"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-300">
                        Mantén el scroll
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                        Cruza al otro lado del portal
                    </p>
                </motion.div>

                <motion.div
                    style={{ scale: ringScale, rotate: ringRotate, filter: ringFilter }}
                    className="relative h-48 w-48 sm:h-56 sm:w-56"
                >
                    <PortalRings />
                </motion.div>

                <motion.div
                    aria-hidden
                    style={{ opacity: flashOpacity }}
                    className="pointer-events-none absolute inset-0 z-30 bg-[#eaffd6]"
                />

                <motion.p
                    style={{ opacity: labelOpacity, scale: labelScale }}
                    className="absolute z-40 px-6 text-center text-sm font-semibold uppercase tracking-[0.5em] text-emerald-200 sm:text-base"
                >
                    Entrando a la dimensión C-137
                </motion.p>

                <motion.div
                    aria-hidden
                    style={{ opacity: vignetteOpacity }}
                    className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-[#07060f] via-transparent to-[#07060f]"
                />
            </div>
        </section>
    );
}
