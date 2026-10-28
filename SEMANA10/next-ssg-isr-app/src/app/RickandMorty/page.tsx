import { getCharacters } from './api';
import Hero from './Hero';

/*
 * Portada: solo el Hero. Cruzar el portal y explorar personajes son
 * páginas aparte a las que se llega con clic, no con scroll.
 */
export default async function RickAndMortyPage() {
    const data = await getCharacters(1);

    return <Hero total={data.info.count} />;
}
