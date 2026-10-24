
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { RickMortyCharacter } from "@/types/rickmorty";

export const revalidate = 864000;

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

async function getEpisode(id: string): Promise<Episode> {
  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const response = await fetch(
    `https://rickandmortyapi.com/api/episode/${id}`,
    { next: { revalidate: 864000 } }
  );

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(
      `No se pudo cargar el episodio. HTTP ${response.status}`
    );
  }

  return response.json();
}

async function getEpisodeCharacters(
  urls: string[]
): Promise<RickMortyCharacter[]> {
  const ids = urls
    .map((url) => url.split("/").pop())
    .filter((id): id is string => Boolean(id));

  if (ids.length === 0) return [];

  const response = await fetch(
    `https://rickandmortyapi.com/api/character/${ids.join(",")}`,
    { next: { revalidate: 864000 } }
  );

  if (!response.ok) return [];

  const data: RickMortyCharacter[] | RickMortyCharacter =
    await response.json();

  return Array.isArray(data) ? data : [data];
}

export default async function EpisodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const episode = await getEpisode(id);
  const characters = await getEpisodeCharacters(episode.characters);

  const season = Number(episode.episode.slice(1, 3));
  const episodeNumber = Number(episode.episode.slice(4, 6));

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030b13] text-white">
      {/* Fondo espacial */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-purple-500/15 blur-[120px]" />
        <div className="absolute left-1/3 top-[600px] h-96 w-96 rounded-full bg-green-500/10 blur-[120px]" />
      </div>

      {/* Navegación */}
      <header className="relative z-10 border-b border-white/10 bg-[#06121b]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5">
          <Link
            href="/rick-morty"
            className="text-xl font-black text-green-400 sm:text-2xl"
          >
            RICK <span className="text-cyan-300">&</span> MORTY
          </Link>

          <Link
            href="/rick-morty"
            className="rounded-full border border-green-400/30 bg-green-400/10 px-5 py-2 text-sm font-semibold text-green-300 hover:bg-green-400/20"
          >
            ← Personajes
          </Link>
        </nav>
      </header>

      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-10">
        <Link
          href="/rick-morty"
          className="text-sm font-semibold text-slate-400 transition hover:text-green-300"
        >
          ← Volver al multiverso
        </Link>

        {/* Portada del episodio */}
        <section className="relative mt-9 overflow-hidden rounded-3xl border border-green-400/20 bg-gradient-to-br from-[#123b30] via-[#0a2230] to-[#111329] p-7 shadow-[0_20px_70px_rgba(0,0,0,0.3)] sm:p-12">
          <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full border-[18px] border-green-400/20 shadow-[0_0_60px_rgba(74,222,128,0.2)]" />

          <div className="pointer-events-none absolute -right-8 top-8 h-52 w-52 rounded-full border-4 border-dashed border-green-300/20" />

          <div className="relative max-w-3xl">
            <span className="inline-flex rounded-full border border-green-400/30 bg-green-400/15 px-5 py-2 text-xs font-black tracking-[0.15em] text-green-300">
              EPISODIO #{episode.id}
            </span>

            <h1 className="mt-7 text-3xl font-black leading-tight sm:text-5xl">
              {episode.name}
            </h1>

            <p className="mt-5 max-w-xl text-slate-300">
              Descubre los detalles de este episodio y
              conoce a los personajes que participan
              en esta aventura del multiverso.
            </p>

            <div className="mt-9 grid gap-4 sm:grid-cols-3">
              <EpisodeInfo
                label="Temporada"
                value={String(season)}
                icon="🛸"
              />

              <EpisodeInfo
                label="Episodio"
                value={String(episodeNumber)}
                icon="🎬"
              />

              <EpisodeInfo
                label="Fecha de estreno"
                value={episode.air_date}
                icon="📅"
              />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-bold text-cyan-300">
                {episode.episode}
              </span>

              <span className="rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-300">
                {episode.characters.length} personajes
              </span>
            </div>
          </div>
        </section>

        {/* Personajes del episodio */}
        <section className="mt-12">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-green-400">
                EL ELENCO DEL MULTIVERSO
              </span>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Personajes que{" "}
                <span className="text-green-400">
                  aparecen
                </span>
              </h2>

              <p className="mt-3 text-slate-400">
                Selecciona un personaje para descubrir
                todos sus detalles.
              </p>
            </div>

            <span className="rounded-full border border-green-400/20 bg-green-400/10 px-5 py-2 text-sm font-bold text-green-300">
              {episode.characters.length} personajes
            </span>
          </div>

          {characters.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-[#0a1d28] p-10 text-center text-slate-300">
              No se pudieron cargar los personajes
              de este episodio en este momento.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {characters.map((character) => {
                const statusColor =
                  character.status === "Alive"
                    ? "bg-green-400"
                    : character.status === "Dead"
                      ? "bg-red-400"
                      : "bg-slate-400";

                return (
                  <Link
                    key={character.id}
                    href={`/rick-morty/${character.id}`}
                    className="group overflow-hidden rounded-2xl border border-cyan-400/15 bg-[#0a1d28] transition duration-300 hover:-translate-y-2 hover:border-green-400/70 hover:shadow-[0_10px_35px_rgba(74,222,128,0.15)]"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <Image
                        src={character.image}
                        alt={character.name}
                        fill
                        loading="lazy"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                        className="object-cover transition duration-500 group-hover:scale-110"
                      />

                      <span className="absolute left-3 top-3 rounded-full bg-[#06121b]/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                        #{character.id}
                      </span>
                    </div>

                    <div className="p-4">
                      <h3 className="truncate text-sm font-black text-white group-hover:text-green-300 sm:text-base">
                        {character.name}
                      </h3>

                      <p className="mt-2 truncate text-xs text-slate-400">
                        {character.species}
                      </p>

                      <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
                        <span
                          className={`h-2 w-2 rounded-full ${statusColor}`}
                        />

                        <span className="text-xs font-semibold text-slate-300">
                          {character.status}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Información técnica */}
        <section className="mt-12 rounded-3xl border border-cyan-400/15 bg-[#0a1d28] p-6 sm:p-8">
          <h2 className="text-xl font-black text-cyan-300">
            Información del episodio
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <TechnicalInfo
              label="ID del episodio"
              value={String(episode.id)}
            />

            <TechnicalInfo
              label="Código"
              value={episode.episode}
            />

            <TechnicalInfo
              label="URL de la API"
              value={episode.url}
            />

            <TechnicalInfo
              label="Fecha de creación del registro"
              value={new Date(
                episode.created
              ).toLocaleDateString("es-PE")}
            />
          </div>
        </section>

        <footer className="mt-12 text-center text-sm text-slate-500">
          Rick & Morty Multiverse · Datos de Rick and Morty API
        </footer>
      </div>
    </main>
  );
}

function EpisodeInfo({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#06121b]/60 p-5 backdrop-blur-sm">
      <span className="text-2xl">{icon}</span>

      <p className="mt-3 text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-2 break-words text-lg font-black text-white">
        {value}
      </p>
    </div>
  );
}

function TechnicalInfo({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#06121b]/70 p-5">
      <p className="mb-2 text-xs font-semibold text-slate-400">
        {label}
      </p>

      <p className="break-all text-sm font-semibold text-cyan-300">
        {value}
      </p>
    </div>
  );
}
