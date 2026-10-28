import { Metadata } from 'next';
import PortalTransition from '../PortalTransition';

export const metadata: Metadata = {
    title: 'Cruzando el portal - Rick and Morty',
};

export default function PortalPage() {
    return <PortalTransition />;
}
