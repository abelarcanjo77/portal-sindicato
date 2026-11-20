import Link from "next/link";
import type { Categoria } from "@/sanity/lib/queries";

interface CabecalhoPortalProps {
  categorias: Categoria[];
  categoriaAtivaSlug?: string;
  termoBusca?: string;
}

export function CabecalhoPortal({
  categorias,
  categoriaAtivaSlug,
  termoBusca = "",
}: CabecalhoPortalProps) {
  return (
    <header className="bg-blue-900 text-white shadow">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-blue-200 transition">
            Portal do Sindicato
          </Link>
          <p className="text-sm text-blue-200">
            Informação, direitos e mobilização da categoria
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
          <form action="/busca" method="GET" className="flex flex-1 sm:w-80 gap-2">
            <input
              type="text"
              name="q"
              defaultValue={termoBusca}
              placeholder="Buscar matérias, tags ou temas..."
              aria-label="Buscar matérias"
              className="flex-1 rounded-lg bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-700 hover:bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition cursor-pointer"
            >
              Buscar
            </button>
          </form>

          <Link
            href="/studio"
            className="text-center text-xs bg-blue-800 hover:bg-blue-700 px-3 py-2.5 rounded-lg border border-blue-700 transition whitespace-nowrap"
          >
            Área do Editor
          </Link>
        </div>
      </div>

      {/* Barra de Categorias */}
      <nav className="bg-blue-950 border-t border-blue-800">
        <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center gap-4 overflow-x-auto text-sm">
          <Link
            href="/"
            className={`whitespace-nowrap transition ${
              !categoriaAtivaSlug
                ? "font-bold text-white underline underline-offset-4"
                : "text-blue-200 hover:text-white"
            }`}
          >
            Início
          </Link>
          {categorias.map((cat) => {
            const ativa = cat.slug === categoriaAtivaSlug;
            return (
              <Link
                key={cat._id}
                href={`/categoria/${cat.slug}`}
                className={`whitespace-nowrap transition ${
                  ativa
                    ? "font-bold text-white underline underline-offset-4"
                    : "text-blue-200 hover:text-white"
                }`}
              >
                {cat.titulo}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}