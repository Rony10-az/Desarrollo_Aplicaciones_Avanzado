import { Metadata } from 'next';
import { getCharacters, getVariantCharacters } from '../api';
import CharacterSearch from '../CharacterSearch';

export const metadata: Metadata = {
    title: 'Personajes - Rick and Morty',
};

/*
 * Lista inicial: se obtiene en el servidor con cache: 'force-cache',
 * por lo que la respuesta se guarda en el build (SSG) y no se vuelve a
 * pedir a la API en cada visita. La búsqueda en tiempo real vive en el
 * componente cliente CharacterSearch (CSR).
 */
export default async function ListaPage() {
    const [data, variants] = await Promise.all([getCharacters(1), getVariantCharacters()]);

    return (
        <div className="pb-16">
            <CharacterSearch initialData={data} variants={variants} />
        </div>
    );
}
