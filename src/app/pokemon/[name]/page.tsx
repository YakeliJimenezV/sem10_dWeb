
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type {
  Pokemon,
  PokemonListResponse,
} from "@/types/pokemon";
import { IoArrowBackOutline } from "react-icons/io5";

// ISR: actualizar los datos cada 24 horas
export const revalidate = 86400;

// Generar las rutas estáticas de los 151 Pokémon
export async function generateStaticParams() {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=151"
  );

  if (!response.ok) {
    throw new Error("Error al obtener la lista de Pokémon");
  }

  const data: PokemonListResponse = await response.json();

  return data.results.map((pokemon) => ({
    name: pokemon.name,
  }));
}

// Obtener los detalles de un Pokémon
async function getPokemon(name: string): Promise<Pokemon> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${encodeURIComponent(name)}`,
    {
      next: { revalidate: 86400 },
    }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error("Error al cargar los detalles del Pokémon");
  }

  return response.json();
}

// Título dinámico para cada Pokémon
export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;

  return {
    title: `${name} | Pokédex Next.js`,
    description: `Información y estadísticas de ${name}`,
  };
}

// Página de detalles
export default async function PokemonDetail({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const pokemon = await getPokemon(name);

  const imageUrl =
    pokemon.sprites.other["official-artwork"].front_default ||
    pokemon.sprites.front_default;

  return (
    <main className="max-w-5xl mx-auto p-6 md:p-10">

      {/* Botón para regresar */}
      <Link
        href="/pokemon"
        className="inline-flex items-center gap-2 text-white hover:text-purple-200 mb-8 font-semibold"
      >
        <IoArrowBackOutline size={22} />
        Volver al Pokédex
      </Link>

      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Encabezado */}
        <div className="bg-purple-700 text-white text-center p-8">
          <h1 className="text-4xl font-bold capitalize">
            {pokemon.name}
          </h1>

          <p className="text-purple-200 text-xl mt-2">
            #{pokemon.id.toString().padStart(3, "0")}
          </p>
        </div>

        <div className="p-8">

          {/* Imagen */}
          <div className="flex justify-center mb-8">
            {imageUrl && (
              <Image
                src={imageUrl}
                alt={pokemon.name}
                width={280}
                height={280}
                className="object-contain"
                priority
              />
            )}
          </div>

          {/* Tipos */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Tipos
            </h2>

            <div className="flex justify-center gap-3 flex-wrap">
              {pokemon.types.map((item) => (
                <span
                  key={item.type.name}
                  className="bg-purple-100 text-purple-800 px-5 py-2 rounded-full font-semibold capitalize"
                >
                  {item.type.name}
                </span>
              ))}
            </div>
          </div>

          {/* Información general */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            <div className="bg-gray-100 rounded-xl p-6 text-center">
              <h3 className="text-gray-600 font-semibold">
                Altura
              </h3>
              <p className="text-2xl font-bold text-purple-700">
                {pokemon.height / 10} m
              </p>
            </div>

            <div className="bg-gray-100 rounded-xl p-6 text-center">
              <h3 className="text-gray-600 font-semibold">
                Peso
              </h3>
              <p className="text-2xl font-bold text-purple-700">
                {pokemon.weight / 10} kg
              </p>
            </div>
          </div>

          {/* Habilidades */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Habilidades
            </h2>

            <div className="flex flex-wrap gap-3">
              {pokemon.abilities.map((item) => (
                <span
                  key={item.ability.name}
                  className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg capitalize"
                >
                  {item.ability.name.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          </div>

          {/* Estadísticas */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Estadísticas
            </h2>

            <div className="space-y-5">
              {pokemon.stats.map((item) => (
                <div key={item.stat.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700 capitalize">
                      {item.stat.name.replace(/-/g, " ")}
                    </span>

                    <span className="font-bold text-purple-700">
                      {item.base_stat}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className="bg-purple-600 h-4 rounded-full"
                      style={{
                        width: `${Math.min(
                          (item.base_stat / 255) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
