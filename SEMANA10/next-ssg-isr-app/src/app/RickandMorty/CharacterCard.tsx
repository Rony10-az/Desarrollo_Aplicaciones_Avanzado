'use client'

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Character } from '@/types/rickandmorty';

// Solo imagen: el nombre aparece únicamente al pasar el mouse
export default function CharacterCard({
    character,
    index,
    clone = false,
}: {
    character: Character;
    index: number;
    clone?: boolean;
}) {
    return (
        <motion.div
            whileHover={{ scale: 1.08, rotate: index % 2 ? 1.5 : -1.5, y: -10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            // zigzag: las tarjetas impares bajan para que no parezca una cuadrícula
            className={index % 2 ? 'translate-y-10' : ''}
        >
            <Link
                href={`/RickandMorty/${character.id}`}
                tabIndex={clone ? -1 : undefined}
                draggable={false}
                aria-label={character.name}
                className="group relative block h-72 w-56 overflow-hidden rounded-t-[7rem] rounded-b-3xl ring-1 ring-white/15 transition hover:ring-emerald-300/70"
            >
                <Image
                    src={character.image}
                    alt={character.name}
                    width={300}
                    height={300}
                    loading="lazy" // carga bajo demanda
                    draggable={false}
                    className="h-full w-full select-none object-cover transition duration-500 group-hover:scale-110"
                />
                <span className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent px-4 pb-4 pt-10 text-center text-sm font-semibold text-white opacity-0 transition group-hover:opacity-100">
                    {character.name}
                </span>
            </Link>
        </motion.div>
    );
}
