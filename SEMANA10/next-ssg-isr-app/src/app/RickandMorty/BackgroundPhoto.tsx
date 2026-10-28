import Image from 'next/image';

/*
 * Nuestras fotos de referencia son wallpapers de celular angostos (~700px),
 * así que estiradas a pantalla completa pierden algo de nitidez. Probamos
 * una versión con una franja nítida al centro y los bordes desenfocados,
 * pero dejaba una costura dura donde empezaba la franja (y en pantallas
 * anchas un hueco vacío) — peor que la suavidad original. Una sola capa
 * con un desenfoque parejo y muy leve (se nota al mirar de cerca, no a
 * simple vista) evita la costura y queda pareja en cualquier ancho.
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
                alt={alt}
                fill
                priority={priority}
                sizes="100vw"
                className={`scale-105 object-cover ${focusClassName}`}
                style={{ filter: 'blur(1.5px)' }}
            />
        </div>
    );
}
