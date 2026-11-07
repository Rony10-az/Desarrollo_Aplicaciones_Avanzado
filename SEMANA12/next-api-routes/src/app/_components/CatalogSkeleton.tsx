import { BookGridSkeleton } from './GridStates';

// Shell estatico que Next puede pre-renderizar al instante (nada dinamico
// aqui): se muestra mientras <Catalog> espera la consulta real a la base.
export function CatalogSkeleton() {
    return (
        <div className="flex flex-1 flex-col bg-stone-50">
            <div className="flex min-h-[86dvh] items-end bg-stone-950">
                <div className="mx-auto w-full max-w-[1400px] px-6 pb-20 pt-32 sm:px-10 md:pb-28 lg:px-16">
                    <div className="h-6 w-56 animate-pulse rounded-full bg-white/10" />
                    <div className="mt-6 h-10 w-80 animate-pulse rounded-full bg-white/10 sm:h-14 sm:w-[28rem]" />
                    <div className="mt-3 h-10 w-64 animate-pulse rounded-full bg-white/10 sm:h-14 sm:w-96" />
                    <div className="mt-9 h-12 w-full max-w-md animate-pulse rounded-full bg-white/10" />
                </div>
            </div>
            <div className="mx-auto w-full max-w-[1400px] px-6 py-10 sm:px-10 lg:px-16">
                <BookGridSkeleton />
            </div>
        </div>
    );
}
