type Props = {
    label: string;
    value: string | number;
    hint?: string;
};

export function StatTile({ label, value, hint }: Props) {
    return (
        <div className="border-t border-stone-200 pt-4">
            <p className="font-serif text-3xl tracking-tight text-stone-900 sm:text-4xl">{value}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.14em] text-stone-500">{label}</p>
            {hint && <p className="mt-0.5 text-[11px] text-stone-400">{hint}</p>}
        </div>
    );
}
