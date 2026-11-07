// Shell estatico que Next puede pre-renderizar al instante: se muestra
// mientras <Dashboard> espera la consulta real a la base.
export function DashboardSkeleton() {
    return (
        <div className="flex flex-1 flex-col bg-stone-50">
            <section className="border-b border-stone-200/70 bg-white">
                <div className="mx-auto max-w-[1400px] px-6 py-14 sm:px-10 lg:px-16">
                    <div className="h-6 w-48 animate-pulse rounded-full bg-stone-100" />
                    <div className="mt-5 h-10 w-96 animate-pulse rounded-full bg-stone-100" />
                    <div className="mt-9 grid grid-cols-2 gap-6 sm:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-16 animate-pulse rounded-xl bg-stone-100" style={{ animationDelay: `${i * 70}ms` }} />
                        ))}
                    </div>
                </div>
            </section>
            <div className="mx-auto w-full max-w-[1400px] px-6 py-10 sm:px-10 lg:px-16">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="h-64 animate-pulse rounded-[1.25rem] bg-stone-100" style={{ animationDelay: `${i * 70}ms` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
