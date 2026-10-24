import { getCharacters } from './api';
import CharacterSearch from './CharacterSearch';
import Hero from './Hero';
import PortalTransition from './PortalTransition';

/*
 * Lista inicial: se obtiene en el servidor con cache: 'force-cache',
 * por lo que la respuesta se guarda en el build (SSG) y no se vuelve a
 * pedir a la API en cada visita. La búsqueda en tiempo real vive en el
 * componente cliente CharacterSearch (CSR).
 */
export default async function RickAndMortyPage() {
    const data = await getCharacters(1);

    return (
        <>
            <Hero total={data.info.count} />
            <PortalTransition />
            <div className="pb-16 pt-8">
                <CharacterSearch initialData={data} />
            </div>
        </>
    );
}
