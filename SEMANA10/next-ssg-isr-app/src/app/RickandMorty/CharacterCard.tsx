'use client'

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Character } from '@/types/rickandmorty';
import TiltCard from './TiltCard';

// mismo ritmo "torpe" del lienzo: una sola curva de bamboleo, repartida en
// 4 duraciones/retrasos distintos (w1-w4) para que las tarjetas se vean
// descoordinadas entre sí en vez de moverse todas a la vez.
const WOBBLE_DURATIONS = [2.3, 2.7, 2.1, 2.9];
const WOBBLE_DELAYS = [0, 0.35, 0.7, 1.05];

/*
 * Tarjeta sin bordes, inclinada en 3D al pasar el mouse (TiltCard) y con un
 * bamboleo continuo irregular ("torpe", como tropezando) en vez de un
 * flotado parejo.
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
    const w = index % 4;

    return (
        <motion.div
            animate={{ y: [0, -6, 2, -4, 3, 0], rotate: [0, -1.6, 1, -0.8, 0.6, 0] }}
            transition={{
                duration: WOBBLE_DURATIONS[w],
                repeat: Infinity,
                ease: 'easeInOut',
                delay: WOBBLE_DELAYS[w],
            }}
            style={{ willChange: 'transform' }}
        >
            <Link
                href={`/RickandMorty/${character.id}`}
                tabIndex={clone ? -1 : undefined}
                draggable={false}
                aria-label={character.name}
                className="group block h-[300px] w-[260px]"
            >
                <TiltCard className="h-full w-full">
                    <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-slate-950 shadow-xl shadow-black/40 transition duration-300">
                        <Image
                            src={character.image}
                            alt=""
                            fill
                            loading="lazy" // carga bajo demanda
                            draggable={false}
                            sizes="260px"
                            className="select-none object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-slate-950/95 via-slate-950/5 to-transparent" />

                        {/* nombre: flota por delante de la imagen */}
                        <p
                            style={{ transform: 'translateZ(40px)' }}
                            className="absolute inset-x-3.5 bottom-3 truncate text-[15px] font-bold text-white [text-shadow:0_2px_6px_rgba(0,0,0,0.8)]"
                        >
                            {character.name}
                        </p>
                    </div>
                </TiltCard>
            </Link>
        </motion.div>
    );
}

export default memo(CharacterCard);
