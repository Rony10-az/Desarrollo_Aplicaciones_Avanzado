'use client';

import Image from 'next/image';
import { useState } from 'react';
import { spineColorFor } from './spineColor';
import { authorPhotoFor } from './authorPhotos';

type Props = {
    name: string;
    id?: string;
    photoUrl?: string | null;
    size?: number;
    className?: string;
};

// Avatar circular reutilizable: foto propia del autor si existe, si no la
// de Wikipedia para los clasicos, si no el monograma de color -- la misma
// cascada que usan las tarjetas/ficha de autor, en miniatura.
export function AuthorAvatar({ name, id, photoUrl, size = 22, className }: Props) {
    const [failed, setFailed] = useState(false);
    const photo = photoUrl || authorPhotoFor(name);
    const showPhoto = Boolean(photo) && !failed;
    const spine = spineColorFor(name + (id ?? ''));
    const initial = name.trim()[0]?.toUpperCase() ?? 'A';

    return (
        <span
            className={`relative inline-flex shrink-0 overflow-hidden rounded-full ${className ?? ''}`}
            style={{ width: size, height: size, backgroundColor: spine.bg }}
            aria-hidden="true"
        >
            {showPhoto ? (
                <Image
                    src={photo!}
                    alt=""
                    fill
                    unoptimized={Boolean(photoUrl)}
                    sizes={`${size}px`}
                    className="object-cover object-top"
                    onError={() => setFailed(true)}
                />
            ) : (
                <span className="flex h-full w-full items-center justify-center font-serif" style={{ color: spine.fg, fontSize: size * 0.5 }}>
                    {initial}
                </span>
            )}
        </span>
    );
}
