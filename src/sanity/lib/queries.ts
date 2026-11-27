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
  categorias?: Categoria[];
}

export interface NoticiaResumoCategoria {
  _id: string;
  titulo: string;
  slug: string;
  resumo?: string;
  dataPublicacao?: string;
  imagemUrl?: string;
  categorias?: Categoria[];
}

export interface ResultadoCategoriaPaginada {
  noticias: NoticiaResumoCategoria[];
  total: number;
}

const PROJECAO_CATEGORIAS = `"categorias": coalesce(categorias[]->{
  _id,
  titulo,
  "slug": slug.current,
  cor
}, [])`;

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
    ${PROJECAO_CATEGORIAS}
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
    ${PROJECAO_CATEGORIAS}
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

export interface BlocoPortableText {
  _key?: string;
  _type: string;
  [key: string]: unknown;
}

export interface NoticiaCompleta extends NoticiaResumo {
  tags?: string[];
  conteudo: BlocoPortableText[];
}

export async function getNoticiaPorSlug(
  slug: string
): Promise<NoticiaCompleta | null> {
  const query = `*[_type == "noticia" && slug.current == $slug][0] {
    _id,
    titulo,
    resumo,
    "slug": slug.current,
    dataPublicacao,
    destaqueHome,
    tags,
    "imagemUrl": imagemDestaque.asset->url,
    ${PROJECAO_CATEGORIAS},
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

export async function getCategoriaPorSlug(
  slug: string
): Promise<Categoria | null> {
  const query = `*[_type == "categoria" && slug.current == $slug][0] {
    _id,
    titulo,
    "slug": slug.current,
    cor
  }`;

  return client.fetch(query, { slug }, { next: { revalidate: 60 } });
}

export async function getNoticiasPorCategoria(
  slugCategoria: string
): Promise<NoticiaResumo[]> {
  const query = `*[_type == "noticia" && $slugCategoria in categorias[]->slug.current] | order(dataPublicacao desc) {
    _id,
    titulo,
    resumo,
    "slug": slug.current,
    dataPublicacao,
    destaqueHome,
    "imagemUrl": imagemDestaque.asset->url,
    ${PROJECAO_CATEGORIAS}
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
    ${PROJECAO_CATEGORIAS}
  }`;

  return client.fetch(query, { termo, padrao }, { next: { revalidate: 60 } });
}

export async function getNoticiasPorCategoriaPaginada(
  slug: string,
  pagina = 1,
  porPagina = 6
): Promise<ResultadoCategoriaPaginada> {
  const inicio = (pagina - 1) * porPagina;
  const fim = inicio + porPagina;

  return client.fetch(
    `{
      "noticias": *[_type == "noticia" && $slug in categorias[]->slug.current] | order(dataPublicacao desc) [$inicio...$fim] {
        _id,
        titulo,
        "slug": slug.current,
        resumo,
        dataPublicacao,
        "imagemUrl": imagemDestaque.asset->url,
        ${PROJECAO_CATEGORIAS}
      },
      "total": count(*[_type == "noticia" && $slug in categorias[]->slug.current])
    }`,
    { slug, inicio, fim },
    { next: { revalidate: 60 } }
  );
}

export interface NoticiaGeralItem {
  _id: string;
  titulo: string;
  slug: string;
  resumo?: string;
  dataPublicacao?: string;
  imagemUrl?: string;
  categorias?: Categoria[];
}

export interface ResultadoTodasNoticiasPaginadas {
  noticias: NoticiaGeralItem[];
  total: number;
}

export async function getTodasNoticiasPaginada(
  pagina = 1,
  porPagina = 9
): Promise<ResultadoTodasNoticiasPaginadas> {
  const inicio = (pagina - 1) * porPagina;
  const fim = inicio + porPagina;

  const query = `{
    "noticias": *[_type == "noticia"] | order(dataPublicacao desc, _createdAt desc) [$inicio...$fim] {
      _id,
      titulo,
      "slug": slug.current,
      resumo,
      dataPublicacao,
      "imagemUrl": imagemDestaque.asset->url,
      ${PROJECAO_CATEGORIAS}
    },
    "total": count(*[_type == "noticia"])
  }`;

  return client.fetch(query, { inicio, fim }, { next: { revalidate: 60 } });
}

const SLUGS_GALERIA_OCULTOS = new Set([
  "galeria-de-fotos",
  "galeria-de-videos",
  "multimidia",
]);

export function filtrarCategoriasVisiveis(categorias?: Categoria[]): Categoria[] {
  if (!categorias || categorias.length === 0) return [];
  return categorias.filter((cat) => !SLUGS_GALERIA_OCULTOS.has(cat.slug));
}

/* Bunner Destaque */

export interface BannerDestaque {
  _id: string;
  titulo: string;
  imagemUrl: string;
  textoBotao: string;
  subtextoBotao?: string;
  urlDestino: string;
  abrirNovaAba?: boolean;
  ordem?: number;
}

export async function getBannersDestaque(): Promise<BannerDestaque[]> {
  return client.fetch(
    `*[_type == "bannerDestaque" && ativo == true && defined(imagem.asset)] | order(ordem asc, _createdAt desc) {
      _id,
      titulo,
      "imagemUrl": imagem.asset->url + "?w=1920&auto=format&q=90",
      textoBotao,
      subtextoBotao,
      urlDestino,
      abrirNovaAba,
      ordem
    }`,
    {},
    { next: { tags: ["bannerDestaque"], revalidate: 60 } }
  );
}

export interface PopupAviso {
  _id: string;
  ativo: boolean;
  titulo: string;
  tipoMidia?: "imagem" | "video";
  imagemUrl?: string;
  videoUrl?: string;
  textoBotao: string;
  subtextoBotao?: string;
  urlDestino: string;
  abrirNovaAba?: boolean;
  frequencia?: "sessao" | "sempre";
}

export async function getPopupAviso(): Promise<PopupAviso | null> {
  return client.fetch(
    `*[_type == "popupAviso" && ativo == true][0]{
      _id,
      ativo,
      titulo,
      tipoMidia,
      "imagemUrl": imagem.asset->url,
      videoUrl,
      textoBotao,
      subtextoBotao,
      urlDestino,
      abrirNovaAba,
      frequencia
    }`
  );
}

export interface LinkInstitucional {
  label: string;
  href: string;
}

export interface RedesSociaisConfig {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  whatsappUrl?: string;
}

export interface ConfiguracoesPortal {
  nomeSindicato?: string;
  sigla?: string;
  cnpj?: string;
  descricaoInstitucional?: string;
  tituloCabecalho?: string;
  descricaoCabecalho?: string;
  endereco?: string;
  cepCidade?: string;
  horarioAtendimento?: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  temaFundoSite?: "padrao" | "novembro-azul" | "outubro-rosa" | string;
  logoUrl?: string;
  logoAlt?: string;
  redesSociais?: RedesSociaisConfig;
  linksInstitucionais?: LinkInstitucional[];
  categoriasRodape?: Categoria[];
  categoriasMultimidiaRodape?: Categoria[];
}

export async function getConfiguracoesPortal(): Promise<ConfiguracoesPortal | null> {
  const query = `*[_type == "configuracoesPortal"][0]{
    nomeSindicato,
    sigla,
    cnpj,
    descricaoInstitucional,
    tituloCabecalho,
    descricaoCabecalho,
    endereco,
    cepCidade,
    horarioAtendimento,
    telefone,
    whatsapp,
    email,
    temaFundoSite,
    "logoUrl": logoSindicato.asset->url,
    "logoAlt": logoSindicato.alt,
    redesSociais,
    linksInstitucionais,
    "categoriasRodape": coalesce(categoriasRodape[]->{
      _id,
      titulo,
      "slug": slug.current,
      cor
    }, []),
    "categoriasMultimidiaRodape": coalesce(categoriasMultimidiaRodape[]->{
      _id,
      titulo,
      "slug": slug.current,
      cor
    }, [])
  }`;

  return client.fetch(query, {}, { next: { revalidate: 60 } });
}