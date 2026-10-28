'use client'

import { memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Character } from '@/types/rickandmorty';
import TiltCard from './TiltCard';

/*
 * Tarjeta sin bordes, inclinada en 3D al pasar el mouse (TiltCard) y con un
 * bamboleo continuo irregular ("torpe", como tropezando) en vez de un
 * flotado parejo: cada tarjeta tiene su propio ritmo y un leve giro.
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
    const wobbleDelay = (index % 5) * 0.35;
    const wobbleDuration = 3.6 + (index % 4) * 0.7;
    const tilt = index % 2 ? 1.6 : -1.6;

    return (
        <motion.div
            animate={{
                y: [0, -10, 2, -5, 0],
                rotate: [0, tilt, -tilt * 0.6, tilt * 0.3, 0],
            }}
            transition={{
                duration: wobbleDuration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: wobbleDelay,
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
                    <div className="relative h-full w-full overflow-hidden rounded-[20px] bg-slate-950 shadow-xl shadow-black/40 transition duration-300">
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
