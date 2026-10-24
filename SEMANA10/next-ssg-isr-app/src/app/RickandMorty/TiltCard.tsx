'use client'

import { ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

/*
 * Tarjeta 3D: se inclina siguiendo al mouse y deja un brillo que se mueve
 * con el cursor. Los hijos con translateZ quedan "flotando" sobre la tarjeta.
 */
export default function TiltCard({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    const px = useMotionValue(0.5);
    const py = useMotionValue(0.5);
    const sx = useSpring(px, { stiffness: 150, damping: 18 });
    const sy = useSpring(py, { stiffness: 150, damping: 18 });

    const rotateY = useTransform(sx, [0, 1], [-18, 18]);
    const rotateX = useTransform(sy, [0, 1], [18, -18]);
    const glare = useTransform(
        [sx, sy],
        ([x, y]: number[]) =>
            `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgba(255,255,255,0.35), transparent 55%)`
    );

    return (
        <div style={{ perspective: 1000 }} className={className}>
            <motion.div
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    px.set((e.clientX - rect.left) / rect.width);
                    py.set((e.clientY - rect.top) / rect.height);
                }}
                onMouseLeave={() => {
                    px.set(0.5);
                    py.set(0.5);
                }}
                style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
                className="relative h-full w-full"
            >
                {children}
                <motion.div
                    aria-hidden
                    style={{ background: glare }}
                    className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
                />
            </motion.div>
        </div>
    );
}
