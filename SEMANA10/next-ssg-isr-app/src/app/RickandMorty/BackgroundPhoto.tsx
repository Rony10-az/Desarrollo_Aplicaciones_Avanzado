import Image from 'next/image';

/*
 * Nuestras fotos de referencia son wallpapers de celular (angostas y
 * verticales, ~700px de ancho). Si se estiran con object-cover a todo el
 * ancho de un monitor (1920px+), se ven borrosas/pixeladas: hay que
 * agrandarlas mucho más de lo que su resolución real permite.
 *
 * Por eso cada fondo se arma en dos capas: una copia muy desenfocada que sí
 * cubre todo el ancho (la suavidad no se nota porque ya está borrosa), y la
 * foto nítida centrada en una franja angosta, cerca de su resolución real,
 * para que no pierda calidad.
 */
export default function BackgroundPhoto({
    src,
    alt = '',
    priority = false,
    focusClassName = '',
    wide = false,
}: {
    src: string;
    alt?: string;
    priority?: boolean;
    focusClassName?: string;
    // para tomas panorámicas (no un retrato de cerca): una franja nítida más
    // ancha, porque una foto de paisaje tolera mejor que se estire un poco y
    // así no queda tanto espacio desenfocado y vacío en pantallas anchas
    wide?: boolean;
}) {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <Image
                src={src}
                alt=""
                fill
                aria-hidden
                sizes="100vw"
                className="scale-110 object-cover opacity-90 blur-2xl"
            />
            <div
                className={`absolute inset-y-0 left-1/2 w-full -translate-x-1/2 ${wide ? 'max-w-6xl' : 'max-w-3xl'}`}
            >
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority={priority}
                    sizes={wide ? '1152px' : '768px'}
                    className={`object-cover ${focusClassName}`}
                />
            </div>
        </div>
    );
}
