
import Link from "next/link";
import {
  IoSearchOutline,
  IoArrowBackOutline,
} from "react-icons/io5";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center">

        {/* Icono de búsqueda */}
        <IoSearchOutline
          size={90}
          className="text-purple-600 mx-auto mb-4"
        />

        {/* Código de error */}
        <h1 className="text-7xl font-extrabold text-purple-700 mb-3">
          404
        </h1>

        {/* Mensaje principal */}
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          ¡Pokémon no encontrado!
        </h2>

        {/* Descripción */}
        <p className="text-gray-600 mb-8">
          Parece que el Pokémon o la página que buscas
          no existe en nuestra Pokédex.
        </p>

        {/* Botón para regresar */}
        <Link
          href="/pokemon"
          className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg transition"
        >
          <IoArrowBackOutline size={22} />
          Volver al Pokédex
        </Link>

      </div>
    </div>
  );
}
