import { SparkPagesIcon } from './icons';

export function BookGridSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
                <div
                    key={i}
                    className="aspect-[2/3] animate-pulse rounded-[1.25rem] bg-stone-200/70"
                    style={{ animationDelay: `${i * 70}ms` }}
                />
            ))}
        </div>
    );
}

export function EmptyShelf({ hasFilters, onReset }: { hasFilters: boolean; onReset: () => void }) {
    return (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
            <SparkPagesIcon className="h-16 w-16 text-stone-300" />
            <p className="font-serif text-xl text-stone-700">
                {hasFilters ? 'Ningun libro responde a esa busqueda.' : 'El estante todavia esta vacio.'}
            </p>
            <p className="max-w-sm text-sm text-stone-500">
                {hasFilters
                    ? 'Prueba con otro titulo, otro genero o quita algun filtro.'
                    : 'Agrega el primer libro con el boton "Agregar libro".'}
            </p>
            {hasFilters && (
                <button
                    type="button"
                    onClick={onReset}
                    className="mt-1 rounded-full border border-stone-300 px-5 py-2 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
                >
                    Quitar filtros
                </button>
            )}
        </div>
    );
}

export function GridError({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="flex flex-col items-center gap-3 rounded-[1.25rem] border border-red-100 bg-red-50/60 py-16 text-center">
            <p className="text-sm font-medium text-red-700">{message}</p>
            <button
                type="button"
                onClick={onRetry}
                className="rounded-full border border-red-200 px-5 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
            >
                Reintentar
            </button>
        </div>
    );
}
