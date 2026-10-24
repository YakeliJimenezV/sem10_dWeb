
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { IoWarningOutline, IoRefreshOutline } from "react-icons/io5";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error en Pokédex:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-lg w-full text-center">

        <IoWarningOutline
          size={90}
          className="text-red-500 mx-auto mb-5"
        />

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          ¡Ups! Algo salió mal
        </h1>

        <p className="text-gray-600 mb-8">
          Ocurrió un error al cargar la información de los Pokémon.
          Inténtalo nuevamente.
        </p>

        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-6 rounded-lg transition cursor-pointer"
        >
          <IoRefreshOutline size={22} />
          Reintentar
        </button>

        <div className="mt-6">
          <Link
            href="/"
            className="text-purple-700 hover:underline font-semibold"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
