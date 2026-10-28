'use client'

import Image from 'next/image';
import { motion } from 'motion/react';
import {
    CalendarDays,
    Dna,
    Globe2,
    LucideIcon,
    MapPin,
    Tag,
    Tv,
    VenusAndMars,
} from 'lucide-react';
import { Character } from '@/types/rickandmorty';
import TiltCard from './TiltCard';
import Tentacle from './Tentacle';
import { genderLabels, statusLabels, statusStyles } from './styles';

interface Trait {
    icon: LucideIcon;
    label: string;
    value: string;
}

const TENTACLE_ROWS = ['18%', '50%', '82%'] as const;

function quipFor(character: Character) {
    if (character.status === 'Dead') return 'Sí, estoy muerto. Bienvenido a esta dimensión.';
    if (character.status === 'Alive')
        return 'Sigo vivo, para tu sorpresa. No le agradezcas al universo, agradéceme a mí.';
    return 'Ni yo sé en qué estado ando. Bienvenido de todas formas.';
}

function Chip({ trait, index, side }: { trait: Trait; index: number; side: 'left' | 'right' }) {
    const fromX = side === 'left' ? 120 : -120; // entra desde el centro hacia su posición
    const Icon = trait.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: fromX, scale: 0.7 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 90, damping: 14, delay: 0.5 + index * 0.15 }}
        >
            {/* flotación continua, con desfase distinto por tarjeta */}
            <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{
                    duration: 3 + index * 0.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.3,
                }}
                whileHover={{ scale: 1.06 }}
                className="rounded-2xl border border-emerald-400/20 bg-slate-900/70 px-5 py-4 backdrop-blur-md shadow-lg hover:border-emerald-300/60 hover:shadow-emerald-500/20 transition-colors"
            >
                <p className="flex items-center gap-1.5 text-xs uppercase tracking-widest text-emerald-400">
                    <Icon size={14} strokeWidth={1.75} />
                    {trait.label}
                </p>
                <p className="mt-1 text-lg font-semibold text-white wrap-break-word">
                    {trait.value || '—'}
                </p>
            </motion.div>
        </motion.div>
    );
}

export default function CharacterShowcase({ character }: { character: Character }) {
    const left: Trait[] = [
        { icon: Dna, label: 'Especie', value: character.species },
        { icon: Tag, label: 'Tipo', value: character.type },
        { icon: VenusAndMars, label: 'Género', value: genderLabels[character.gender] },
    ];
    const right: Trait[] = [
        { icon: Globe2, label: 'Origen', value: character.origin.name },
        { icon: MapPin, label: 'Última ubicación', value: character.location.name },
        { icon: Tv, label: 'Episodios', value: String(character.episode.length) },
    ];

    return (
        <section className="rm-detail-bg relative isolate overflow-hidden px-6 py-16">
            <div aria-hidden className="starfield animate-twinkle pointer-events-none absolute inset-0 opacity-50" />

            <div className="relative z-10 mx-auto max-w-7xl">
                {/* Título grande */}
                <motion.h1
                    initial={{ opacity: 0, y: -40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8 }}
                    className="text-center text-5xl font-extrabold leading-none wrap-break-word bg-linear-to-r from-emerald-300 via-lime-300 to-cyan-300 bg-clip-text text-transparent sm:text-7xl lg:text-8xl"
                >
                    {character.name}
                </motion.h1>
                <p className="mt-3 text-center text-slate-400">
                    Personaje #{String(character.id).padStart(3, '0')} · {genderLabels[character.gender]} · {character.species}
                </p>

                <div className="mt-24 grid items-start gap-8 lg:mt-14 lg:grid-cols-[1fr_auto_1fr]">
                    <div className="order-2 grid gap-5 lg:order-1">
                        {left.map((trait, i) => (
                            <Chip key={trait.label} trait={trait} index={i} side="left" />
                        ))}
                    </div>

                    {/* Personaje al centro: tarjeta 3D con tentáculos y globo de diálogo */}
                    <div className="order-1 mx-auto flex flex-col items-center lg:order-2">
                        <motion.div
                            className="relative h-80 w-72 sm:h-104 sm:w-88"
                            initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 80, damping: 12 }}
                        >
                            <motion.div
                                aria-hidden
                                className="absolute -inset-6 rounded-[2.5rem] bg-emerald-400/30 blur-3xl"
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                            />

                            {/* globo de diálogo */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.7, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.9 }}
                                className="absolute -top-16 left-1/2 z-20 w-64 -translate-x-1/2 rounded-2xl bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-xl sm:-top-20 sm:left-auto sm:right-0 sm:translate-x-0"
                            >
                                {quipFor(character)}
                                <span className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 bg-white sm:left-auto sm:right-8 sm:translate-x-0" />
                            </motion.div>

                            {TENTACLE_ROWS.map((top, i) => (
                                <Tentacle key={`l-${i}`} side="left" top={top} delay={0.9 + i * 0.12} />
                            ))}
                            {TENTACLE_ROWS.map((top, i) => (
                                <Tentacle key={`r-${i}`} side="right" top={top} delay={0.9 + i * 0.12} />
                            ))}

                            <TiltCard className="h-full w-full">
                                <div className="h-full w-full overflow-hidden rounded-4xl ring-2 ring-white/30 shadow-2xl shadow-black/60">
                                    <Image
                                        src={character.image}
                                        alt={character.name}
                                        width={300}
                                        height={300}
                                        priority
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            </TiltCard>
                        </motion.div>

                        {/* estado y fecha de creación, debajo del retrato */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 1.3 }}
                            className="mt-6 flex flex-col items-center gap-2"
                        >
                            <span className="flex items-center gap-2 whitespace-nowrap rounded-full bg-slate-950/95 px-5 py-2 text-sm font-medium text-white shadow-xl ring-1 ring-white/20">
                                <span
                                    className={`inline-block h-2.5 w-2.5 animate-pulse rounded-full ${statusStyles[character.status]}`}
                                />
                                {statusLabels[character.status]}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-slate-400">
                                <CalendarDays size={13} strokeWidth={1.75} />
                                Creado el {new Date(character.created).toLocaleDateString('es-PE')}
                            </span>
                        </motion.div>
                    </div>

                    <div className="order-3 grid gap-5">
                        {right.map((trait, i) => (
                            <Chip key={trait.label} trait={trait} index={i + 3} side="right" />
                        ))}
                    </div>
                </div>

                {/* Episodios */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="mt-16"
                >
                    <p className="mb-3 flex items-center justify-center gap-2 text-center text-xs uppercase tracking-widest text-emerald-400">
                        <Tv size={14} strokeWidth={1.75} />
                        Aparece en {character.episode.length} episodios
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {character.episode.map((url) => {
                            const ep = url.split('/').pop();
                            return (
                                <span
                                    key={url}
                                    className="rounded-full bg-emerald-900/60 px-3 py-1 text-sm text-emerald-100"
                                >
                                    Ep. {ep}
                                </span>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
