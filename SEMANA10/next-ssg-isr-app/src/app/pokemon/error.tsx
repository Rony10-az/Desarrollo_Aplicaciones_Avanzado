'use client' // Los error boundaries deben ser Client Components

import { useEffect } from 'react'
import Link from 'next/link'
import { IoRefresh, IoWarning, IoHome } from 'react-icons/io5'

export default function PokemonError({
    error,
    retry,
}: {
    error: unknown
    retry: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="flex items-center justify-center px-6 py-12 min-h-[calc(100vh-80px)]">
            <div className="w-full max-w-2xl bg-white text-gray-700 rounded-3xl shadow-2xl overflow-hidden">
                {/* Franja superior estilo Pokéball */}
                <div className="relative bg-red-500 h-40 flex items-center justify-center">
                    <IoWarning size={80} className="text-white drop-shadow-lg" />
                    <div className="absolute -bottom-10 w-20 h-20 rounded-full bg-white border-8 border-gray-800 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-gray-800" />
                    </div>
                </div>

                <div className="px-10 pt-16 pb-12 text-center">
                    <h2 className="text-4xl font-bold text-gray-800">
                        No pudimos cargar los Pokémon
                    </h2>
                    <p className="mt-4 text-lg text-gray-500 max-w-md mx-auto">
                        Hubo un problema al conectar con la Pokédex. Verifica tu
                        conexión e inténtalo nuevamente.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => retry()}
                            className="inline-flex items-center justify-center gap-2 bg-purple-700 text-white text-lg font-semibold px-8 py-3.5 rounded-xl hover:bg-purple-800 transition cursor-pointer"
                        >
                            <IoRefresh size={24} /> Reintentar
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-lg font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-200 transition"
                        >
                            <IoHome size={24} /> Inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
