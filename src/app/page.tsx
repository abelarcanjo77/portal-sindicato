import Link from "next/link";
import Image from "next/image";
import {
  getCategorias,
  getNoticiasDestaque,
  getUltimasNoticias,
} from "@/sanity/lib/queries";
import { CabecalhoPortal } from "./components/CabecalhoPortal";

function formatarData(dataIso: string) {
  if (!dataIso) return "";
  return new Date(dataIso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function HomePage() {
  const [destaques, ultimas, categorias] = await Promise.all([
    getNoticiasDestaque(),
    getUltimasNoticias(),
    getCategorias(),
  ]);

  const manchetePrincipal = destaques[0];
  const destaquesSecundarios = destaques.slice(1, 3);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      
      <CabecalhoPortal categorias={categorias} />

      <main className="mx-auto max-w-6xl px-4 py-8 space-y-12">
        {/* Secção de Destaques */}
        {manchetePrincipal && (
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Manchete Principal */}
              <article className="lg:col-span-2 bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col">
                <Link href={`/noticias/${manchetePrincipal.slug}`} className="group block">
                  <div className="relative h-72 md:h-96 w-full bg-slate-200">
                    {manchetePrincipal.imagemUrl ? (
                      <Image
                        src={manchetePrincipal.imagemUrl}
                        alt={manchetePrincipal.titulo}
                        fill
                        className="object-cover group-hover:scale-105 transition duration-300"
                        priority
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-slate-400">
                        Sem imagem de capa
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                      {manchetePrincipal.categoria && (
                        <span
                          className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded text-white"
                          style={{
                            backgroundColor:
                              manchetePrincipal.categoria.cor || "#1D4ED8",
                          }}
                        >
                          {manchetePrincipal.categoria.titulo}
                        </span>
                      )}
                      <time className="text-xs text-slate-500">
                        {formatarData(manchetePrincipal.dataPublicacao)}
                      </time>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 group-hover:text-blue-800 transition">
                      {manchetePrincipal.titulo}
                    </h2>
                    {manchetePrincipal.resumo && (
                      <p className="mt-3 text-slate-600 line-clamp-3">
                        {manchetePrincipal.resumo}
                      </p>
                    )}
                  </div>
                </Link>
              </article>

              {/* Destaques Secundários */}
              <div className="flex flex-col gap-6">
                {destaquesSecundarios.map((item) => (
                  <article
                    key={item._id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex-1"
                  >
                    <Link href={`/noticias/${item.slug}`} className="group block h-full">
                      <div className="relative h-40 w-full bg-slate-200">
                        {item.imagemUrl && (
                          <Image
                            src={item.imagemUrl}
                            alt={item.titulo}
                            fill
                            className="object-cover group-hover:scale-105 transition duration-300"
                          />
                        )}
                      </div>
                      <div className="p-4">
                        {item.categoria && (
                          <span
                            className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white mb-2"
                            style={{
                              backgroundColor: item.categoria.cor || "#1D4ED8",
                            }}
                          >
                            {item.categoria.titulo}
                          </span>
                        )}
                        <h3 className="font-bold text-lg leading-snug group-hover:text-blue-800 transition">
                          {item.titulo}
                        </h3>
                        <time className="block mt-2 text-xs text-slate-500">
                          {formatarData(item.dataPublicacao)}
                        </time>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Grelha de Últimas Notícias */}
        <section>
          <div className="border-b-2 border-blue-900 pb-2 mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-wide text-blue-950">
              Últimas Notícias
            </h2>
          </div>

          {ultimas.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
              Nenhuma matéria publicada ainda. Aceda a{" "}
              <Link href="/studio" className="text-blue-700 underline font-medium">
                /studio
              </Link>{" "}
              para publicar a primeira notícia.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ultimas.map((noticia) => (
                <article
                  key={noticia._id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col"
                >
                  <Link href={`/noticias/${noticia.slug}`} className="group flex-1 flex flex-col">
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
                        <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-800 transition line-clamp-2">
                          {noticia.titulo}
                        </h3>
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
        </section>
      </main>
      <footer className="mx-auto px-4 py-8 space-y-12 bg-gray-200">
          <div className="flex justify-center mx-auto max-w-6xl">
            <span className="font-semibold text-xl">ATENÇÃO! - Esse site é apenas um componente para treino e estudo de programação. Nenhum conteúdo é real.</span>
          </div>
      </footer>
    </div>
  );
}