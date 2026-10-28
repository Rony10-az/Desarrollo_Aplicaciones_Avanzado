'use client'

import { motion } from 'motion/react';

const BEADS = [
    { size: 12, offset: 0, z: 0 },
    { size: 9.5, offset: 13, z: 14 },
    { size: 7.5, offset: 25, z: 28 },
    { size: 4.5, offset: 36, z: 40 },
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
                [side]: -48,
                width: 50,
                height: 28,
                perspective: 220,
            }}
        >
            <motion.div
                animate={{ rotateY: [dir * 18, dir * -18, dir * 18], rotateX: [-6, 6, -6] }}
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
                            top: '50%',
                            [side]: bead.offset,
                            width: bead.size,
                            height: bead.size,
                            borderRadius: '9999px',
                            transform: `translateY(-50%) translateZ(${bead.z * dir}px)`,
                            background: 'radial-gradient(circle at 35% 35%, #86efac, #047857 75%)',
                            boxShadow: '0 0 6px rgba(16,185,129,0.6)',
                        }}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
}
