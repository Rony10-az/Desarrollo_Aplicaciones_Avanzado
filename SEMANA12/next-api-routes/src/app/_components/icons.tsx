// Iconos en SVG propios (sin dependencias externas): trazo fino, 1.5, estilo editorial.

type IconProps = {
    className?: string;
};

export function SearchIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M19.5 19.5L15.3 15.3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function MagnifierIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <circle cx="10" cy="10" r="6.25" stroke="currentColor" strokeWidth="1.5" />
            <path d="M14.4 14.4L19 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M10 7.5V12.5M7.5 10H12.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        </svg>
    );
}

export function CloseIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function PlusIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
    );
}

export function ChevronIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function BookmarkIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M6 4.5C6 3.67 6.67 3 7.5 3H16.5C17.33 3 18 3.67 18 4.5V21L12 17.25L6 21V4.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
}

export function TrashIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M5 7H19M9.5 7V5C9.5 4.45 9.95 4 10.5 4H13.5C14.05 4 14.5 4.45 14.5 5V7M7.5 7L8.1 19.1C8.14 19.9 8.8 20.5 9.6 20.5H14.4C15.2 20.5 15.86 19.9 15.9 19.1L16.5 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function EditIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
            <path d="M14.5 5.5L18.5 9.5M4 20L4.7 16.9C4.78 16.5 4.98 16.14 5.27 15.85L15.3 5.82C15.96 5.16 17.04 5.16 17.7 5.82L18.18 6.3C18.84 6.96 18.84 8.04 18.18 8.7L8.15 18.73C7.86 19.02 7.5 19.22 7.1 19.3L4 20Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export function SparkPagesIcon({ className }: IconProps) {
    return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
            <path d="M24 10C18 10 10 12.5 10 12.5V36.5C10 36.5 18 34 24 34C30 34 38 36.5 38 36.5V12.5C38 12.5 30 10 24 10Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
            <path d="M24 10V34" stroke="currentColor" strokeWidth="1.2" />
            <path d="M14 17.5C16.5 16.8 19.5 16.5 22 17" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M14 23C16.5 22.3 19.5 22 22 22.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
            <path d="M14 28.5C16.5 27.8 19.5 27.5 22 28" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
        </svg>
    );
}
