import Link from "next/link";
import Image from "next/image";
import { buscarNoticias, getCategorias } from "@/sanity/lib/queries";
import { Paginacao } from "@/app/components/Paginacao";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

const ITENS_POR_PAGINA = 9;

function formatarData(dataIso: string) {
  if (!dataIso) return "";
  return new Date(dataIso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function BuscaPage({ searchParams }: PageProps) {
  const { q, page } = await searchParams;
  const termo = q?.trim() || "";
  const paginaAtual = Math.max(1, Number(page) || 1);

  const [todosResultados, categorias] = await Promise.all([
    termo ? buscarNoticias(termo) : Promise.resolve([]),
    getCategorias(),
  ]);

  const totalResultados = todosResultados.length;
  const totalPaginas = Math.ceil(totalResultados / ITENS_POR_PAGINA);
  const paginaValida =
    totalPaginas > 0 ? Math.min(paginaAtual, totalPaginas) : 1;

  const inicio = (paginaValida - 1) * ITENS_POR_PAGINA;
  const resultados = todosResultados.slice(inicio, inicio + ITENS_POR_PAGINA);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-blue-900 text-white shadow">
        <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link
            href="/"
            className="text-2xl font-bold tracking-tight hover:text-blue-200 transition"
          >
            Portal do Sindicato
          </Link>
          <form action="/busca" method="GET" className="flex w-full md:w-96 gap-2">
            <input
              type="text"
              name="q"
              defaultValue={termo}
              placeholder="Buscar matérias, tags ou temas..."
              className="flex-1 rounded-lg bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-lg bg-blue-700 hover:bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition cursor-pointer"
            >
              Buscar
            </button>
          </form>
        </div>

        <nav className="bg-blue-950 border-t border-blue-800">
          <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center gap-4 overflow-x-auto text-sm">
            <Link
              href="/"
              className="text-blue-200 hover:text-white whitespace-nowrap transition"
            >
              Início
            </Link>
            <Link
              href="/ultimasNoticias"
              className="text-blue-200 hover:text-white whitespace-nowrap transition"
            >
              Notícias
            </Link>
            {categorias.map((cat) => {
              if (cat.slug === "noticia") return null;
              return (
                <Link
                  key={cat._id}
                  href={`/categoria/${cat.slug}`}
                  className="text-blue-200 hover:text-white whitespace-nowrap transition"
                >
                  {cat.titulo}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">
          {termo ? (
            <>
              Resultados para{" "}
              <span className="text-blue-800">&ldquo;{termo}&rdquo;</span> (
              {totalResultados})
            </>
          ) : (
            "Pesquisar no Portal"
          )}
        </h1>

        {!termo ? (
          <p className="text-slate-600">
            Digite uma palavra-chave na barra acima para encontrar notícias ou
            tags publicadas.
          </p>
        ) : resultados.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
            Nenhuma matéria encontrada para &ldquo;{termo}&rdquo;.
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resultados.map((noticia) => (
                <article
                  key={noticia._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col"
                >
                  <Link
                    href={`/noticias/${noticia.slug}`}
                    className="group flex-1 flex flex-col"
                  >
                    <div className="relative h-48 w-full bg-slate-200">
                      {noticia.imagemUrl ? (
                        <Image
                          src={noticia.imagemUrl}
                          alt={noticia.titulo}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-slate-400 text-sm">
                          Sem imagem
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          {noticia.categoria && (
                            <span
                              className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                              style={{
                                backgroundColor:
                                  noticia.categoria.cor || "#1D4ED8",
                              }}
                            >
                              {noticia.categoria.titulo}
                            </span>
                          )}
                          <time className="text-xs text-slate-500">
                            {formatarData(noticia.dataPublicacao)}
                          </time>
                        </div>
                        <h2 className="font-bold text-lg text-slate-900 group-hover:text-blue-800 transition line-clamp-2">
                          {noticia.titulo}
                        </h2>
                        {noticia.resumo && (
                          <p className="mt-2 text-sm text-slate-600 line-clamp-3">
                            {noticia.resumo}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            <Paginacao
              paginaAtual={paginaValida}
              totalPaginas={totalPaginas}
              baseUrl={`/busca?q=${encodeURIComponent(termo)}`}
            />
          </>
        )}
      </main>
    </div>
  );
}