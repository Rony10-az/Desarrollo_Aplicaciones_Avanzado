'use client';

import { ChevronIcon } from './icons';
import type { Pagination as PaginationType } from './types';

type Props = {
    pagination: PaginationType;
    onPageChange: (page: number) => void;
};

function pageWindow(current: number, total: number): (number | 'gap')[] {
    const pages = new Set<number>([1, total, current, current - 1, current + 1]);
    const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

    const result: (number | 'gap')[] = [];
    let previous = 0;
    for (const page of sorted) {
        if (previous && page - previous > 1) result.push('gap');
        result.push(page);
        previous = page;
    }
    return result;
}

export function Pagination({ pagination, onPageChange }: Props) {
    if (pagination.totalPages <= 1) return null;

    return (
        <nav aria-label="Paginacion de resultados" className="mt-14 flex items-center justify-center gap-1.5">
            <button
                type="button"
                disabled={!pagination.hasPrev}
                onClick={() => onPageChange(pagination.page - 1)}
                aria-label="Pagina anterior"
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 disabled:pointer-events-none disabled:opacity-30"
            >
                <ChevronIcon className="h-4 w-4 rotate-180" />
            </button>

            {pageWindow(pagination.page, pagination.totalPages).map((item, index) =>
                item === 'gap' ? (
                    <span key={`gap-${index}`} className="px-1 text-sm text-stone-400">
                        …
                    </span>
                ) : (
                    <button
                        key={item}
                        type="button"
                        onClick={() => onPageChange(item)}
                        aria-current={item === pagination.page ? 'page' : undefined}
                        className={
                            item === pagination.page
                                ? 'flex h-9 w-9 items-center justify-center rounded-full bg-stone-900 text-sm font-medium text-stone-50'
                                : 'flex h-9 w-9 items-center justify-center rounded-full text-sm text-stone-600 transition-colors hover:bg-stone-100'
                        }
                    >
                        {item}
                    </button>
                ),
            )}

            <button
                type="button"
                disabled={!pagination.hasNext}
                onClick={() => onPageChange(pagination.page + 1)}
                aria-label="Pagina siguiente"
                className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 disabled:pointer-events-none disabled:opacity-30"
            >
                <ChevronIcon className="h-4 w-4" />
            </button>
        </nav>
    );
}
