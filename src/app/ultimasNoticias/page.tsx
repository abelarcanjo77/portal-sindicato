import Image from "next/image";
import Link from "next/link";
import { Paginacao } from "@/app/components/Paginacao";
import { getCategorias, getTodasNoticiasPaginada } from "@/sanity/lib/queries";
import { CabecalhoPortal } from "../components/CabecalhoPortal";

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

function formatarData(dataIso?: string) {
  if (!dataIso) return "";
  return new Date(dataIso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function TodasNoticiasPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const paginaAtual = Math.max(1, Number(page) || 1);
  const porPagina = 9;

  const [resultado, categorias] = await Promise.all([
    getTodasNoticiasPaginada(paginaAtual, porPagina),
    getCategorias(),
  ]);

  const { noticias, total } = resultado;
  const totalPaginas = Math.ceil(total / porPagina);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
        
      <CabecalhoPortal categorias={categorias} />

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 border-b border-slate-200 pb-4 flex items-baseline justify-between gap-4">
          <h1 className="text-3xl font-bold text-slate-900">
            Todas as notícias
          </h1>
          <span className="text-sm text-slate-500">
            {total} {total === 1 ? "matéria" : "matérias"}
          </span>
        </div>

        {noticias.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
            Nenhuma matéria encontrada.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((noticia) => (
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
                      <div className="flex items-center justify-between gap-2 mb-2 text-xs">
                        <time className="text-slate-500">
                          {formatarData(noticia.dataPublicacao)}
                        </time>
                        {noticia.categoria?.titulo && (
                          <span 
                            style={{backgroundColor: `color-mix(in srgb, ${noticia.categoria.cor} 100%, transparent)`}} 
                            className="rounded-sm px-2.5 py-0.5 font-medium text-white"
                          >
                            {noticia.categoria.titulo}
                          </span>
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
            ))}
          </div>
        )}

        <Paginacao
          paginaAtual={paginaAtual}
          totalPaginas={totalPaginas}
          baseUrl="/noticias"
        />
      </main>
    </div>
  );
}