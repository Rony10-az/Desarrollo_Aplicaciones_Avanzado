'use client'

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';
import BackgroundPhoto from './BackgroundPhoto';

/*
 * Página propia a la que se llega con un clic (no con scroll): el cruce
 * del portal se reproduce solo, una vez, en 8.6s —tres fotos encadenadas
 * con un pulso de zoom y un flash verde en cada corte— y termina con el
 * botón "Continuar" hacia la lista de personajes.
 */
export default function PortalTransition() {
    return (
        <div className="flex h-dvh flex-col items-center justify-end overflow-hidden bg-[#05060d] px-6 pb-14 pt-20">
            <Link
                href="/RickandMorty"
                className="absolute left-6 top-[73px] z-40 flex items-center gap-1.5 rounded-full border border-white/15 bg-[#0b0d16]/80 px-3.5 py-2 text-sm text-cyan-200/90 backdrop-blur-sm transition hover:border-cyan-300/40 hover:text-cyan-100"
            >
                <ArrowLeft size={15} strokeWidth={2} />
                Hero
            </Link>

            {/* fondo: tres fotos encadenadas, con un pulso de zoom en cada corte */}
            <motion.div
                aria-hidden
                className="absolute inset-0"
                animate={{ scale: [1, 1.5, 1.15, 1.15, 1.5, 1.15, 1.15, 1.5, 1.18, 1.18] }}
                transition={{
                    duration: 8.6,
                    times: [0, 0.09, 0.13, 0.46, 0.53, 0.58, 0.8, 0.87, 0.93, 1],
                    ease: 'easeInOut',
                }}
            >
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 0.86 }}
                >
                    <BackgroundPhoto src="/rickandmorty/chase.jpg" priority focusClassName="object-[center_30%]" />
                </motion.div>
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 1, 0] }}
                    transition={{ duration: 4.56, delay: 1.03, times: [0, 0.03, 0.85, 1] }}
                >
                    <BackgroundPhoto src="/rickandmorty/falling.jpg" />
                </motion.div>
                <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4, delay: 4.73 }}
                >
                    <BackgroundPhoto src="/rickandmorty/tunnel.jpg" focusClassName="object-[center_40%]" />
                </motion.div>
                <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(rgba(5,6,13,0.35), rgba(5,6,13,0.9))' }}
                />
            </motion.div>

            {/* flash radial: verde encendido que se apaga hacia afuera, en cada corte */}
            <motion.div
                aria-hidden
                className="pointer-events-none absolute inset-0 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0, 0.85, 0, 0, 0.8, 0, 0, 0.8, 0, 0] }}
                transition={{
                    duration: 8.6,
                    times: [0, 0.06, 0.1, 0.14, 0.48, 0.53, 0.58, 0.83, 0.88, 0.93, 1],
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{ background: 'radial-gradient(circle, #eaffd6 0%, #39ff14 55%, transparent 100%)' }}
                />
            </motion.div>

            {/* subtítulo superior: aparece con un parpadeo y se queda */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="rm-glitch absolute top-20 z-30 px-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-teal-200"
            >
                Señal interdimensional
            </motion.p>

            {/* captions, ancladas abajo como en el lienzo */}
            <div className="relative z-30 max-w-xl text-center">
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -8] }}
                    transition={{ duration: 8.6, times: [0.14, 0.19, 0.45, 0.5] }}
                    className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
                >
                    Activando el portal
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -8] }}
                    transition={{ duration: 8.6, times: [0.53, 0.58, 0.78, 0.83] }}
                    className="absolute inset-0 flex items-center justify-center text-2xl font-bold"
                >
                    Calibrando coordenadas
                </motion.p>

                <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 8.17 }}
                    className="relative text-3xl font-extrabold text-[#bef264] [text-shadow:0_0_18px_rgba(163,230,53,0.6)]"
                >
                    Bienvenido a la Dimensión C-137
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 8.6 }}
                className="relative z-30 mt-7"
            >
                <Link
                    href="/RickandMorty/lista"
                    className="inline-block rounded-xl bg-[#0f6e56] px-7 py-3 font-bold text-[#eafff5] transition hover:scale-105"
                >
                    Continuar
                </Link>
            </motion.div>
        </div>
    );
}
