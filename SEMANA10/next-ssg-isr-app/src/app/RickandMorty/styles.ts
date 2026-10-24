import { CharacterGender, CharacterStatus } from '@/types/rickandmorty';

export const statusStyles: Record<CharacterStatus, string> = {
    Alive: 'bg-green-500',
    Dead: 'bg-red-500',
    unknown: 'bg-gray-400',
};

export const statusLabels: Record<CharacterStatus, string> = {
    Alive: 'Vivo',
    Dead: 'Muerto',
    unknown: 'Desconocido',
};

export const genderLabels: Record<CharacterGender, string> = {
    Female: 'Femenino',
    Male: 'Masculino',
    Genderless: 'Sin género',
    unknown: 'Desconocido',
};
