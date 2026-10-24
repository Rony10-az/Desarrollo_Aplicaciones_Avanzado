'use client'

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Character } from '@/types/rickandmorty';
import { statusLabels, statusStyles } from './styles';

// Esquina superior derecha cortada en diagonal: reemplaza el óvalo anterior
// por una placa tipo "panel técnico" con movimiento perpetuo propio.
const CARD_CLIP = 'polygon(0 0, calc(100% - 26px) 0, 100% 26px, 100% 100%, 0 100%)';

function CharacterCard({
    character,
    index,
    clone = false,
}: {
    character: Character;
    index: number;
    clone?: boolean;
}) {
    // cada tarjeta flota con su propio ritmo, para que el carrusel se sienta vivo
    const floatDelay = (index % 5) * 0.4;
    const floatDuration = 4.4 + (index % 3) * 0.6;
    // zigzag: las tarjetas impares bajan para que no parezca una cuadrícula.
    // Framer Motion escribe el transform inline, así que el desfase va dentro
    // de `animate` en vez de una clase de Tailwind (que quedaría sobrescrita).
    const restY = index % 2 ? 32 : 0;

    return (
        <motion.div
            animate={{ y: [restY, restY - 10, restY] }}
            transition={{
                duration: floatDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: floatDelay,
            }}
            whileHover={{ y: restY - 16, scale: 1.045 }}
            whileTap={{ scale: 0.98 }}
            style={{ willChange: 'transform' }}
        >
            <Link
                href={`/RickandMorty/${character.id}`}
                tabIndex={clone ? -1 : undefined}
                draggable={false}
                aria-label={character.name}
                className="group relative block h-72 w-56"
            >
                {/* marco holográfico: se asoma por el borde de 3px y por la esquina cortada */}
                <span
                    aria-hidden
                    className="holo-edge absolute inset-0 rounded-[1.5rem] opacity-70 transition-opacity duration-300 group-hover:opacity-100"
                    style={{ clipPath: CARD_CLIP }}
                />

                {/* panel principal */}
                <span
                    aria-hidden
                    className="absolute inset-[3px] block overflow-hidden rounded-[1.4rem] bg-slate-950 ring-1 ring-white/10"
                    style={{ clipPath: CARD_CLIP }}
                >
                    <Image
                        src={character.image}
                        alt=""
                        width={300}
                        height={300}
                        loading="lazy" // carga bajo demanda
                        draggable={false}
                        className="h-full w-full select-none object-cover transition duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/5 to-transparent" />

                    {/* HUD inferior: nombre, estado y especie siempre visibles */}
                    <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-slate-950/70 px-3.5 py-2.5 backdrop-blur-sm">
                        <p className="truncate text-sm font-semibold text-white">{character.name}</p>
                        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                            <span
                                className={`inline-block h-1.5 w-1.5 shrink-0 animate-pulse rounded-full ${statusStyles[character.status]}`}
                            />
                            <span className="truncate">
                                {statusLabels[character.status]} · {character.species}
                            </span>
                        </div>
                    </div>
                </span>

                {/* ficha en la esquina cortada */}
                <span className="pointer-events-none absolute right-2.5 top-2 z-10 font-mono text-[10px] font-semibold tracking-wider text-slate-950/80">
                    #{String(character.id).padStart(3, '0')}
                </span>
            </Link>
        </motion.div>
    );
}

export default memo(CharacterCard);
