'use client';

import Image from 'next/image';
import { useEffect, useState, type FormEvent } from 'react';
import { spineColorFor } from './spineColor';
import { authorPhotoFor } from './authorPhotos';
import { CloseIcon } from './icons';
import type { AuthorBase, AuthorFormValues } from './types';
import { emptyAuthorForm } from './types';

type Mode = 'edit' | 'create';

type Props = {
    mode: Mode;
    author: AuthorBase | null;
    onClose: () => void;
    onSubmit: (values: AuthorFormValues) => Promise<{ error?: string } | void>;
};

function authorToForm(author: AuthorBase | null): AuthorFormValues {
    if (!author) return emptyAuthorForm;
    return {
        name: author.name,
        email: author.email,
        bio: author.bio ?? '',
        nationality: author.nationality ?? '',
        birthYear: author.birthYear?.toString() ?? '',
        photoUrl: author.photoUrl ?? '',
    };
}

export function AuthorModal({ mode, author, onClose, onSubmit }: Props) {
    const [revealed, setRevealed] = useState(false);
    const [form, setForm] = useState<AuthorFormValues>(() => authorToForm(author));
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [previewFailed, setPreviewFailed] = useState(false);

    useEffect(() => {
        const raf = requestAnimationFrame(() => setRevealed(true));
        function onKey(event: KeyboardEvent) {
            if (event.key === 'Escape') handleClose();
        }
        document.addEventListener('keydown', onKey);
        document.body.style.overflow = 'hidden';
        return () => {
            cancelAnimationFrame(raf);
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = '';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function handleClose() {
        setRevealed(false);
        setTimeout(onClose, 220);
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        if (!form.name.trim() || !form.email.trim()) {
            setError('El nombre y el correo son obligatorios.');
            return;
        }
        setSaving(true);
        setError(null);
        const result = await onSubmit(form);
        setSaving(false);
        if (result?.error) setError(result.error);
    }

    const spine = spineColorFor(form.name || 'nuevo-autor');
    const initial = (form.name.trim()[0] ?? 'A').toUpperCase();
    const previewPhoto = form.photoUrl.trim() || authorPhotoFor(form.name);
    const showPreviewPhoto = Boolean(previewPhoto) && !previewFailed;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200"
            style={{ opacity: revealed ? 1 : 0 }}
        >
            <div aria-hidden="true" onClick={handleClose} className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm" />

            <div
                role="dialog"
                aria-modal="true"
                aria-label={mode === 'create' ? 'Nuevo autor' : `Editar ${author?.name}`}
                className="relative grid w-full max-w-xl grid-cols-1 overflow-hidden rounded-[1.5rem] bg-stone-50 shadow-[0_40px_80px_-20px_rgba(28,25,23,0.55)] transition-transform duration-220 ease-[cubic-bezier(0.16,1,0.3,1)] sm:grid-cols-[0.55fr_1fr]"
                style={{ transform: revealed ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(8px)' }}
            >
                <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Cerrar"
                    className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-stone-900/5 text-stone-700 transition-colors hover:bg-stone-900/10 active:scale-95"
                >
                    <CloseIcon className="h-4 w-4" />
                </button>

                <div
                    className="relative flex min-h-[140px] flex-col justify-end overflow-hidden p-7 sm:min-h-full"
                    style={{ backgroundColor: spine.bg, color: spine.fg }}
                >
                    {showPreviewPhoto && (
                        <>
                            <Image
                                src={previewPhoto!}
                                alt=""
                                fill
                                unoptimized={Boolean(form.photoUrl.trim())}
                                sizes="(min-width: 640px) 220px, 100vw"
                                className="object-cover object-top"
                                onError={() => setPreviewFailed(true)}
                            />
                            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </>
                    )}
                    {!showPreviewPhoto && <span className="relative font-serif text-5xl">{initial}</span>}
                    <p className={`relative mt-2 text-xs uppercase tracking-[0.2em] ${showPreviewPhoto ? 'text-white/70' : 'opacity-60'}`}>
                        {mode === 'create' ? 'Nuevo autor' : 'Editar autor'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-7">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="a-name" className="text-xs font-medium uppercase tracking-wide text-stone-500">
                            Nombre
                        </label>
                        <input
                            id="a-name"
                            value={form.name}
                            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                            placeholder="Isabel Allende"
                            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-amber-700"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="a-email" className="text-xs font-medium uppercase tracking-wide text-stone-500">
                            Correo
                        </label>
                        <input
                            id="a-email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                            placeholder="autor@example.com"
                            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-amber-700"
                            required
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="a-photoUrl" className="text-xs font-medium uppercase tracking-wide text-stone-500">
                            Foto (URL)
                        </label>
                        <input
                            id="a-photoUrl"
                            type="url"
                            value={form.photoUrl}
                            onChange={(e) => {
                                setPreviewFailed(false);
                                setForm((f) => ({ ...f, photoUrl: e.target.value }));
                            }}
                            placeholder="https://..."
                            className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-amber-700"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="a-nationality" className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                Nacionalidad
                            </label>
                            <input
                                id="a-nationality"
                                value={form.nationality}
                                onChange={(e) => setForm((f) => ({ ...f, nationality: e.target.value }))}
                                placeholder="Chile"
                                className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-amber-700"
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="a-birthYear" className="text-xs font-medium uppercase tracking-wide text-stone-500">
                                Ano de nacimiento
                            </label>
                            <input
                                id="a-birthYear"
                                type="number"
                                value={form.birthYear}
                                onChange={(e) => setForm((f) => ({ ...f, birthYear: e.target.value }))}
                                placeholder="1942"
                                className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-amber-700"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="a-bio" className="text-xs font-medium uppercase tracking-wide text-stone-500">
                            Biografia
                        </label>
                        <textarea
                            id="a-bio"
                            value={form.bio}
                            onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                            rows={3}
                            placeholder="Breve nota biografica..."
                            className="resize-none rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm text-stone-800 outline-none transition-colors focus:border-amber-700"
                        />
                    </div>

                    {error && <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</p>}

                    <div className="mt-1 flex gap-3">
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-stone-900 px-5 py-2.5 text-sm font-medium text-stone-50 transition-all active:scale-[0.98] hover:bg-stone-800 disabled:opacity-60"
                        >
                            {saving ? (
                                <>
                                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-stone-50/40 border-t-stone-50" />
                                    Guardando
                                </>
                            ) : mode === 'create' ? (
                                'Agregar autor'
                            ) : (
                                'Guardar cambios'
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={handleClose}
                            className="rounded-full border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
