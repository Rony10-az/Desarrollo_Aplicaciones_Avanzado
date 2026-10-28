'use client'

import { useEffect, useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'motion/react';
import { Character } from '@/types/rickandmorty';
import CharacterCard from './CharacterCard';

const SPEED = 0.05; // px por ms
const fade = 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)';

/*
 * Carrusel que avanza solo y que también se puede arrastrar con el mouse
 * o el dedo. Se pausa al pasar el cursor. La lista se duplica y la posición
 * se reinicia al llegar a la mitad, así el movimiento nunca se corta.
 * Con pocos resultados se muestra centrado y quieto.
 */
export default function CharacterCarousel({
    characters,
    reverse = false,
}: {
    characters: Character[];
    reverse?: boolean;
}) {
    const loop = characters.length >= 6;
    const items = loop ? [...characters, ...characters] : characters;
    const dir = reverse ? 1 : -1;

    const x = useMotionValue(0);
    const trackRef = useRef<HTMLUListElement>(null);
    const half = useRef(0); // ancho de una copia de la lista
    const hovered = useRef(false);
    const dragging = useRef(false);

    useEffect(() => {
        const track = trackRef.current;
        if (!track || !loop) return;

        const measure = () => {
            half.current = (track.scrollWidth + 24) / 2; // 24 = gap-6
        };
        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(track);
        return () => observer.disconnect();
    }, [loop, characters]);

    useAnimationFrame((_, delta) => {
        if (!loop || !half.current) return;

        let next = x.get();
        if (!hovered.current && !dragging.current) next += dir * delta * SPEED;
        if (next <= -half.current) next += half.current;
        if (next > 0) next -= half.current;
        x.set(next);
    });

    return (
        <div
            className="relative overflow-hidden py-6"
            style={{ maskImage: fade, WebkitMaskImage: fade }}
            onMouseEnter={() => (hovered.current = true)}
            onMouseLeave={() => (hovered.current = false)}
        >
            <motion.ul
                ref={trackRef}
                style={{ x }}
                drag={loop ? 'x' : false}
                dragMomentum={false}
                onDragStart={() => (dragging.current = true)}
                onDragEnd={() => {
                    // se espera un instante para que el click del arrastre no abra una tarjeta
                    setTimeout(() => (dragging.current = false), 0);
                }}
                className={`flex w-max gap-6 pb-12 ${loop ? 'cursor-grab active:cursor-grabbing' : 'mx-auto'}`}
            >
                {items.map((character, i) => (
                    <li
                        key={`${character.id}-${i}`}
                        aria-hidden={i >= characters.length}
                        onClickCapture={(e) => {
                            if (dragging.current) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                        }}
                    >
                        <CharacterCard
                            character={character}
                            index={i % characters.length}
                            clone={i >= characters.length}
                        />
                    </li>
                ))}
            </motion.ul>
        </div>
    );
}
