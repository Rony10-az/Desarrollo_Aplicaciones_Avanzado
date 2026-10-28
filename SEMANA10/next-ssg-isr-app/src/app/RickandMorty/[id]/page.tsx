import { Suspense } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllCharacterIds, getCharacter } from '../api';
import CharacterShowcase from '../CharacterShowcase';

interface CharacterPageProps {
    params: Promise<{ id: string }>;
}

/*
 * SSG: se generan en el build las rutas de los 826 personajes.
 * ISR: getCharacter usa revalidate de 10 días, así cada página se
 * regenera sola sin necesidad de volver a desplegar.
 */
export async function generateStaticParams() {
    const ids = await getAllCharacterIds();
    return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: CharacterPageProps): Promise<Metadata> {
    const { id } = await params;
    const character = await getCharacter(id);

    return {
        title: character ? `${character.name} - Rick and Morty` : 'Personaje no encontrado',
        description: character
            ? `${character.name}: ${character.species}, ${character.status}`
            : undefined,
    };
}

async function CharacterContent({ params }: CharacterPageProps) {
    const { id } = await params;
    const character = await getCharacter(id);

    if (!character) notFound();

    return (
        <>
            <CharacterShowcase character={character} />
            <div className="pb-12 text-center">
                <Link
                    href="/RickandMorty/lista"
                    className="inline-block rounded-xl border border-white/20 px-8 py-3 font-semibold text-white transition hover:bg-white/10 hover:scale-105"
                >
                    ← Volver a personajes
                </Link>
            </div>
        </>
    );
}

// params se lee dentro de <Suspense> para que Next pueda servir el shell al instante
export default function CharacterDetail({ params }: CharacterPageProps) {
    return (
        <Suspense
            fallback={
                <p className="p-8 text-center text-slate-400">Cargando personaje...</p>
            }
        >
            <CharacterContent params={params} />
        </Suspense>
    );
}
