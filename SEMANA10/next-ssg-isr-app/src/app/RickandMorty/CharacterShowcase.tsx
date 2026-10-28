'use client'

import Image from 'next/image';
import { motion } from 'motion/react';
import { Dna, Globe2, LucideIcon, MapPin, Tag, Tv, VenusAndMars } from 'lucide-react';
import { Character } from '@/types/rickandmorty';
import TiltCard from './TiltCard';
import Tentacle from './Tentacle';
import { genderLabels, statusLabels, statusStyles } from './styles';

interface Trait {
    icon: LucideIcon;
    label: string;
    value: string;
}

// las 3 bandas donde los tentaculos conectan el retrato (280x320) con cada
// ficha, igual que en el lienzo
const TENTACLE_ROWS = ['58px', '147px', '236px'] as const;

function quipFor(character: Character) {
    // la frase original del lienzo era para Rick; para el resto usamos una
    // version generica segun su estado, con el mismo tono de 4ta pared
    if (character.id === 1) {
        return 'No tengo tiempo de explicarte por qué soy el más listo del universo. Solo créeme.';
    }
    if (character.status === 'Dead') return 'Sí, estoy muerto. Bienvenido a esta dimensión.';
    if (character.status === 'Alive')
        return 'Sigo vivo, para tu sorpresa. No le agradezcas al universo, agradéceme a mí.';
    return 'Ni yo sé en qué estado ando. Bienvenido de todas formas.';
}

function Chip({ trait, index, side }: { trait: Trait; index: number; side: 'left' | 'right' }) {
    const fromX = side === 'left' ? 140 : -140; // entra desde el centro hacia su posición
    const Icon = trait.icon;

    return (
        <motion.div
            initial={{ opacity: 0, x: fromX, scale: 0.85 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.55 + index * 0.13, ease: [0.2, 0.8, 0.2, 1] }}
            className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4.5 py-3.5 text-left"
        >
            <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-emerald-400">
                <Icon size={13} strokeWidth={1.75} />
                {trait.label}
            </p>
            <p className="mt-1 font-bold text-white wrap-break-word">{trait.value || '—'}</p>
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

                <div className="mt-24 flex flex-wrap items-center justify-center gap-8 pb-10 lg:mt-14">
                    <div className="order-2 grid w-[220px] gap-4 lg:order-1">
                        {left.map((trait, i) => (
                            <Chip key={trait.label} trait={trait} index={i} side="left" />
                        ))}
                    </div>

                    {/* Personaje al centro: tarjeta 3D con tentáculos y globo de diálogo */}
                    <motion.div
                        className="relative order-1 mb-12 h-[280px] w-[245px] sm:h-[320px] sm:w-[280px] lg:order-2 lg:mb-0"
                        initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 80, damping: 12 }}
                    >
                        <motion.div
                            aria-hidden
                            className="absolute -inset-4 rounded-[2rem] bg-emerald-400/25 blur-3xl"
                            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.9, 0.5] }}
                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        {TENTACLE_ROWS.map((top, i) => (
                            <Tentacle key={`l-${i}`} side="left" top={top} delay={0.9 + i * 0.15} />
                        ))}
                        {TENTACLE_ROWS.map((top, i) => (
                            <Tentacle key={`r-${i}`} side="right" top={top} delay={0.95 + i * 0.15} />
                        ))}

                        <TiltCard className="h-full w-full">
                            <div className="h-full w-full overflow-hidden rounded-[28px] border-t-[3px] border-emerald-400 shadow-2xl shadow-black/60">
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

                        {/* globo de diálogo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.6, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.85 }}
                            className="absolute -right-6 top-1.5 z-20 max-w-[170px] rounded-2xl rounded-bl-[4px] bg-[#0b0d16] px-3.5 py-2.5 text-[12.5px] leading-snug text-slate-100 shadow-xl ring-1 ring-white/20"
                        >
                            {quipFor(character)}
                        </motion.div>

                        {/* estado y fecha: montados sobre el borde inferior del retrato */}
                        <motion.span
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: 0.6 }}
                            className="absolute -bottom-[18px] left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-[#020617] px-5 py-2 text-[13px] font-semibold text-white"
                        >
                            <span
                                className={`inline-block h-2 w-2 animate-pulse rounded-full ${statusStyles[character.status]}`}
                            />
                            {statusLabels[character.status]}
                        </motion.span>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.4, delay: 0.75 }}
                            className="absolute -bottom-[42px] left-1/2 z-20 -translate-x-1/2 whitespace-nowrap text-[11px] text-slate-500"
                        >
                            Creado el {new Date(character.created).toLocaleDateString('es-PE')}
                        </motion.p>
                    </motion.div>

                    <div className="order-3 grid w-[220px] gap-4">
                        {right.map((trait, i) => (
                            <Chip key={trait.label} trait={trait} index={i} side="right" />
                        ))}
                    </div>
                </div>

                {/* Episodios */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.6 }}
                    className="mt-6"
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
