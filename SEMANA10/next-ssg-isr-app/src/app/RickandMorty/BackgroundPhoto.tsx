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
}: {
    src: string;
    alt?: string;
    priority?: boolean;
    focusClassName?: string;
}) {
    return (
        <div className="absolute inset-0 overflow-hidden">
            <Image
                src={src}
                alt=""
                fill
                aria-hidden
                sizes="100vw"
                className="scale-125 object-cover opacity-70 blur-3xl"
            />
            <div className="absolute inset-y-0 left-1/2 w-full max-w-3xl -translate-x-1/2">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    priority={priority}
                    sizes="768px"
                    className={`object-cover ${focusClassName}`}
                />
            </div>
        </div>
    );
}
