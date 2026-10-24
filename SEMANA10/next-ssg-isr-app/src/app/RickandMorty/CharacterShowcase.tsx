'use client'

import Image from 'next/image';
import { motion } from 'motion/react';
import {
    CalendarDays,
    Dna,
    Globe2,
    HeartPulse,
    LucideIcon,
    MapPin,
    Tag,
    Tv,
    VenusAndMars,
} from 'lucide-react';
import { Character } from '@/types/rickandmorty';
import Backdrop from './Backdrop';
import TiltCard from './TiltCard';
import { genderLabels, statusLabels, statusStyles } from './styles';

interface Trait {
    icon: LucideIcon;
    label: string;
    value: string;
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
        { icon: HeartPulse, label: 'Estado', value: statusLabels[character.status] },
    ];
    const right: Trait[] = [
        { icon: Globe2, label: 'Origen', value: character.origin.name },
        { icon: MapPin, label: 'Última ubicación', value: character.location.name },
        { icon: Tv, label: 'Episodios', value: String(character.episode.length) },
        {
            icon: CalendarDays,
            label: 'Creado',
            value: new Date(character.created).toLocaleDateString('es-PE'),
        },
    ];

    return (
        <section className="relative isolate overflow-hidden px-6 py-16">
            <Backdrop />

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

                <div className="mt-14 grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
                    <div className="order-2 grid gap-5 lg:order-1">
                        {left.map((trait, i) => (
                            <Chip key={trait.label} trait={trait} index={i} side="left" />
                        ))}
                    </div>

                    {/* Personaje al centro: tarjeta 3D */}
                    <motion.div
                        className="relative order-1 mx-auto h-80 w-72 sm:h-104 sm:w-88 lg:order-2"
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
                            <span
                                style={{ transform: 'translateZ(70px)' }}
                                className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-slate-950/95 px-5 py-2 text-sm font-medium text-white shadow-xl ring-1 ring-white/20"
                            >
                                <span
                                    className={`inline-block h-2.5 w-2.5 animate-pulse rounded-full ${statusStyles[character.status]}`}
                                />
                                {statusLabels[character.status]}
                            </span>
                        </TiltCard>
                    </motion.div>

                    <div className="order-3 grid gap-5">
                        {right.map((trait, i) => (
                            <Chip key={trait.label} trait={trait} index={i + 4} side="right" />
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
