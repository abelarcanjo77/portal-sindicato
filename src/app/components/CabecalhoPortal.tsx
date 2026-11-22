import Link from "next/link";
import type { Categoria } from "@/sanity/lib/queries";
import { BarraNavegacao } from "./BarraNavegacao";
import Image from "next/image";

interface CabecalhoPortalProps {
  categorias: Categoria[];
  termoBusca?: string;
}

export function CabecalhoPortal({
  categorias,
  termoBusca = "",
}: CabecalhoPortalProps) {
  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="mx-auto max-w-6xl px-4 py-5 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0 flex items-center gap-3">
          <Image 
           src="img/logo-topo-site.svg"
           alt="logo do site"
           width={80}
           height={80}
           className="bg-white p-1 rounded-full"
          />
          <div>
            <Link
              href="/"
              className="inline-block text-2xl font-extrabold tracking-tight text-white hover:text-blue-200 transition"
            >
              Portal do Sindicato
            </Link>
            <p className="mt-0.5 text-sm text-blue-200/90">
              Informação, direitos e mobilização da categoria
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          <form
            action="/busca"
            method="GET"
            className="flex flex-1 sm:w-72 lg:w-80 gap-2"
          >
            <input
              type="text"
              name="q"
              defaultValue={termoBusca}
              placeholder="Buscar matérias, tags ou temas..."
              aria-label="Buscar matérias"
              className="min-w-0 flex-1 rounded-lg bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
            />
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-blue-950 hover:bg-blue-500 active:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition cursor-pointer"
            >
              Buscar
            </button>
          </form>

          <Link
            href="/studio"
            className="inline-flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/15 px-3.5 py-2 text-xs font-semibold text-blue-100 hover:text-white ring-1 ring-white/20 transition whitespace-nowrap"
          >
            Área do Editor
          </Link>
        </div>
      </div>

      {/* Barra de Categorias */}
      <BarraNavegacao categorias={categorias} />
    </header>
  );
}