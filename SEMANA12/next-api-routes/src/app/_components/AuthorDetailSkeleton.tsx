export function AuthorDetailSkeleton() {
    return (
        <div className="flex flex-1 flex-col bg-stone-50">
            <div className="mx-auto w-full max-w-[1400px] px-6 py-8 sm:px-10 lg:px-16">
                <div className="h-64 animate-pulse rounded-[1.75rem] bg-stone-100" />
                <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="h-16 animate-pulse rounded-xl bg-stone-100" style={{ animationDelay: `${i * 70}ms` }} />
                    ))}
                </div>
                <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="aspect-[2/3] animate-pulse rounded-[1.25rem] bg-stone-100" style={{ animationDelay: `${i * 70}ms` }} />
                    ))}
                </div>
            </div>
        </div>
    );
}
