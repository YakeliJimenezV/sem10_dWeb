
import Image from "next/image";
import Link from "next/link";
import RickMortySearch from "@/components/RickMortySearch";
import type { RickMortyResponse } from "@/types/rickmorty";

// ISR: revalidar los datos cada 10 días.
export const revalidate = 864000;

async function getCharacters(): Promise<RickMortyResponse> {
  const response = await fetch(
    "https://rickandmortyapi.com/api/character",
    {
      next: { revalidate: 864000 },
    }
  );

  if (!response.ok) {
    throw new Error(
      `No se pudieron cargar los personajes. HTTP ${response.status}`
    );
  }

  return response.json();
}

export default async function RickMortyPage() {
  const data = await getCharacters();

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#030b13] text-white">
      {/* Luces de fondo */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 top-28 h-96 w-96 rounded-full bg-cyan-500/10 blur-[110px]" />
        <div className="absolute -right-40 top-10 h-[500px] w-[500px] rounded-full bg-green-500/10 blur-[120px]" />
        <div className="absolute left-1/3 top-[700px] h-96 w-96 rounded-full bg-purple-500/10 blur-[120px]" />
      </div>

      {/* Barra de navegación */}
      <header className="relative z-20 border-b border-white/10 bg-[#06121b]/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5">
          <Link
            href="/rick-morty"
            className="text-xl font-black tracking-tight text-green-400 sm:text-2xl"
          >
            RICK <span className="text-cyan-300">&</span> MORTY
          </Link>

          <div className="flex items-center gap-3 sm:gap-7">
            <Link
              href="/rick-morty"
              className="rounded-full bg-green-400/10 px-4 py-2 text-sm font-semibold text-green-300"
            >
              Personajes
            </Link>

            <a
              href="#explorar"
              className="hidden text-sm text-gray-300 transition hover:text-green-300 sm:block"
            >
              Explorar
            </a>

            <span className="hidden rounded-full border border-green-400/20 px-4 py-2 text-xs text-green-300 md:inline-block">
              MULTIVERSO
            </span>
          </div>
        </nav>
      </header>

      {/* Portada principal */}
      <section className="relative mx-auto grid max-w-7xl items-center gap-10 px-5 pb-12 pt-14 lg:grid-cols-2 lg:pb-20 lg:pt-20">
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-green-400/30 bg-green-400/10 px-4 py-2 text-xs font-bold tracking-[0.2em] text-green-300">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
            BIENVENIDO AL MULTIVERSO
          </span>

          <h1 className="mt-8 text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Explora el
            <span className="mt-2 block bg-gradient-to-r from-green-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
              Multiverso
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
            Descubre personajes, conoce sus historias y
            explora las diferentes dimensiones del universo
            de Rick and Morty.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#explorar"
              className="rounded-full bg-gradient-to-r from-green-400 to-emerald-400 px-7 py-3.5 font-bold text-[#06121b] shadow-[0_0_30px_rgba(74,222,128,0.25)] transition hover:scale-105"
            >
              Explorar personajes →
            </a>

            <a
              href="#explorar"
              className="rounded-full border border-white/20 bg-white/5 px-7 py-3.5 font-semibold text-white transition hover:border-green-400/50 hover:bg-white/10"
            >
              Buscar personajes
            </a>
          </div>

          <div className="mt-12 flex flex-wrap gap-8 border-t border-white/10 pt-7">
            <div>
              <p className="text-3xl font-black text-green-300">
                {data.info.count}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Personajes
              </p>
            </div>

            <div>
              <p className="text-3xl font-black text-cyan-300">
                5
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Páginas para explorar
              </p>
            </div>

            <div>
              <p className="text-3xl font-black text-purple-300">
                10d
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Revalidación ISR
              </p>
            </div>
          </div>
        </div>

        {/* Portal y personajes */}
        <div className="relative mx-auto flex h-[390px] w-full max-w-[540px] items-center justify-center sm:h-[500px]">
          {/* Anillos del portal */}
          <div className="absolute h-[320px] w-[320px] rounded-full border-[12px] border-green-400/70 bg-gradient-to-br from-green-400/30 via-emerald-600/20 to-cyan-400/20 shadow-[0_0_45px_rgba(74,222,128,0.45),inset_0_0_65px_rgba(74,222,128,0.3)] sm:h-[420px] sm:w-[420px]" />

          <div className="absolute h-[275px] w-[275px] rounded-full border-[5px] border-lime-300/70 shadow-[0_0_35px_rgba(163,230,53,0.5)] sm:h-[365px] sm:w-[365px]" />

          <div className="absolute h-[225px] w-[225px] rounded-full border-[3px] border-dashed border-green-300/50 sm:h-[305px] sm:w-[305px]" />

          <div className="absolute h-[180px] w-[180px] rounded-full bg-green-400/20 blur-3xl sm:h-[270px] sm:w-[270px]" />

          {/* Personajes reales de la API */}
          <div className="relative z-10 flex items-end justify-center gap-3">
            <Link
              href="/rick-morty/1"
              className="group relative h-48 w-36 -rotate-6 overflow-hidden rounded-2xl border-2 border-green-300/70 bg-[#10241c] shadow-[0_0_30px_rgba(74,222,128,0.25)] transition hover:-translate-y-3 hover:rotate-0 sm:h-64 sm:w-48"
            >
              <Image
                src={data.results[0].image}
                alt={data.results[0].name}
                fill
                priority
                sizes="(max-width: 640px) 144px, 192px"
                className="object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-3 pb-3 pt-10 text-center text-sm font-bold">
                {data.results[0].name}
              </span>
            </Link>

            <Link
              href="/rick-morty/2"
              className="group relative h-48 w-36 rotate-6 overflow-hidden rounded-2xl border-2 border-cyan-300/70 bg-[#10241c] shadow-[0_0_30px_rgba(34,211,238,0.25)] transition hover:-translate-y-3 hover:rotate-0 sm:h-64 sm:w-48"
            >
              <Image
                src={data.results[1].image}
                alt={data.results[1].name}
                fill
                priority
                sizes="(max-width: 640px) 144px, 192px"
                className="object-cover"
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-3 pb-3 pt-10 text-center text-sm font-bold">
                {data.results[1].name}
              </span>
            </Link>
          </div>

          {/* Elementos espaciales decorativos */}
          <div className="absolute left-5 top-12 h-9 w-9 rounded-full bg-purple-500/40 shadow-[0_0_25px_rgba(168,85,247,0.5)]" />
          <div className="absolute right-8 top-24 h-5 w-5 rounded-full bg-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.5)]" />
          <div className="absolute bottom-12 right-10 h-12 w-12 rounded-full bg-green-400/20 blur-sm" />
        </div>
      </section>

      {/* Catálogo y filtros existentes */}
      <section
        id="explorar"
        className="relative z-10 mx-auto max-w-7xl scroll-mt-24 px-5 pb-20"
      >
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.25em] text-green-400">
              EXPLORA EL UNIVERSO
            </span>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Nuestros{" "}
              <span className="text-green-400">
                personajes
              </span>
            </h2>

            <p className="mt-3 text-slate-400">
              Encuentra a tus personajes favoritos
              usando los filtros.
            </p>
          </div>

          <span className="rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-sm text-green-300">
            5 páginas de exploración
          </span>
        </div>

        <RickMortySearch
          initialCharacters={data.results}
        />
      </section>

      {/* Pie de página */}
      <footer className="relative border-t border-white/10 bg-[#06121b]/70 px-5 py-8 text-center">
        <p className="text-sm text-slate-400">
          Rick & Morty Multiverse · Datos proporcionados
          por Rick and Morty API
        </p>
        <p className="mt-2 text-xs text-slate-500">
          Proyecto académico desarrollado con Next.js,
          Tailwind CSS, SSG, CSR e ISR.
        </p>
      </footer>
    </main>
  );
}
