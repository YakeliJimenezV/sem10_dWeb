
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type {
  RickMortyCharacter,
  RickMortyResponse,
} from "@/types/rickmorty";

interface Props {
  initialCharacters: RickMortyCharacter[];
}

const API_URL = "https://rickandmortyapi.com/api/character";
const MAX_PAGES = 5;

export default function RickMortySearch({
  initialCharacters,
}: Props) {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const [gender, setGender] = useState("");

  const [page, setPage] = useState(1);
  const [characters, setCharacters] =
    useState<RickMortyCharacter[]>(initialCharacters);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [total, setTotal] = useState<number | null>(null);
  const [availablePages, setAvailablePages] = useState(MAX_PAGES);

  const hasFilters = Boolean(
    name.trim() || status || type.trim() || gender
  );

  useEffect(() => {
    const controller = new AbortController();

    const timer = setTimeout(async () => {
      if (!hasFilters && page === 1) {
        setCharacters(initialCharacters);
        setTotal(null);
        setAvailablePages(MAX_PAGES);
        setLoading(false);
        setError("");
        return;
      }

      setLoading(true);
      setError("");

      const params = new URLSearchParams();
      params.set("page", String(page));

      if (name.trim()) params.set("name", name.trim());
      if (status) params.set("status", status);
      if (type.trim()) params.set("type", type.trim());
      if (gender) params.set("gender", gender);

      try {
        const response = await fetch(
          `${API_URL}?${params.toString()}`,
          { signal: controller.signal }
        );

        if (response.status === 404) {
          setCharacters([]);
          setTotal(0);
          setAvailablePages(1);
          return;
        }

        if (!response.ok) {
          throw new Error(
            `No se pudieron cargar los personajes. HTTP ${response.status}`
          );
        }

        const data: RickMortyResponse = await response.json();

        setCharacters(data.results);
        setTotal(data.info.count);
        setAvailablePages(
          Math.min(data.info.pages, MAX_PAGES)
        );
      } catch (err) {
        if (controller.signal.aborted) return;

        setError(
          err instanceof Error
            ? err.message
            : "Ocurrió un error al buscar personajes."
        );
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, hasFilters ? 400 : 0);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [
    name,
    status,
    type,
    gender,
    page,
    hasFilters,
    initialCharacters,
  ]);

  function resetPage() {
    setPage(1);
  }

  function clearFilters() {
    setName("");
    setStatus("");
    setType("");
    setGender("");
    setPage(1);
  }

  const inputClass =
    "w-full rounded-xl border border-cyan-400/15 bg-[#071923]/90 px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-green-400 focus:ring-2 focus:ring-green-400/10";

  return (
    <section>
      {/* Panel de búsqueda */}
      <div className="relative mb-10 overflow-hidden rounded-3xl border border-green-400/20 bg-gradient-to-br from-[#0d2630] via-[#0a1b27] to-[#0a1624] p-5 shadow-[0_15px_50px_rgba(0,0,0,0.25)] sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-60 w-60 rounded-full bg-green-400/10 blur-[80px]" />

        <div className="relative mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-green-400">
              SISTEMA DE EXPLORACIÓN
            </span>

            <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
              Encuentra tu{" "}
              <span className="text-green-400">
                personaje
              </span>
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Filtra personajes de cualquier dimensión
              en tiempo real.
            </p>
          </div>

          <span className="rounded-full border border-green-400/20 bg-green-400/10 px-4 py-2 text-xs font-semibold text-green-300">
            ● BÚSQUEDA EN VIVO
          </span>
        </div>

        <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Nombre */}
          <div>
            <label
              htmlFor="search-name"
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              Nombre
            </label>

            <input
              id="search-name"
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                resetPage();
              }}
              placeholder="Ej. Rick, Morty..."
              className={inputClass}
            />
          </div>

          {/* Estado */}
          <div>
            <label
              htmlFor="search-status"
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              Estado
            </label>

            <select
              id="search-status"
              value={status}
              onChange={(event) => {
                setStatus(event.target.value);
                resetPage();
              }}
              className={inputClass}
            >
              <option value="">Todos los estados</option>
              <option value="alive">Vivo</option>
              <option value="dead">Muerto</option>
              <option value="unknown">Desconocido</option>
            </select>
          </div>

          {/* Tipo */}
          <div>
            <label
              htmlFor="search-type"
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              Tipo
            </label>

            <input
              id="search-type"
              type="text"
              value={type}
              onChange={(event) => {
                setType(event.target.value);
                resetPage();
              }}
              placeholder="Ej. Robot..."
              className={inputClass}
            />
          </div>

          {/* Género */}
          <div>
            <label
              htmlFor="search-gender"
              className="mb-2 block text-sm font-semibold text-slate-200"
            >
              Género
            </label>

            <select
              id="search-gender"
              value={gender}
              onChange={(event) => {
                setGender(event.target.value);
                resetPage();
              }}
              className={inputClass}
            >
              <option value="">Todos los géneros</option>
              <option value="male">Masculino</option>
              <option value="female">Femenino</option>
              <option value="genderless">Sin género</option>
              <option value="unknown">Desconocido</option>
            </select>
          </div>
        </div>

        <div className="relative mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full border border-green-400/30 bg-green-400/10 px-6 py-3 text-sm font-bold text-green-300 transition hover:border-green-400 hover:bg-green-400/20"
          >
            ↻ Limpiar filtros
          </button>

          <p
            aria-live="polite"
            className="text-sm text-slate-300"
          >
            {loading ? (
              <span className="text-green-300">
                Explorando dimensiones...
              </span>
            ) : total === null ? (
              <>
                <span className="font-bold text-green-400">
                  {characters.length}
                </span>{" "}
                personajes en esta página
              </>
            ) : (
              <>
                <span className="font-bold text-green-400">
                  {total}
                </span>{" "}
                coincidencias · Mostrando {characters.length}
              </>
            )}
          </p>
        </div>
      </div>

      {/* Encabezado de resultados */}
      <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-white">
            Personajes del{" "}
            <span className="text-cyan-300">
              multiverso
            </span>
          </h3>

          <p className="mt-2 text-sm text-slate-400">
            Selecciona una tarjeta para descubrir
            todos sus detalles.
          </p>
        </div>

        <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold text-cyan-300">
          PÁGINA {page} / {availablePages}
        </div>
      </div>

      {/* Errores */}
      {error && (
        <div
          role="alert"
          className="mb-7 rounded-2xl border border-red-400/30 bg-red-500/10 p-5 text-red-200"
        >
          {error}
        </div>
      )}

      {/* Resultados */}
      {loading ? (
        <div className="rounded-3xl border border-green-400/10 bg-[#0a1925] py-20 text-center">
          <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-green-400/20 border-t-green-400" />

          <p className="font-semibold text-green-300">
            Buscando en el multiverso...
          </p>
        </div>
      ) : characters.length === 0 ? (
        <div className="rounded-3xl border border-green-400/10 bg-[#0a1925] px-6 py-20 text-center">
          <p className="text-5xl">🛸</p>

          <h3 className="mt-5 text-xl font-bold text-white">
            No encontramos personajes
          </h3>

          <p className="mt-3 text-slate-400">
            Intenta cambiar el nombre o los filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 xl:grid-cols-5">
          {characters.map((character) => {
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
              <Link
                key={character.id}
                href={`/rick-morty/${character.id}`}
                className="group overflow-hidden rounded-2xl border border-cyan-400/15 bg-[#0a1d28] shadow-[0_8px_25px_rgba(0,0,0,0.2)] transition duration-300 hover:-translate-y-2 hover:border-green-400/70 hover:shadow-[0_10px_35px_rgba(74,222,128,0.15)]"
              >
                <div className="relative aspect-square overflow-hidden bg-[#10241c]">
                  <Image
                    src={character.image}
                    alt={character.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                    className="object-cover transition duration-500 group-hover:scale-110"
                  />

                  <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-[#06121b]/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                    #{character.id}
                  </span>

                  <span className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/10 bg-[#06121b]/85 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                    <span
                      className={`h-2 w-2 rounded-full ${statusColor}`}
                    />
                    {statusText}
                  </span>
                </div>

                <div className="p-4">
                  <h4 className="truncate text-sm font-extrabold text-white transition group-hover:text-green-300 sm:text-base">
                    {character.name}
                  </h4>

                  <p className="mt-2 truncate text-xs text-slate-400">
                    {character.species}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
                    <span className="text-xs font-semibold text-green-400">
                      Ver detalles
                    </span>

                    <span className="text-green-400 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Paginación */}
      <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() =>
            setPage((current) => Math.max(1, current - 1))
          }
          disabled={page === 1 || loading}
          className="rounded-full border border-green-400/30 bg-[#0a1d28] px-5 py-3 text-sm font-bold text-green-300 transition hover:border-green-400 hover:bg-green-400/10 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Anterior
        </button>

        <div className="flex items-center gap-2">
          {Array.from(
            { length: availablePages },
            (_, index) => index + 1
          ).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              disabled={loading}
              aria-current={
                page === pageNumber ? "page" : undefined
              }
              className={`h-11 w-11 rounded-xl text-sm font-bold transition ${
                page === pageNumber
                  ? "bg-gradient-to-br from-green-400 to-cyan-400 text-[#06121b] shadow-[0_0_20px_rgba(74,222,128,0.3)]"
                  : "border border-white/10 bg-[#0a1d28] text-slate-300 hover:border-green-400/50 hover:text-green-300"
              }`}
            >
              {pageNumber}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={() =>
            setPage((current) =>
              Math.min(availablePages, current + 1)
            )
          }
          disabled={page >= availablePages || loading}
          className="rounded-full bg-gradient-to-r from-green-400 to-emerald-400 px-5 py-3 text-sm font-bold text-[#06121b] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente →
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-slate-500">
        Exploración limitada a 5 páginas.
        Los filtros consultan todos los personajes
        disponibles en la API.
      </p>
    </section>
  );
}
