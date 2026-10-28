'use client'

import { motion } from 'motion/react';

// de la cuenta mas grande (pegada al retrato, sin profundidad) a la mas
// chica (hacia la ficha, mas profunda): asi el tentaculo se ve que se afina
// de verdad en vez de ser del mismo grosor de punta a punta.
const BEADS = [
    { size: 12, offset: 38, top: 8, z: 0 },
    { size: 9.5, offset: 24, top: 12, z: 14 },
    { size: 7.5, offset: 12, top: 5, z: 28 },
    { size: 4.5, offset: 2, top: 10, z: 40 },
];

/*
 * Tentáculo en 3D real (no un degradado plano simulando volumen): un
 * contenedor con perspective + preserve-3d gira continuamente en Y/X, y
 * cada "cuenta" de la cadena vive en su propio translateZ, así que el giro
 * las hace moverse a distinta velocidad entre sí (paralaje genuino).
 * Conecta el retrato con cada ficha de información.
 */
export default function Tentacle({
    side,
    top,
    delay,
}: {
    side: 'left' | 'right';
    top: string;
    delay: number;
}) {
    const dir = side === 'left' ? -1 : 1;

    return (
        <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay, ease: 'easeOut' }}
            style={{
                position: 'absolute',
                top,
                [side]: -46,
                width: 50,
                height: 28,
                perspective: 220,
            }}
        >
            <motion.div
                animate={{ rotateY: [dir * 20, dir * -20, dir * 20], rotateX: [6, -6, 6] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    transformStyle: 'preserve-3d',
                }}
            >
                {BEADS.map((bead, i) => (
                    <span
                        key={i}
                        style={{
                            position: 'absolute',
                            top: bead.top,
                            [side]: bead.offset,
                            width: bead.size,
                            height: bead.size,
                            borderRadius: '9999px',
                            transform: `translateZ(${bead.z}px)`,
                            background: 'radial-gradient(circle at 32% 28%, #e3fff8, #5eead4 48%, #0a6b5f 92%)',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
                        }}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
}
