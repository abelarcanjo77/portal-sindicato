import { client } from "./client";

export interface Categoria {
  _id: string;
  titulo: string;
  slug: string;
  cor?: string;
}

export interface NoticiaResumo {
  _id: string;
  titulo: string;
  resumo?: string;
  slug: string;
  dataPublicacao: string;
  destaqueHome: boolean;
  imagemUrl?: string;
  categoria?: {
    titulo: string;
    slug: string;
    cor?: string;
  };
}

// Busca até 3 matérias marcadas como "Destaque Principal"
export async function getNoticiasDestaque(): Promise<NoticiaResumo[]> {
  const query = `*[_type == "noticia" && destaqueHome == true] | order(dataPublicacao desc)[0...3] {
    _id,
    titulo,
    resumo,
    "slug": slug.current,
    dataPublicacao,
    destaqueHome,
    "imagemUrl": imagemDestaque.asset->url,
    categoria->{
      titulo,
      "slug": slug.current,
      cor
    }
  }`;

  return client.fetch(query, {}, { next: { revalidate: 60 } });
}

// Busca as 9 matérias mais recentes (incluindo ou não destaques)
export async function getUltimasNoticias(): Promise<NoticiaResumo[]> {
  const query = `*[_type == "noticia"] | order(dataPublicacao desc)[0...9] {
    _id,
    titulo,
    resumo,
    "slug": slug.current,
    dataPublicacao,
    destaqueHome,
    "imagemUrl": imagemDestaque.asset->url,
    categoria->{
      titulo,
      "slug": slug.current,
      cor
    }
  }`;

  return client.fetch(query, {}, { next: { revalidate: 60 } });
}

// Busca todas as categorias para o menu/barra de navegação
export async function getCategorias(): Promise<Categoria[]> {
  const query = `*[_type == "categoria"] | order(titulo asc) {
    _id,
    titulo,
    "slug": slug.current,
    cor
  }`;

  return client.fetch(query, {}, { next: { revalidate: 60 } });
}

export interface NoticiaCompleta extends NoticiaResumo {
  tags?: string[];
  conteudo: any[];
}

export async function getNoticiaPorSlug(slug: string): Promise<NoticiaCompleta | null> {
  const query = `*[_type == "noticia" && slug.current == $slug][0] {
    _id,
    titulo,
    resumo,
    "slug": slug.current,
    dataPublicacao,
    destaqueHome,
    tags,
    "imagemUrl": imagemDestaque.asset->url,
    categoria->{
      titulo,
      "slug": slug.current,
      cor
    },
    conteudo[]{
      ...,
      _type == "image" => {
        ...,
        asset->
      },
      _type == "galeriaFotos" => {
        ...,
        imagens[]{
          ...,
          asset->
        }
      },
      _type == "pdfEmbutido" => {
        ...,
        arquivo{
          asset->
        }
      }
    }
  }`;

  return client.fetch(query, { slug }, { next: { revalidate: 60 } });
}

export async function getCategoriaPorSlug(slug: string): Promise<Categoria | null> {
  const query = `*[_type == "categoria" && slug.current == $slug][0] {
    _id,
    titulo,
    "slug": slug.current,
    cor
  }`;

  return client.fetch(query, { slug }, { next: { revalidate: 60 } });
}

export async function getNoticiasPorCategoria(slugCategoria: string): Promise<NoticiaResumo[]> {
  const query = `*[_type == "noticia" && categoria->slug.current == $slugCategoria] | order(dataPublicacao desc) {
    _id,
    titulo,
    resumo,
    "slug": slug.current,
    dataPublicacao,
    destaqueHome,
    "imagemUrl": imagemDestaque.asset->url,
    categoria->{
      titulo,
      "slug": slug.current,
      cor
    }
  }`;

  return client.fetch(query, { slugCategoria }, { next: { revalidate: 60 } });
}

export async function buscarNoticias(termo: string): Promise<NoticiaResumo[]> {
  const padrao = `*${termo}*`;
  const query = `*[_type == "noticia" && (
    titulo match $padrao ||
    resumo match $padrao ||
    $termo in tags
  )] | order(dataPublicacao desc) {
    _id,
    titulo,
    resumo,
    "slug": slug.current,
    dataPublicacao,
    destaqueHome,
    "imagemUrl": imagemDestaque.asset->url,
    categoria->{
      titulo,
      "slug": slug.current,
      cor
    }
  }`;

  return client.fetch(query, { termo, padrao }, { next: { revalidate: 60 } });
}