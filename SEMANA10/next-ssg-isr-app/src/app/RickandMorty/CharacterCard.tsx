'use client'

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Character } from '@/types/rickandmorty';
import TiltCard from './TiltCard';
import { statusLabels, statusStyles } from './styles';

/*
 * Tarjeta 3D (mismo lenguaje que TiltCard en la ficha de personaje): la
 * imagen se inclina siguiendo el mouse y la placa con el nombre y la ficha
 * del id "flotan" por delante gracias a translateZ dentro de un contexto
 * preserve-3d. Reemplaza el óvalo plano anterior.
 */
function CharacterCard({
    character,
    index,
    clone = false,
}: {
    character: Character;
    index: number;
    clone?: boolean;
}) {
    // cada tarjeta flota con su propio ritmo, y las impares bajan (zigzag)
    const floatDelay = (index % 5) * 0.4;
    const floatDuration = 4.4 + (index % 3) * 0.6;
    const restY = index % 2 ? 28 : 0;

    return (
        <motion.div
            animate={{ y: [restY, restY - 8, restY] }}
            transition={{
                duration: floatDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: floatDelay,
            }}
            style={{ willChange: 'transform' }}
        >
            <Link
                href={`/RickandMorty/${character.id}`}
                tabIndex={clone ? -1 : undefined}
                draggable={false}
                aria-label={character.name}
                className="group block h-72 w-56"
            >
                <TiltCard className="h-full w-full">
                    <div className="relative h-full w-full overflow-hidden rounded-3xl bg-slate-950 shadow-xl shadow-black/40 ring-1 ring-white/15 transition duration-300 group-hover:shadow-emerald-500/30 group-hover:ring-emerald-300/60">
                        <Image
                            src={character.image}
                            alt=""
                            fill
                            loading="lazy" // carga bajo demanda
                            draggable={false}
                            sizes="224px"
                            className="select-none object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/5 to-transparent" />
                    </div>

                    {/* placa con nombre y estado: flota por delante de la imagen */}
                    <div
                        style={{ transform: 'translateZ(40px)' }}
                        className="absolute inset-x-3 bottom-3 rounded-xl border border-white/10 bg-slate-950/85 px-3.5 py-2.5 backdrop-blur-md shadow-lg"
                    >
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

                    {/* ficha del id: la pieza más adelante del todas */}
                    <span
                        style={{ transform: 'translateZ(60px)' }}
                        className="absolute right-3 top-3 rounded-full bg-slate-950/90 px-2.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-emerald-300 ring-1 ring-emerald-400/30"
                    >
                        #{String(character.id).padStart(3, '0')}
                    </span>
                </TiltCard>
            </Link>
        </motion.div>
    );
}

export default memo(CharacterCard);
