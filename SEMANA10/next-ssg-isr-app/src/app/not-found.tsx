import Link from "next/link";
import { IoHome, IoList, IoSearch } from "react-icons/io5";

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-linear-to-br from-gray-900 to-purple-900">
            <div className="w-full max-w-2xl bg-white text-gray-700 rounded-3xl shadow-2xl overflow-hidden">
                {/* Franja superior estilo Pokéball */}
                <div className="relative bg-red-500 h-40 flex items-center justify-center">
                    <IoSearch size={80} className="text-white drop-shadow-lg" />
                    <div className="absolute -bottom-10 w-20 h-20 rounded-full bg-white border-8 border-gray-800 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full bg-gray-800" />
                    </div>
                </div>

                <div className="px-10 pt-16 pb-12 text-center">
                    <p className="text-7xl font-extrabold text-purple-700">404</p>
                    <h1 className="mt-2 text-4xl font-bold text-gray-800">
                        Página no encontrada
                    </h1>
                    <p className="mt-4 text-lg text-gray-500 max-w-md mx-auto">
                        El Pokémon o la página que buscas no existe o se escapó
                        de la Pokédex.
                    </p>

                    <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center gap-2 bg-purple-700 text-white text-lg font-semibold px-8 py-3.5 rounded-xl hover:bg-purple-800 transition"
                        >
                            <IoHome size={24} /> Inicio
                        </Link>
                        <Link
                            href="/pokemon"
                            className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 text-lg font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-200 transition"
                        >
                            <IoList size={24} /> Ver Pokédex
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
