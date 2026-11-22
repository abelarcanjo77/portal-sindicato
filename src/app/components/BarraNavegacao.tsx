"use client";

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

export function BarraNavegacao({ categorias }: BarraNavegacaoProps) {
  const pathname = usePathname();

  const linkClass = (ativo: boolean) =>
    `whitespace-nowrap transition ${
      ativo
        ? "font-bold text-white underline underline-offset-4"
        : "text-blue-200 hover:text-white"
    }`;

  return (
    <nav className="bg-blue-950 border-t border-blue-800">
      <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center gap-4 overflow-x-auto text-sm">
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
          if (cat.slug === "noticia") return null;
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
      </div>
    </nav>
  );
}