'use client'

import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import Backdrop from './Backdrop';
import PortalRings from './PortalRings';
import { drip } from './fonts';

const avatar = (id: number) => `https://rickandmortyapi.com/api/character/avatar/${id}.jpeg`;

// Rick y Morty a cuerpo entero cruzando el portal (ilustración vectorial,
// fondo transparente). Morty ya aparece aquí, así que no se repite abajo.
const RICK_FULL_BODY =
    'https://raw.githubusercontent.com/lnascc/landing-page/main/images/rmvector.png';

// El resto de la familia orbita alrededor del portal: [id, nombre, ángulo]
const orbiters = [
    { id: 3, name: 'Summer', angle: 0 },
    { id: 4, name: 'Beth', angle: 120 },
    { id: 5, name: 'Jerry', angle: 240 },
];

const ORBIT_SECONDS = 36;

export default function Hero({ total }: { total: number }) {
    return (
        <section className="relative isolate overflow-hidden">
            <Backdrop />

            <div className="relative z-10 mx-auto grid max-w-7xl gap-12 px-6 py-16 lg:min-h-[calc(100dvh-57px)] lg:grid-cols-2 lg:items-center">
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
                        <span
                            className={`${drip.className} inline-block text-cyan-300 [text-shadow:0_0_14px_rgba(57,255,20,0.55),0_0_3px_rgba(57,255,20,0.85)]`}
                        >
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

                {/* Portal con Rick y Morty saliendo de él, a cuerpo entero */}
                <div className="relative mx-auto h-96 w-80 sm:h-[32rem] sm:w-[27rem]">
                    {/* halo del portal: glow suave detrás de la ilustración, no compite con ella */}
                    <div className="absolute left-1/2 top-[46%] h-48 w-48 -translate-x-1/2 -translate-y-1/2 opacity-60 blur-[2px] sm:h-56 sm:w-56">
                        <PortalRings />
                    </div>

                    {/* Rick y Morty cruzando el portal, a cuerpo entero */}
                    <motion.div
                        className="absolute inset-0 z-10"
                        initial={{ opacity: 0, scale: 0.85, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
                        transition={{
                            opacity: { duration: 0.9, delay: 0.2 },
                            scale: { type: 'spring', stiffness: 70, damping: 15, delay: 0.2 },
                            y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
                        }}
                    >
                        <Image
                            src={RICK_FULL_BODY}
                            alt="Rick y Morty cruzando el portal, a cuerpo entero"
                            fill
                            priority
                            sizes="(min-width: 640px) 432px, 320px"
                            className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
                        />
                    </motion.div>

                    {/* Resto de la familia orbitando el portal */}
                    <div className="absolute left-1/2 top-[46%] z-20 h-48 w-48 -translate-x-1/2 -translate-y-1/2 sm:h-56 sm:w-56">
                        {orbiters.map((o) => (
                            <motion.div
                                key={o.id}
                                className="absolute inset-0"
                                initial={{ rotate: o.angle }}
                                animate={{ rotate: o.angle + 360 }}
                                transition={{ duration: ORBIT_SECONDS, repeat: Infinity, ease: 'linear' }}
                            >
                                <motion.div
                                    className="absolute left-1/2 top-0 -ml-6 -mt-6 h-12 w-12"
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
                                        width={48}
                                        height={48}
                                        className="h-full w-full rounded-full object-cover ring-2 ring-emerald-300/80 shadow-lg shadow-emerald-500/40"
                                    />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
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
