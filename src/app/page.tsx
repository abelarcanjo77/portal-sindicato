import Link from "next/link";
import Image from "next/image";
import {
  filtrarCategoriasVisiveis,
  getBannersDestaque,
  getCategorias,
  getConfiguracoesPortal,
  getNoticiasDestaque,
  getPopupAviso,
  getUltimasNoticias,
} from "@/sanity/lib/queries";
import { CabecalhoPortal } from "./components/CabecalhoPortal";
import { CarrosselBanners } from "./components/CarrosselBanners";
import { PopupEntrada } from "./components/PopupEntrada";
import { RodapePortal } from "@/app/components/RodapePortal";

function formatarData(dataIso: string) {
  if (!dataIso) return "";
  return new Date(dataIso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function HomePage() {
  const [banners, destaques, ultimas, categorias, popup, configPortal] =
    await Promise.all([
      getBannersDestaque(),
      getNoticiasDestaque(),
      getUltimasNoticias(),
      getCategorias(),
      getPopupAviso(),
      getConfiguracoesPortal(),
    ]);

  const manchetePrincipal = destaques[0];
  const destaquesSecundarios = destaques.slice(1, 3);
  const categoriasManchete = filtrarCategoriasVisiveis(
    manchetePrincipal?.categorias
  );

  const idsEmDestaque = new Set(
    [manchetePrincipal, ...destaquesSecundarios]
      .filter(Boolean)
      .map((item) => item._id)
  );

  const noticiasFiltradas = ultimas.filter(
    (noticia) => !idsEmDestaque.has(noticia._id)
  );
  const noticiasParaExibir =
    noticiasFiltradas.length >= 3 ? noticiasFiltradas : ultimas;

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900">
      <PopupEntrada popup={popup} />
      <CabecalhoPortal
        categorias={categorias}
        logoUrl={configPortal?.logoUrl}
        logoAlt={configPortal?.logoAlt || configPortal?.nomeSindicato}
        tituloPortal={configPortal?.tituloCabecalho || configPortal?.nomeSindicato}
        subtituloPortal={configPortal?.descricaoCabecalho}
        redesSociais={configPortal?.redesSociais}
      />

      {/* Painel rotativo de banners no topo da Home */}
      <CarrosselBanners banners={banners} />

      <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6 sm:py-8 space-y-10">
        {/* Secção de Destaques */}
        {manchetePrincipal && (
          <section aria-label="Notícias em destaque">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Manchete Principal */}
              <article className="lg:col-span-8 bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex flex-col">
                <Link
                  href={`/noticias/${manchetePrincipal.slug}`}
                  className="group flex-1 flex flex-col"
                >
                  <div className="relative h-56 sm:h-64 md:h-72 w-full bg-slate-200 overflow-hidden">
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

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                        <div className="flex flex-wrap gap-1.5">
                          {categoriasManchete.map((cat, idx) => (
                            <span
                              key={cat._id ?? `${cat.slug}-${idx}`}
                              className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded text-white"
                              style={{
                                backgroundColor: cat.cor || "#1D4ED8",
                              }}
                            >
                              {cat.titulo}
                            </span>
                          ))}
                        </div>

                        <time className="flex items-center gap-1.5 text-xs text-slate-500">
                          <span aria-hidden="true">🗓️</span>
                          {formatarData(manchetePrincipal.dataPublicacao)}
                        </time>
                      </div>

                      <h2 className="text-xl sm:text-2xl md:text-[26px] font-bold leading-snug text-slate-900 group-hover:text-blue-800 transition">
                        {manchetePrincipal.titulo}
                      </h2>

                      {manchetePrincipal.resumo && (
                        <p className="mt-2.5 text-sm sm:text-base text-slate-600 line-clamp-2">
                          {manchetePrincipal.resumo}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              </article>

              {/* Destaques Secundários */}
              <div className="lg:col-span-4 flex flex-col gap-5">
                {destaquesSecundarios.map((item) => {
                  const categoriasItem = filtrarCategoriasVisiveis(
                    item.categorias
                  );

                  return (
                    <article
                      key={item._id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 flex-1"
                    >
                      <Link
                        href={`/noticias/${item.slug}`}
                        className="group flex flex-col h-full"
                      >
                        <div className="relative h-32 sm:h-36 w-full bg-slate-200 overflow-hidden">
                          {item.imagemUrl ? (
                            <Image
                              src={item.imagemUrl}
                              alt={item.titulo}
                              fill
                              className="object-cover group-hover:scale-105 transition duration-300"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 text-xs">
                              Sem imagem
                            </div>
                          )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col justify-between">
                          <div>
                            {categoriasItem.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-1.5">
                                {categoriasItem.map((cat, idx) => (
                                  <span
                                    key={cat._id ?? `${cat.slug}-${idx}`}
                                    className="inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded text-white"
                                    style={{
                                      backgroundColor: cat.cor || "#1D4ED8",
                                    }}
                                  >
                                    {cat.titulo}
                                  </span>
                                ))}
                              </div>
                            )}

                            <h3 className="font-bold text-base leading-snug text-slate-900 group-hover:text-blue-800 transition line-clamp-2">
                              {item.titulo}
                            </h3>
                          </div>

                          <time className="block mt-2 text-xs text-slate-500">
                            {formatarData(item.dataPublicacao)}
                          </time>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* Grelha de Últimas Notícias */}
        <section aria-label="Últimas notícias">
          <div className="border-b-2 border-blue-900 pb-2 mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold uppercase tracking-wide text-blue-950">
              Últimas Notícias
            </h2>
          </div>

          {noticiasParaExibir.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
              Nenhuma matéria publicada ainda. Aceda a{" "}
              <Link
                href="/studio"
                className="text-blue-700 underline font-medium"
              >
                /studio
              </Link>{" "}
              para publicar a primeira notícia.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {noticiasParaExibir.slice(0, 6).map((noticia) => {
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
                      <div className="relative h-44 w-full bg-slate-200 overflow-hidden">
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

                          <h3 className="font-bold text-lg leading-snug text-slate-900 group-hover:text-blue-800 transition line-clamp-2">
                            {noticia.titulo}
                          </h3>

                          {noticia.resumo && (
                            <p className="mt-2 text-sm text-slate-600 line-clamp-2">
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

          <div className="mt-8">
            <Link
              href="/ultimasNoticias"
              className="flex w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-4 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-100 transition"
            >
              Ver todas as notícias →
            </Link>
          </div>
        </section>
      </main>

      <div className="bg-slate-900 text-slate-100 pt-6">
        <p className="px-4 text-center text-sm sm:text-base text-amber-300/90">
          Este site é apenas um objeto de estudo de programação, nenhuma das
          informações presentes são reais.
        </p>
        <RodapePortal />
      </div>
    </div>
  );
}