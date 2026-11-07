type Props = {
    label: string;
};

// Transicion entre secciones con una referencia visual a libros: una pequena
// pila de lomos de colores centrada sobre una linea fina.
export function SectionDivider({ label }: Props) {
    return (
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 py-2 sm:px-10 lg:px-16">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-200" />
            <div className="flex items-center gap-2.5 text-stone-400">
                <svg viewBox="0 0 28 20" className="h-4 w-6" fill="none" aria-hidden="true">
                    <rect x="0" y="2" width="5" height="16" rx="1" fill="#7c2d12" opacity="0.65" />
                    <rect x="6.5" y="0" width="5" height="18" rx="1" fill="#1e3a2f" opacity="0.65" />
                    <rect x="13" y="3" width="5" height="15" rx="1" fill="#5b1a2b" opacity="0.65" />
                    <rect x="19.5" y="1" width="5" height="17" rx="1" fill="#3f2d1c" opacity="0.65" />
                </svg>
                <span className="text-[11px] font-medium uppercase tracking-[0.18em]">{label}</span>
            </div>
            <span className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-200" />
        </div>
    );
}
