import type { MetadataRoute } from "next";
import { client } from "@/sanity/lib/client";
import { getCategorias } from "@/sanity/lib/queries";

interface NoticiaSitemap {
  slug: string;
  _updatedAt?: string;
  dataPublicacao?: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://portal-sindicato.vercel.app";

  const [categorias, noticias] = await Promise.all([
    getCategorias(),
    client.fetch<NoticiaSitemap[]>(
      `*[_type == "noticia" && defined(slug.current)] | order(dataPublicacao desc) {
        "slug": slug.current,
        _updatedAt,
        dataPublicacao
      }`
    ),
  ]);

  const paginasEstaticas: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${baseUrl}/busca`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  const paginasCategorias: MetadataRoute.Sitemap = categorias.map((cat) => ({
    url: `${baseUrl}/categoria/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const paginasNoticias: MetadataRoute.Sitemap = noticias.map((noticia) => ({
    url: `${baseUrl}/noticias/${noticia.slug}`,
    lastModified: noticia._updatedAt
      ? new Date(noticia._updatedAt)
      : noticia.dataPublicacao
        ? new Date(noticia.dataPublicacao)
        : new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...paginasEstaticas, ...paginasCategorias, ...paginasNoticias];
}