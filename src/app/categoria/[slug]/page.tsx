import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  getCategoriaPorSlug,
  getCategorias,
  getNoticiasPorCategoria,
} from "@/sanity/lib/queries";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categoria = await getCategoriaPorSlug(slug);

  if (!categoria) {
    return {
      title: "Categoria não encontrada | Portal do Sindicato",
      description: "A editoria solicitada não foi encontrada no Portal do Sindicato.",
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

function formatarData(dataIso: string) {
  if (!dataIso) return "";
  return new Date(dataIso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function CategoriaPage({ params }: PageProps) {
  const { slug } = await params;

  const [categoria, noticias, todasCategorias] = await Promise.all([
    getCategoriaPorSlug(slug),
    getNoticiasPorCategoria(slug),
    getCategorias(),
  ]);

  if (!categoria) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-blue-900 text-white shadow">
        <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <Link href="/" className="text-2xl font-bold tracking-tight hover:text-blue-200 transition">
            Portal do Sindicato
          </Link>
          <Link
            href="/studio"
            className="self-start md:self-auto text-xs bg-blue-800 hover:bg-blue-700 px-3 py-2 rounded border border-blue-700 transition"
          >
            Área do Editor
          </Link>
        </div>

        <nav className="bg-blue-950 border-t border-blue-800">
          <div className="mx-auto max-w-6xl px-4 py-2.5 flex items-center gap-4 overflow-x-auto text-sm">
            <Link href="/" className="text-blue-200 hover:text-white whitespace-nowrap transition">
              Início
            </Link>
            {todasCategorias.map((cat) => {
              const ativa = cat.slug === slug;
              return (
                <Link
                  key={cat._id}
                  href={`/categoria/${cat.slug}`}
                  className={`whitespace-nowrap transition ${
                    ativa ? "font-bold text-white underline underline-offset-4" : "text-blue-200 hover:text-white"
                  }`}
                >
                  {cat.titulo}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="mb-8 border-b border-slate-200 pb-4 flex items-center gap-3">
          <span
            className="inline-block h-6 w-2 rounded-full"
            style={{ backgroundColor: categoria.cor || "#1D4ED8" }}
          />
          <h1 className="text-3xl font-bold text-slate-900">{categoria.titulo}</h1>
        </div>

        {noticias.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500">
            Nenhuma matéria publicada nesta categoria até o momento.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {noticias.map((noticia) => (
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
                      <time className="block text-xs text-slate-500 mb-2">
                        {formatarData(noticia.dataPublicacao)}
                      </time>
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
      </main>
    </div>
  );
}