import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getNoticiaPorSlug } from "@/sanity/lib/queries";
import { CorpoMateria } from "@/app/components/CorpoMateria";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await getNoticiaPorSlug(slug);

  if (!noticia) {
    return {
      title: "Matéria não encontrada | Portal do Sindicato",
      description: "A matéria solicitada não foi encontrada no Portal do Sindicato.",
    };
  }

  const titulo = `${noticia.titulo} | Portal do Sindicato`;
  const descricao =
    noticia.resumo ||
    "Acompanhe as notícias, conquistas e comunicados oficiais no Portal do Sindicato.";

  return {
    title: titulo,
    description: descricao,
    keywords: noticia.tags && noticia.tags.length > 0 ? noticia.tags : undefined,
    openGraph: {
      title: noticia.titulo,
      description: descricao,
      type: "article",
      publishedTime: noticia.dataPublicacao || undefined,
      section: noticia.categoria?.titulo || undefined,
      tags: noticia.tags && noticia.tags.length > 0 ? noticia.tags : undefined,
      images: noticia.imagemUrl
        ? [
            {
              url: noticia.imagemUrl,
              alt: noticia.titulo,
            },
          ]
        : [],
    },
    twitter: {
      card: noticia.imagemUrl ? "summary_large_image" : "summary",
      title: noticia.titulo,
      description: descricao,
      images: noticia.imagemUrl ? [noticia.imagemUrl] : [],
    },
  };
}

function formatarDataCompleta(dataIso: string) {
  if (!dataIso) return "";
  return new Date(dataIso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function NoticiaPage({ params }: PageProps) {
  const { slug } = await params;
  const noticia = await getNoticiaPorSlug(slug);

  if (!noticia) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Barra Superior */}
      <header className="bg-blue-900 text-white shadow">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-bold text-lg hover:text-blue-200 transition">
            ← Portal do Sindicato
          </Link>
          <Link
            href="/studio"
            className="text-xs bg-blue-800 hover:bg-blue-700 px-3 py-1.5 rounded border border-blue-700 transition"
          >
            Editar no Studio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-10">
        <article className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-10">
          {/* Categoria e Data */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            {noticia.categoria && (
              <Link
                href={`/categoria/${noticia.categoria.slug}`}
                className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded text-white"
                style={{ backgroundColor: noticia.categoria.cor || "#1D4ED8" }}
              >
                {noticia.categoria.titulo}
              </Link>
            )}
            <time className="text-sm text-slate-500">
              Publicado em {formatarDataCompleta(noticia.dataPublicacao)}
            </time>
          </div>

          {/* Título e Resumo */}
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            {noticia.titulo}
          </h1>

          {noticia.resumo && (
            <p className="mt-4 text-xl text-slate-600 leading-relaxed border-b border-slate-200 pb-6">
              {noticia.resumo}
            </p>
          )}

          {/* Imagem de Capa */}
          {noticia.imagemUrl && (
            <div className="relative my-8 h-72 md:h-[460px] w-full overflow-hidden rounded-xl bg-slate-100">
              <Image
                src={noticia.imagemUrl}
                alt={noticia.titulo}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Corpo Rico da Matéria (Parágrafos, Fotos, Vídeos, Galerias, PDFs) */}
          <div className="mt-8">
            <CorpoMateria conteudo={noticia.conteudo} />
          </div>

          {/* Tags da Matéria */}
          {noticia.tags && noticia.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-200 flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-slate-600 mr-1">
                Tags:
              </span>
              {noticia.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-slate-100 text-slate-700 text-xs font-medium px-3 py-1 rounded-full border border-slate-200"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>
    </div>
  );
}