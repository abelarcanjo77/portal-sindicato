"use client";

import { useState } from "react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { LightboxGaleria, type ImagemLightbox } from "./LightboxGaleria";

type EmbedInfo = {
  src: string;
  aspectClass: string;
};

function extrairEmbedVideo(url?: string): EmbedInfo | null {
  if (!url) return null;

  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }

    const host = parsed.hostname.replace(/^www\./, "").toLowerCase();

    // 1. YouTube (watch?v=, youtu.be/, shorts/, embed/)
    if (
      host === "youtube.com" ||
      host === "m.youtube.com" ||
      host === "youtu.be"
    ) {
      const ytMatch = parsed.href.match(
        /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      );
      if (ytMatch?.[1]) {
        return {
          src: `https://www.youtube.com/embed/${ytMatch[1]}`,
          aspectClass: "aspect-video max-w-none",
        };
      }
    }

    // 2. Vimeo
    if (host === "vimeo.com" || host === "player.vimeo.com") {
      const vimeoMatch = parsed.pathname.match(/^\/(?:video\/)?(\d+)/);
      if (vimeoMatch?.[1]) {
        return {
          src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
          aspectClass: "aspect-video max-w-none",
        };
      }
    }

    // 3. TikTok (@usuario/video/ID ou /embed/v2/ID)
    if (host === "tiktok.com" || host === "m.tiktok.com") {
      const tiktokMatch = parsed.pathname.match(
        /(?:\/@[^/]+\/video\/|\/embed\/v2\/)(\d+)/
      );
      if (tiktokMatch?.[1]) {
        return {
          src: `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}`,
          aspectClass: "aspect-[9/16] max-w-[380px] mx-auto",
        };
      }
    }

    // 4. Instagram (/p/CODIGO, /reel/CODIGO, /tv/CODIGO)
    if (host === "instagram.com") {
      const igMatch = parsed.pathname.match(
        /^\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/
      );
      if (igMatch?.[1]) {
        const tipo = parsed.pathname.startsWith("/reel/") ? "reel" : "p";
        return {
          src: `https://www.instagram.com/${tipo}/${igMatch[1]}/embed`,
          aspectClass: "aspect-[4/5] max-w-[420px] mx-auto",
        };
      }
    }
  } catch {
    return null;
  }

  return null;
}

function sanitizarUrl(url?: string, permitirRelativo = false): string | null {
  if (!url) return null;
  const limpa = url.trim();

  if (permitirRelativo && limpa.startsWith("/") && !limpa.startsWith("//")) {
    return limpa;
  }

  try {
    const parsed = new URL(limpa);
    if (["https:", "http:", "mailto:", "tel:"].includes(parsed.protocol)) {
      return limpa;
    }
  } catch {
    return null;
  }

  return null;
}

function criarComponentesPortableText(
  abrirLightbox: (imagens: ImagemLightbox[], indice: number) => void
): PortableTextComponents {
  return {
    block: {
      normal: ({ children }) => (
        <p className="mb-5 text-lg leading-relaxed text-slate-800">{children}</p>
      ),
      h2: ({ children }) => (
        <h2 className="mt-8 mb-4 text-2xl font-bold text-slate-900">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="mt-6 mb-3 text-xl font-bold text-slate-900">
          {children}
        </h3>
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
      link: ({ children, value }) => {
        const hrefSeguro = sanitizarUrl(value?.href, true);
        if (!hrefSeguro) {
          return <span className="text-slate-600">{children}</span>;
        }

        const ehExterno = hrefSeguro.startsWith("http");
        return (
          <a
            href={hrefSeguro}
            {...(ehExterno
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="text-blue-700 underline hover:text-blue-900"
          >
            {children}
          </a>
        );
      },
    },
    types: {
      image: ({ value }) => {
        if (!value?.asset?.url) return null;

        const fotoUnica: ImagemLightbox[] = [
          {
            url: value.asset.url,
            alt: value.legenda || "Imagem da matéria",
            legenda: value.legenda,
          },
        ];

        return (
          <figure className="my-8">
            <button
              type="button"
              onClick={() => abrirLightbox(fotoUnica, 0)}
              aria-label={`Ampliar imagem: ${value.legenda || "Imagem da matéria"}`}
              className="group block w-full overflow-hidden rounded-xl shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={value.asset.url}
                alt={value.legenda || "Imagem da matéria"}
                className="w-full rounded-xl group-hover:scale-[1.01] transition duration-300"
              />
            </button>
            {value.legenda && (
              <figcaption className="mt-2 text-center text-sm text-slate-500">
                {value.legenda}
              </figcaption>
            )}
          </figure>
        );
      },
      videoEmbed: ({ value }) => {
        const embed = extrairEmbedVideo(value?.url);
        if (!embed) return null;

        return (
          <div
            className={`my-8 w-full overflow-hidden rounded-xl shadow-sm bg-slate-950 ${embed.aspectClass}`}
          >
            <iframe
              src={embed.src}
              title="Vídeo incorporado"
              className="h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      },
      galeriaFotos: ({ value }) => {
        if (!value?.imagens?.length) return null;

        const imagensValidas: ImagemLightbox[] = value.imagens
          .filter((img: any) => Boolean(img?.asset?.url))
          .map((img: any, idx: number) => ({
            url: img.asset.url,
            alt: img.alt || img.legenda || `Foto ${idx + 1} da galeria`,
            legenda: img.legenda || img.alt,
          }));

        if (!imagensValidas.length) return null;

        return (
          <div className="my-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {value.imagens.map((img: any, index: number) => {
              if (!img?.asset?.url) return null;

              const indiceNoLightbox = imagensValidas.findIndex(
                (item) => item.url === img.asset.url
              );

              return (
                <button
                  key={img._key || index}
                  type="button"
                  onClick={() =>
                    abrirLightbox(
                      imagensValidas,
                      indiceNoLightbox >= 0 ? indiceNoLightbox : 0
                    )
                  }
                  aria-label={`Ampliar foto ${index + 1} da galeria`}
                  className="group block w-full overflow-hidden rounded-lg border border-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-700"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.asset.url}
                    alt={img.legenda || `Foto ${index + 1} da galeria`}
                    className="h-52 w-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </button>
              );
            })}
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
}

export function CorpoMateria({ conteudo }: { conteudo: any[] }) {
  const [imagensLightbox, setImagensLightbox] = useState<ImagemLightbox[]>([]);
  const [indiceAtual, setIndiceAtual] = useState<number | null>(null);

  if (!conteudo || conteudo.length === 0) return null;

  function abrirLightbox(imagens: ImagemLightbox[], indice: number) {
    setImagensLightbox(imagens);
    setIndiceAtual(indice);
  }

  function fecharLightbox() {
    setIndiceAtual(null);
    setImagensLightbox([]);
  }

  const componentes = criarComponentesPortableText(abrirLightbox);

  return (
    <>
      <PortableText value={conteudo} components={componentes} />
      <LightboxGaleria
        imagens={imagensLightbox}
        indiceInicial={indiceAtual}
        onFechar={fecharLightbox}
      />
    </>
  );
}