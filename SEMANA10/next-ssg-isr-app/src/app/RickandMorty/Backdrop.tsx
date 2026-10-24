// Fondo espacial: estrellas que titilan y nebulosas de colores
export default function Backdrop() {
    return (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="starfield animate-twinkle absolute inset-0" />
            <div className="absolute -left-40 -top-40 h-144 w-xl rounded-full bg-fuchsia-700/25 blur-3xl" />
            <div className="absolute -right-40 top-1/3 h-128 w-lg rounded-full bg-emerald-500/20 blur-3xl" />
            <div className="absolute inset-x-0 bottom-0 h-48 bg-linear-to-b from-transparent to-[#07060f]" />
        </div>
    );
}
