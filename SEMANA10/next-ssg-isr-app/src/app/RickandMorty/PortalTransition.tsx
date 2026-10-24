'use client'

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

/*
 * Secuencia cinematográfica: una sección alta (260vh) con un panel "sticky"
 * adentro. Mientras se hace scroll, el portal crece y gira, sin llegar a
 * cubrir toda la pantalla de un color plano (se cuida que el remolino se
 * siga viendo) y sin flash blanco: solo un degradado oscuro que cierra la
 * escena. Todo animado con scroll-linked transforms de Framer Motion.
 */
export default function PortalTransition() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

    // el aro crece pero nunca se convierte en una mancha de color plano
    const ringScale = useTransform(scrollYProgress, [0, 0.75, 1], [1, 4.4, 5.4]);
    const ringRotate = useTransform(scrollYProgress, [0, 1], [0, 220]);

    const introOpacity = useTransform(scrollYProgress, [0, 0.18], [1, 0]);
    const introY = useTransform(scrollYProgress, [0, 0.25], [0, -40]);

    const labelOpacity = useTransform(scrollYProgress, [0.38, 0.55, 0.82], [0, 1, 0]);
    const labelY = useTransform(scrollYProgress, [0.38, 0.55], [14, 0]);

    const vignetteOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);

    return (
        <section id="cruzar-portal" ref={ref} className="relative h-[260vh] scroll-mt-14">
            <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden bg-[#07060f]">
                <div aria-hidden className="starfield animate-twinkle absolute inset-0 opacity-70" />

                <motion.div
                    style={{ opacity: introOpacity, y: introY }}
                    className="absolute top-[18%] z-20 px-6 text-center"
                >
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/80">
                        Mantén el scroll
                    </p>
                    <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                        Cruza al otro lado del portal
                    </p>
                </motion.div>

                {/* aro del portal: paleta oscura y fría, sin centro blanco que encandile */}
                <motion.div
                    aria-hidden
                    style={{ scale: ringScale, rotate: ringRotate }}
                    className="relative h-52 w-52 sm:h-60 sm:w-60"
                >
                    <div className="absolute -inset-10 rounded-full bg-cyan-400/15 blur-3xl" />
                    <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#155e63,#031a1a,#5eead4,#031a1a,#155e63)]" />
                    <div className="absolute inset-4 rounded-full bg-[conic-gradient(from_180deg,#1f6b1a,#061c08,#86efac,#061c08,#1f6b1a)] opacity-85" />
                    <div className="absolute inset-10 rounded-full bg-[radial-gradient(circle,#0c3324_0%,#06201a_55%,#020e0a_100%)] shadow-[inset_0_0_50px_#010a07]" />
                </motion.div>

                <motion.div
                    style={{ opacity: labelOpacity, y: labelY }}
                    className="absolute z-40 px-6 text-center"
                >
                    <p className="text-sm font-medium tracking-[0.3em] text-cyan-100/90 sm:text-base">
                        ENTRANDO A LA DIMENSIÓN C-137
                    </p>
                </motion.div>

                <motion.div
                    aria-hidden
                    style={{ opacity: vignetteOpacity }}
                    className="pointer-events-none absolute inset-0 z-10 bg-linear-to-b from-[#07060f] via-transparent to-[#07060f]"
                />
            </div>
        </section>
    );
}
