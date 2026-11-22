"use client";

import { useState } from "react";
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

export function BarraNavegacao({ categorias }: BarraNavegacaoProps) {
  const pathname = usePathname();
  const [menuMultimidiaAberto, setMenuMultimidiaAberto] = useState(false);

  const multimidiaAtivo =
    pathname === "/categoria/galeria-de-fotos" ||
    pathname === "/categoria/galeria-de-videos" ||
    pathname === "/categoria/multimidia";

  const linkClass = (ativo: boolean) =>
    `whitespace-nowrap transition ${
      ativo
        ? "font-bold text-white underline underline-offset-4"
        : "text-blue-200 hover:text-white"
    }`;

  return (
    <nav className="bg-blue-950 border-t border-blue-800 relative z-30">
      <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center flex-wrap gap-4 text-sm">
        <Link href="/" className={linkClass(pathname === "/")}>
          Início
        </Link>

        <Link
          href="/ultimasNoticias"
          className={linkClass(pathname === "/ultimasNoticias")}
        >
          Notícias
        </Link>

        {categorias.map((cat) => {
          if (cat.slug === "noticia" || SLUGS_MULTIMIDIA.has(cat.slug)) {
            return null;
          }
          const href = `/categoria/${cat.slug}`;
          return (
            <Link
              key={cat._id}
              href={href}
              className={linkClass(pathname === href)}
            >
              {cat.titulo}
            </Link>
          );
        })}

        <div
          className="relative"
          onMouseEnter={() => setMenuMultimidiaAberto(true)}
          onMouseLeave={() => setMenuMultimidiaAberto(false)}
        >
          <button
            type="button"
            onClick={() => setMenuMultimidiaAberto((prev) => !prev)}
            aria-expanded={menuMultimidiaAberto}
            className={`${linkClass(multimidiaAtivo)} inline-flex items-center gap-1 cursor-pointer`}
          >
            <span>Multimídia</span>
            <span className="text-xs" aria-hidden="true">
              ▾
            </span>
          </button>

          {menuMultimidiaAberto && (
            <div className="absolute left-0 top-full pt-1.5 w-52 z-40">
              <div className="rounded-lg bg-white py-1.5 shadow-lg border border-slate-200 text-slate-800">
                <Link
                  href="/categoria/galeria-de-fotos"
                  onClick={() => setMenuMultimidiaAberto(false)}
                  className={`block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-900 transition ${
                    pathname === "/categoria/galeria-de-fotos"
                      ? "font-bold text-blue-900 bg-blue-50/70"
                      : ""
                  }`}
                >
                  Galeria de Fotos
                </Link>
                <Link
                  href="/categoria/galeria-de-videos"
                  onClick={() => setMenuMultimidiaAberto(false)}
                  className={`block px-4 py-2 text-sm hover:bg-blue-50 hover:text-blue-900 transition ${
                    pathname === "/categoria/galeria-de-videos"
                      ? "font-bold text-blue-900 bg-blue-50/70"
                      : ""
                  }`}
                >
                  Galeria de Vídeos
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}