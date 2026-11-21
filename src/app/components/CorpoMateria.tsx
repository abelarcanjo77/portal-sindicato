import { PortableText, type PortableTextComponents } from "@portabletext/react";

function extrairEmbedVideo(url?: string): string | null {
  if (!url) return null;

  // YouTube (watch?v=, youtu.be/, shorts/, embed/)
  const ytMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch?.[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`;
  }

  // Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch?.[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
  }

  return url;
}

const componentesPortableText: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-lg leading-relaxed text-slate-800">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mt-8 mb-4 text-2xl font-bold text-slate-900">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 mb-3 text-xl font-bold text-slate-900">{children}</h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-blue-800 bg-blue-50/60 py-3 px-5 italic text-slate-700 rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 list-disc pl-6 space-y-2 text-lg text-slate-800">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 list-decimal pl-6 space-y-2 text-lg text-slate-800">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-700 underline hover:text-blue-900"
      >
        {children}
      </a>
    ),
    left: ({ children }: { children?: React.ReactNode }) => (
      <span className="block text-left">{children}</span>
    ),
    center: ({ children }: { children?: React.ReactNode }) => (
      <span className="block text-center">{children}</span>
    ),
    right: ({ children }: { children?: React.ReactNode }) => (
      <span className="block text-right">{children}</span>
    ),
    justify: ({ children }: { children?: React.ReactNode }) => (
      <span className="block text-justify">{children}</span>
    ),
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset?.url) return null;
      return (
        <figure className="my-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value.asset.url}
            alt={value.legenda || "Imagem da matéria"}
            className="w-full rounded-xl shadow-sm"
          />
          {value.legenda && (
            <figcaption className="mt-2 text-center text-sm text-slate-500">
              {value.legenda}
            </figcaption>
          )}
        </figure>
      );
    },
    videoEmbed: ({ value }) => {
      const embedUrl = extrairEmbedVideo(value?.url);
      if (!embedUrl) return null;
      return (
        <div className="my-8 aspect-video w-full overflow-hidden rounded-xl shadow-sm bg-black">
          <iframe
            src={embedUrl}
            title="Vídeo incorporado"
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    },
    galeriaFotos: ({ value }) => {
      if (!value?.imagens?.length) return null;
      return (
        <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {value.imagens.map((img: any, index: number) =>
            img?.asset?.url ? (
              <a
                key={img._key || index}
                href={img.asset.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block overflow-hidden rounded-lg border border-slate-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.asset.url}
                  alt={`Foto ${index + 1} da galeria`}
                  className="h-52 w-full object-cover group-hover:scale-105 transition duration-300"
                />
              </a>
            ) : null
          )}
        </div>
      );
    },
    pdfEmbutido: ({ value }) => {
      const pdfUrl = value?.arquivo?.asset?.url;
      if (!pdfUrl) return null;
      return (
        <div className="my-8 overflow-hidden rounded-xl border border-slate-300 shadow-sm bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-100 px-4 py-3 border-b border-slate-300">
            <span className="font-semibold text-slate-800">
              📄 {value.tituloDocumento || "Documento Oficial (PDF)"}
            </span>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded bg-blue-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 transition"
            >
              Abrir / Baixar PDF
            </a>
          </div>
          <iframe
            src={pdfUrl}
            title={value.tituloDocumento || "Visualizador de PDF"}
            className="h-[650px] w-full"
          />
        </div>
      );
    },
  },
};

export function CorpoMateria({ conteudo }: { conteudo: any[] }) {
  if (!conteudo || conteudo.length === 0) return null;
  return <PortableText value={conteudo} components={componentesPortableText} />;
}