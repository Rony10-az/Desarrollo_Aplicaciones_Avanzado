// Asigna a cada libro un color de "lomo" determinista (mismo texto -> mismo color
// siempre), inspirado en encuadernaciones de biblioteca: cuero, musgo, tinta, vino.
const SPINE_PALETTE = [
    { bg: '#7c2d12', fg: '#f5ead9' }, // cuero quemado
    { bg: '#1e3a2f', fg: '#e8f0ea' }, // musgo oscuro
    { bg: '#3f2d1c', fg: '#f3e6d0' }, // nogal
    { bg: '#5b1a2b', fg: '#f6e6ea' }, // vino
    { bg: '#1f2937', fg: '#e9edf2' }, // tinta
    { bg: '#6b4423', fg: '#f6ecd9' }, // tabaco
    { bg: '#2f3b2f', fg: '#eaf0e7' }, // bosque
    { bg: '#4a2e2a', fg: '#f3e5de' }, // caoba
] as const;

export function spineColorFor(seed: string): { bg: string; fg: string } {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    }
    return SPINE_PALETTE[hash % SPINE_PALETTE.length];
}
