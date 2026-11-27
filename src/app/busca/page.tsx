import Link from "next/link";
import Image from "next/image";
import {
  buscarNoticias,
  filtrarCategoriasVisiveis,
  getCategorias,
} from "@/sanity/lib/queries";
import { Paginacao } from "@/app/components/Paginacao";
import { CabecalhoPortal } from "../components/CabecalhoPortal";
import { RodapePortal } from "../components/RodapePortal";

interface PageProps {
  searchParams: Promise<{ q?: string; page?: string }>;
}

const ITENS_POR_PAGINA = 6;

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
      <CabecalhoPortal categorias={categorias}/>

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
              {resultados.map((noticia) => {
                const categoriasNoticia = filtrarCategoriasVisiveis(
                  noticia.categorias
                );

                return (
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
                            {categoriasNoticia.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {categoriasNoticia.map((cat, idx) => (
                                  <span
                                    key={cat._id ?? `${cat.slug}-${idx}`}
                                    className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                                    style={{
                                      backgroundColor: cat.cor || "#1D4ED8",
                                    }}
                                  >
                                    {cat.titulo}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span />
                            )}
                            <time className="text-xs text-slate-500 shrink-0">
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
                );
              })}
            </div>

            <Paginacao
              paginaAtual={paginaValida}
              totalPaginas={totalPaginas}
              baseUrl={`/busca?q=${encodeURIComponent(termo)}`}
            />
          </>
        )}
      </main>

      <div className="bg-slate-900 text-slate-100 pt-6">
        <p className="px-4 text-center text-sm sm:text-base text-amber-300/90">
          Este site é apenas um objeto de estudo de programação, nenhuma das
          informações presentes são reais.
        </p>
        <RodapePortal/>
      </div>
    </div>
  );
}