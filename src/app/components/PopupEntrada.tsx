"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { PopupAviso } from "@/sanity/lib/queries";

interface PopupEntradaProps {
  popup: PopupAviso | null;
}

function extrairEmbedVideo(url?: string): {
  embedUrl: string | null;
  isShort: boolean;
} {
  if (!url) return { embedUrl: null, isShort: false };

  const shortsMatch = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
  if (shortsMatch?.[1]) {
    return {
      embedUrl: `https://www.youtube.com/embed/${shortsMatch[1]}?rel=0`,
      isShort: true,
    };
  }

  const ytMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/
  );
  if (ytMatch?.[1]) {
    return {
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?rel=0`,
      isShort: false,
    };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch?.[1]) {
    return {
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
      isShort: false,
    };
  }

  return { embedUrl: null, isShort: false };
}

export function PopupEntrada({ popup }: PopupEntradaProps) {
  const [aberto, setAberto] = useState(false);

  const isVideo = popup?.tipoMidia === "video";
  const { embedUrl, isShort } = extrairEmbedVideo(popup?.videoUrl);

  const temMidiaValida = Boolean(
    popup && (isVideo ? Boolean(embedUrl) : Boolean(popup.imagemUrl))
  );

  useEffect(() => {
    if (!popup || !popup.ativo || !temMidiaValida) return;

    const chaveSessao = `popup_visto_${popup._id}`;
    if (popup.frequencia !== "sempre" && sessionStorage.getItem(chaveSessao)) {
      return;
    }

    const timer = setTimeout(() => {
      setAberto(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [popup, temMidiaValida]);

  useEffect(() => {
    if (!aberto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") fecharPopup();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  });

  if (!aberto || !popup || !temMidiaValida) return null;

  const storageKey = `popup_visto_${popup._id}`;

  function fecharPopup() {
    if (popup && popup.frequencia !== "sempre") {
      sessionStorage.setItem(storageKey, "1");
    }
    setAberto(false);
  }

  const isExterno =
    popup.urlDestino.startsWith("http://") ||
    popup.urlDestino.startsWith("https://");

  const botaoAcao = (
    <span className="flex w-full flex-col items-center justify-center rounded-lg bg-amber-400 hover:bg-amber-300 active:scale-[0.99] px-5 py-3.5 text-center text-slate-950 shadow-sm transition">
      <span className="text-sm sm:text-base font-extrabold uppercase tracking-wide leading-tight">
        {popup.textoBotao}
      </span>
      {popup.subtextoBotao && (
        <span className="mt-0.5 text-xs font-bold uppercase tracking-wider text-slate-900/85">
          {popup.subtextoBotao}
        </span>
      )}
    </span>
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={popup.titulo}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-3 sm:p-6 backdrop-blur-xs overflow-y-auto"
      onClick={fecharPopup}
    >
      <div
        className={`relative my-auto w-full ${
          isVideo && isShort ? "max-w-sm" : "max-w-2xl"
        } overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={fecharPopup}
          aria-label="Fechar pop-up"
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950/75 text-white hover:bg-slate-950 transition cursor-pointer shadow-md"
        >
          ✕
        </button>

        {/* Área de mídia autoajustável */}
        <div className="w-full bg-slate-950 flex items-center justify-center">
          {isVideo && embedUrl ? (
            <div
              className={`w-full ${
                isShort ? "aspect-[9/16] max-h-[70vh]" : "aspect-video"
              }`}
            >
              <iframe
                src={embedUrl}
                title={popup.titulo}
                allow="fullscreen; picture-in-picture"
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          ) : popup.imagemUrl ? (
            <Image
              src={popup.imagemUrl}
              alt={popup.titulo}
              width={1200}
              height={800}
              unoptimized
              className="w-full h-auto max-h-[70vh] object-contain bg-white"
            />
          ) : null}
        </div>

        {/* Rodapé com botão de ação e fechar */}
        <div className="p-4 sm:p-5 space-y-2.5 bg-white">
          {isExterno || popup.abrirNovaAba ? (
            <a
              href={popup.urlDestino}
              target={popup.abrirNovaAba ? "_blank" : undefined}
              rel={popup.abrirNovaAba ? "noopener noreferrer" : undefined}
              onClick={fecharPopup}
              className="block"
            >
              {botaoAcao}
            </a>
          ) : (
            <Link href={popup.urlDestino} onClick={fecharPopup} className="block">
              {botaoAcao}
            </Link>
          )}

          <button
            type="button"
            onClick={fecharPopup}
            className="w-full rounded-lg border border-slate-200 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Fechar aviso
          </button>
        </div>
      </div>
    </div>
  );
}