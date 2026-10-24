'use client'

import { motion, MotionValue } from 'motion/react';

/*
 * Aros del portal interdimensional: se reutiliza en el Hero (portal estático
 * animado) y en PortalTransition (portal que crece al hacer scroll). Acepta
 * un `scale` opcional controlado por scroll para la secuencia cinematográfica.
 */
export default function PortalRings({ scale }: { scale?: MotionValue<number> }) {
    return (
        <motion.div className="absolute inset-0" style={scale ? { scale } : undefined}>
            {/* resplandor */}
            <motion.div
                className="absolute -inset-6 rounded-full bg-emerald-400/30 blur-3xl"
                animate={{ scale: [1, 1.12, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* aro exterior del portal */}
            <motion.div
                className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#39ff14,#0a3a0a,#b6ff8a,#0a3a0a,#39ff14)]"
                animate={{ rotate: 360 }}
                transition={{ duration: 7, repeat: Infinity, ease: 'linear' }}
            />
            {/* remolino interior */}
            <motion.div
                className="absolute inset-3 rounded-full bg-[conic-gradient(from_90deg,#d6ffb0,#2fd10f,#073a07,#7dff4a,#d6ffb0)] opacity-90"
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,#eaffd6_0%,#7dff4a_35%,#0b4a0b_80%,#031a03_100%)] shadow-[inset_0_0_60px_#031a03]" />
        </motion.div>
    );
}
