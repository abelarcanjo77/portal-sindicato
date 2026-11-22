import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  filtrarCategoriasVisiveis,
  getCategoriaPorSlug,
  getCategorias,
  getNoticiasPorCategoriaPaginada,
} from "@/sanity/lib/queries";
import { Paginacao } from "@/app/components/Paginacao";
import { CabecalhoPortal } from "@/app/components/CabecalhoPortal";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoria = await getCategoriaPorSlug(slug);

  if (!categoria) {
    return {
      title: "Categoria não encontrada | Portal do Sindicato",
      description:
        "A editoria solicitada não foi encontrada no Portal do Sindicato.",
    };
  }

  const titulo = categoria.titulo;
  const descricao = `Acompanhe as últimas notícias, conquistas e atualizações sobre ${categoria.titulo} no Portal do Sindicato.`;

  return {
    title: titulo,
    description: descricao,
    openGraph: {
      title: titulo,
      description: descricao,
      type: "website",
    },
  };
}

function formatarData(dataIso?: string) {
  if (!dataIso) return "";
  return new Date(dataIso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoriaPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const paginaAtual = Math.max(1, Number(page) || 1);
  const porPagina = 6;

  const [categoria, resultado, todasCategorias] = await Promise.all([
    getCategoriaPorSlug(slug),
    getNoticiasPorCategoriaPaginada(slug, paginaAtual, porPagina),
    getCategorias(),
  ]);

  const { noticias, total } = resultado;
  const totalPaginas = Math.ceil(total / porPagina);

  if (!categoria) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <CabecalhoPortal categorias={todasCategorias} />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 border-b border-slate-200 pb-4 flex items-center gap-3">
          <span
            className="inline-block h-6 w-2 rounded-full"
            style={{ backgroundColor: categoria.cor || "#1D4ED8" }}
          />
          <h1 className="text-3xl font-bold text-slate-900">
            {categoria.titulo}
          </h1>
        </div>

        {noticias.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
            Nenhuma matéria publicada nesta categoria até o momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((noticia) => {
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
                          <time className="text-xs text-slate-500 shrink-0">
                            {formatarData(noticia.dataPublicacao)}
                          </time>

                          {categoriasNoticia.length > 0 && (
                            <div className="flex flex-wrap justify-end gap-1">
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
                          )}
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
        )}

        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          baseUrl={`/categoria/${slug}`}
        />
      </main>
    </div>
  );
}