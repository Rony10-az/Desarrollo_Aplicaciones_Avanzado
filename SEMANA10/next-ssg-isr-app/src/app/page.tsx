import { redirect } from 'next/navigation';

// La página de inicio del sitio es Rick and Morty
export default function Home() {
    redirect('/RickandMorty');
}
