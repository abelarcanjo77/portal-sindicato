"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface CategoriaNav {
  _id: string;
  titulo: string;
  slug: string;
}

interface BarraNavegacaoProps {
  categorias: CategoriaNav[];
}

const SLUGS_MULTIMIDIA = new Set([
  "multimidia",
  "galeria-de-fotos",
  "galeria-de-videos",
]);

const SLUGS_EXCLUIDOS_SUB_NOTICIAS = new Set([
  "noticia",
  "noticias",
  "multimidia",
  "galeria-de-fotos",
  "galeria-de-videos",
]);

export function BarraNavegacao({ categorias }: BarraNavegacaoProps) {
  const pathname = usePathname();
  const [menuAberto, setMenuAberto] = useState<"noticias" | "multimidia" | null>(
    null
  );
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [noticiasMobileAberto, setNoticiasMobileAberto] = useState(true);
  const [multimidiaMobileAberto, setMultimidiaMobileAberto] = useState(true);
  const [pathnameAnterior, setPathnameAnterior] = useState(pathname);
  const navRef = useRef<HTMLDivElement>(null);

  if (pathnameAnterior !== pathname) {
    setPathnameAnterior(pathname);
    setMenuAberto(null);
    setMenuMobileAberto(false);
  }

  const subcategoriasNoticias = categorias.filter(
    (cat) => !SLUGS_EXCLUIDOS_SUB_NOTICIAS.has(cat.slug)
  );

  const noticiasAtivo =
    pathname === "/ultimasNoticias" ||
    subcategoriasNoticias.some((cat) => pathname === `/categoria/${cat.slug}`);

  const multimidiaAtivo =
    pathname === "/categoria/galeria-de-fotos" ||
    pathname === "/categoria/galeria-de-videos" ||
    pathname === "/categoria/multimidia";

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuAberto(null);
        setMenuMobileAberto(false);
      }
    }

    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMenuAberto(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const linkDesktopClass = (ativo: boolean) =>
    `relative whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
      ativo
        ? "bg-white/15 text-white shadow-xs ring-1 ring-white/25"
        : "text-blue-100 hover:bg-white/10 hover:text-white"
    }`;

  const tituloMobileAtual = multimidiaAtivo
    ? "Multimídia"
    : pathname === "/"
      ? "Início"
      : pathname === "/ultimasNoticias"
        ? "Todas as notícias"
        : subcategoriasNoticias.find((c) => `/categoria/${c.slug}` === pathname)
            ?.titulo || "Menu";

  return (
    <nav
      ref={navRef}
      aria-label="Navegação principal"
      className="relative z-30 border-t border-blue-800/80 bg-blue-950/95 backdrop-blur-xs"
    >
      <div className="mx-auto max-w-6xl px-4">
        {/* Barra Desktop */}
        <div className="hidden md:flex items-center justify-between py-2 gap-2">
          <div className="flex items-center flex-wrap gap-1.5">
            <Link href="/" className={linkDesktopClass(pathname === "/")}>
              Início
            </Link>

            {/* Dropdown Notícias + Subcategorias */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setMenuAberto((prev) =>
                    prev === "noticias" ? null : "noticias"
                  )
                }
                aria-expanded={menuAberto === "noticias"}
                aria-haspopup="menu"
                className={`${linkDesktopClass(noticiasAtivo)} inline-flex items-center gap-1.5 cursor-pointer`}
              >
                <span>Notícias</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    menuAberto === "noticias" ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {menuAberto === "noticias" && (
                <div
                  role="menu"
                  className="absolute left-0 top-full mt-2 w-64 origin-top-left rounded-xl border border-slate-200 bg-white p-1.5 text-slate-800 shadow-xl ring-1 ring-black/5 z-50"
                >
                  <Link
                    role="menuitem"
                    href="/ultimasNoticias"
                    onClick={() => setMenuAberto(null)}
                    className={`flex items-center justify-between rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                      pathname === "/ultimasNoticias"
                        ? "bg-blue-50 text-blue-900"
                        : "text-slate-900 hover:bg-slate-50"
                    }`}
                  >
                    <span>Todas as notícias</span>
                    <span className="text-xs text-slate-400">→</span>
                  </Link>

                  {subcategoriasNoticias.length > 0 && (
                    <div className="my-1 border-t border-slate-100" />
                  )}

                  <div className="max-h-72 overflow-y-auto space-y-0.5">
                    {subcategoriasNoticias.map((cat) => {
                      const href = `/categoria/${cat.slug}`;
                      const ativo = pathname === href;
                      return (
                        <Link
                          key={cat._id}
                          role="menuitem"
                          href={href}
                          onClick={() => setMenuAberto(null)}
                          className={`block rounded-lg px-3.5 py-2 text-sm transition ${
                            ativo
                              ? "bg-blue-50 font-semibold text-blue-900"
                              : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                          }`}
                        >
                          {cat.titulo}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Dropdown Multimídia */}
            <div className="relative">
              <button
                type="button"
                onClick={() =>
                  setMenuAberto((prev) =>
                    prev === "multimidia" ? null : "multimidia"
                  )
                }
                aria-expanded={menuAberto === "multimidia"}
                aria-haspopup="menu"
                className={`${linkDesktopClass(multimidiaAtivo)} inline-flex items-center gap-1.5 cursor-pointer`}
              >
                <span>Multimídia</span>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${
                    menuAberto === "multimidia" ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {menuAberto === "multimidia" && (
                <div
                  role="menu"
                  className="absolute left-0 top-full mt-2 w-64 origin-top-left rounded-xl border border-slate-200 bg-white p-1.5 text-slate-800 shadow-xl ring-1 ring-black/5 z-50"
                >
                  <Link
                    role="menuitem"
                    href="/categoria/galeria-de-fotos"
                    onClick={() => setMenuAberto(null)}
                    className={`flex flex-col rounded-lg px-3.5 py-2.5 transition ${
                      pathname === "/categoria/galeria-de-fotos"
                        ? "bg-blue-50 text-blue-900"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm font-semibold">
                      Galeria de Fotos
                    </span>
                    <span className="text-xs text-slate-500">
                      Coberturas, assembleias e registros
                    </span>
                  </Link>

                  <Link
                    role="menuitem"
                    href="/categoria/galeria-de-videos"
                    onClick={() => setMenuAberto(null)}
                    className={`mt-0.5 flex flex-col rounded-lg px-3.5 py-2.5 transition ${
                      pathname === "/categoria/galeria-de-videos"
                        ? "bg-blue-50 text-blue-900"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm font-semibold">
                      Galeria de Vídeos
                    </span>
                    <span className="text-xs text-slate-500">
                      Entrevistas, atos e transmissões
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Barra Mobile */}
        <div className="flex md:hidden items-center justify-between py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-200">
            {tituloMobileAtual}
          </span>

          <button
            type="button"
            onClick={() => setMenuMobileAberto((prev) => !prev)}
            aria-expanded={menuMobileAberto}
            aria-label={menuMobileAberto ? "Fechar menu" : "Abrir menu"}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-900/90 px-3 py-1.5 text-sm font-medium text-white ring-1 ring-blue-700/80 active:bg-blue-800 transition cursor-pointer"
          >
            <span>{menuMobileAberto ? "Fechar" : "Menu"}</span>
            {menuMobileAberto ? (
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Painel Expansível Mobile */}
        {menuMobileAberto && (
          <div className="md:hidden border-t border-blue-800/70 py-3 space-y-2">
            <Link
              href="/"
              onClick={() => setMenuMobileAberto(false)}
              className={`block rounded-lg px-3.5 py-2.5 text-sm font-medium transition ${
                pathname === "/"
                  ? "bg-white/15 text-white font-semibold"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              Início
            </Link>

            {/* Acordeão Notícias + Subcategorias no Mobile */}
            <div className="pt-1 border-t border-blue-800/70">
              <button
                type="button"
                onClick={() => setNoticiasMobileAberto((prev) => !prev)}
                aria-expanded={noticiasMobileAberto}
                className="flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition cursor-pointer"
              >
                <span>Notícias</span>
                <svg
                  className={`h-4 w-4 text-blue-200 transition-transform duration-200 ${
                    noticiasMobileAberto ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {noticiasMobileAberto && (
                <div className="mt-1 ml-3 space-y-1 border-l-2 border-blue-700 pl-3">
                  <Link
                    href="/ultimasNoticias"
                    onClick={() => setMenuMobileAberto(false)}
                    className={`block rounded-lg px-3 py-2 text-sm font-medium transition ${
                      pathname === "/ultimasNoticias"
                        ? "bg-white/15 text-white font-semibold"
                        : "text-blue-100 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Todas as notícias
                  </Link>

                  {subcategoriasNoticias.map((cat) => {
                    const href = `/categoria/${cat.slug}`;
                    const ativo = pathname === href;
                    return (
                      <Link
                        key={cat._id}
                        href={href}
                        onClick={() => setMenuMobileAberto(false)}
                        className={`block rounded-lg px-3 py-2 text-sm transition ${
                          ativo
                            ? "bg-white/15 text-white font-semibold"
                            : "text-blue-200 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {cat.titulo}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Acordeão Multimídia no Mobile */}
            <div className="pt-1 border-t border-blue-800/70">
              <button
                type="button"
                onClick={() => setMultimidiaMobileAberto((prev) => !prev)}
                aria-expanded={multimidiaMobileAberto}
                className="flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition cursor-pointer"
              >
                <span>Multimídia</span>
                <svg
                  className={`h-4 w-4 text-blue-200 transition-transform duration-200 ${
                    multimidiaMobileAberto ? "rotate-180" : ""
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {multimidiaMobileAberto && (
                <div className="mt-1 ml-3 space-y-1 border-l-2 border-blue-700 pl-3">
                  <Link
                    href="/categoria/galeria-de-fotos"
                    onClick={() => setMenuMobileAberto(false)}
                    className={`block rounded-lg px-3 py-2 text-sm transition ${
                      pathname === "/categoria/galeria-de-fotos"
                        ? "bg-white/15 text-white font-semibold"
                        : "text-blue-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Galeria de Fotos
                  </Link>
                  <Link
                    href="/categoria/galeria-de-videos"
                    onClick={() => setMenuMobileAberto(false)}
                    className={`block rounded-lg px-3 py-2 text-sm transition ${
                      pathname === "/categoria/galeria-de-videos"
                        ? "bg-white/15 text-white font-semibold"
                        : "text-blue-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    Galeria de Vídeos
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}