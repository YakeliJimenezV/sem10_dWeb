
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { RickMortyCharacter } from "@/types/rickmorty";

export const revalidate = 864000;
export const dynamicParams = true;

const API_URL = "https://rickandmortyapi.com/api/character";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchWithRetry(
  url: string,
  attempts = 4
): Promise<Response> {
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const response = await fetch(url, {
      next: { revalidate: 864000 },
    });

    if (response.ok || response.status === 404) {
      return response;
    }

    if (response.status !== 429 && response.status < 500) {
      throw new Error(`Error HTTP ${response.status}`);
    }

    if (attempt === attempts) {
      throw new Error(
        `No se pudo consultar la API. HTTP ${response.status}`
      );
    }

    const retryAfter = Number(
      response.headers.get("retry-after")
    );

    const delay =
      Number.isFinite(retryAfter) && retryAfter > 0
        ? retryAfter * 1000
        : attempt * 2000;

    await wait(delay);
  }

  throw new Error("No se pudo consultar la API");
}

export async function generateStaticParams() {
  return Array.from({ length: 20 }, (_, index) => ({
    id: String(index + 1),
  }));
}

async function getCharacter(
  id: string
): Promise<RickMortyCharacter> {
  if (!/^[1-9]\d*$/.test(id)) {
    notFound();
  }

  const response = await fetchWithRetry(`${API_URL}/${id}`);

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    throw new Error(
      `No se pudo cargar el personaje. HTTP ${response.status}`
    );
  }

  return response.json();
}

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await getCharacter(id);

  const statusColor =
    character.status === "Alive"
      ? "bg-green-400"
      : character.status === "Dead"
        ? "bg-red-400"
        : "bg-slate-400";

  const statusText =
    character.status === "Alive"
      ? "Vivo"
      : character.status === "Dead"
        ? "Muerto"
        : "Desconocido";

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030b13] text-white">
      {/* Luces decorativas */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-green-500/10 blur-[120px]" />
        <div className="absolute right-1/4 top-[700px] h-80 w-80 rounded-full bg-purple-500/10 blur-[120px]" />
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
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-green-300"
        >
          ← Volver al multiverso
        </Link>

        {/* Encabezado */}
        <div className="mt-8">
          <span className="text-xs font-bold tracking-[0.25em] text-green-400">
            ARCHIVO DEL MULTIVERSO
          </span>

          <h1 className="mt-3 text-3xl font-black sm:text-5xl">
            Detalles del{" "}
            <span className="text-green-400">
              personaje
            </span>
          </h1>

          <p className="mt-3 text-slate-400">
            Información completa de este habitante del multiverso.
          </p>
        </div>

        {/* Imagen y ficha */}
        <div className="mt-10 grid gap-7 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="overflow-hidden rounded-3xl border border-green-400/25 bg-[#0a1d28] p-4 shadow-[0_15px_50px_rgba(0,0,0,0.3)]">
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={character.image}
                alt={character.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />

              <span className="absolute left-4 top-4 rounded-full bg-[#06121b]/85 px-4 py-2 text-sm font-bold text-white backdrop-blur-md">
                #{character.id}
              </span>

              <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-[#06121b]/85 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${statusColor}`}
                />
                {statusText}
              </span>
            </div>

            <div className="mt-4 rounded-2xl border border-green-400/15 bg-green-400/5 p-4 text-center">
              <p className="text-xs font-bold tracking-[0.2em] text-green-400">
                IDENTIFICACIÓN
              </p>

              <h2 className="mt-2 text-2xl font-black">
                {character.name}
              </h2>
            </div>
          </div>

          {/* Información principal */}
          <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-[#0d2630] via-[#0a1b27] to-[#081521] p-6 shadow-[0_15px_50px_rgba(0,0,0,0.25)] sm:p-9">
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-green-400/10 blur-[80px]" />

            <div className="relative">
              <span className="rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-xs font-bold text-green-300">
                PERSONAJE #{character.id}
              </span>

              <h2 className="mt-6 text-3xl font-black sm:text-4xl">
                {character.name}
              </h2>

              <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${statusColor}`}
                />
                <span className="text-sm font-semibold">
                  {statusText}
                </span>
              </div>

              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                <DetailCard
                  label="Especie"
                  value={character.species}
                  icon="🧬"
                />

                <DetailCard
                  label="Tipo"
                  value={character.type || "Sin especificar"}
                  icon="🔬"
                />

                <DetailCard
                  label="Género"
                  value={character.gender}
                  icon="👤"
                />

                <DetailCard
                  label="Origen"
                  value={character.origin.name}
                  icon="🌍"
                />

                <DetailCard
                  label="Ubicación actual"
                  value={character.location.name}
                  icon="📍"
                />

                <DetailCard
                  label="Cantidad de episodios"
                  value={String(character.episode.length)}
                  icon="🎬"
                />
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-400/15 bg-[#06121b]/70 p-5">
                <p className="text-sm text-slate-400">
                  Fecha de creación del registro
                </p>

                <p className="mt-2 font-bold text-cyan-300">
                  {new Date(
                    character.created
                  ).toLocaleDateString("es-PE")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Información adicional */}
        <section className="mt-9 rounded-3xl border border-cyan-400/15 bg-[#0a1d28] p-6 sm:p-9">
          <div className="mb-7">
            <span className="text-xs font-bold tracking-[0.2em] text-green-400">
              DATOS DE LA API
            </span>

            <h2 className="mt-3 text-2xl font-black sm:text-3xl">
              Información{" "}
              <span className="text-cyan-300">
                adicional
              </span>
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <DataRow
              label="ID"
              value={String(character.id)}
            />

            <DataRow
              label="URL del personaje"
              value={character.url}
            />

            <DataRow
              label="URL del origen"
              value={character.origin.url || "No disponible"}
            />

            <DataRow
              label="URL de ubicación"
              value={character.location.url || "No disponible"}
            />
          </div>
        </section>

        {/* Episodios */}
        <section className="mt-9 rounded-3xl border border-green-400/20 bg-gradient-to-br from-[#0b2426] to-[#091522] p-6 sm:p-9">
          <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-green-400">
                AVENTURAS DEL MULTIVERSO
              </span>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                Episodios en los que{" "}
                <span className="text-green-400">
                  aparece
                </span>
              </h2>

              <p className="mt-3 text-sm text-slate-400">
                Selecciona un episodio para conocer sus detalles.
              </p>
            </div>

            <span className="rounded-full border border-green-400/20 bg-green-400/10 px-5 py-2 text-sm font-bold text-green-300">
              {character.episode.length} episodios
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {character.episode.map((episodeUrl) => {
              const episodeId = episodeUrl.split("/").pop();

              return (
                <Link
                  key={episodeUrl}
                  href={`/rick-morty/episodio/${episodeId}`}
                  className="group flex items-center justify-between rounded-xl border border-green-400/15 bg-[#06121b]/80 px-4 py-4 transition hover:-translate-y-1 hover:border-green-400/70 hover:bg-green-400/10"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-400/10 text-lg">
                      ▶
                    </span>

                    <span className="text-sm font-bold text-slate-200 group-hover:text-green-300">
                      Episodio {episodeId}
                    </span>
                  </div>

                  <span className="text-green-400 transition group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <footer className="mt-12 text-center text-sm text-slate-500">
          Rick & Morty Multiverse · Información de Rick and Morty API
        </footer>
      </div>
    </main>
  );
}

function DetailCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#06121b]/70 p-5">
      <span className="text-2xl">{icon}</span>
      <p className="mt-3 text-xs font-semibold text-slate-400">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function DataRow({
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

      <p className="break-all text-sm font-medium text-cyan-300">
        {value}
      </p>
    </div>
  );
}
