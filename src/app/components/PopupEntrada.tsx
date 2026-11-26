"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PopupAviso } from "@/sanity/lib/queries";

interface PopupEntradaProps {
  popup: PopupAviso | null;
}

export function PopupEntrada({ popup }: PopupEntradaProps) {
  const [aberto, setAberto] = useState(false);

  useEffect(() => {
    if (!popup || !popup.ativo || !popup.imagemUrl) return;

    const chaveSessao = `popup_visto_${popup._id}`;
    if (popup.frequencia !== "sempre" && sessionStorage.getItem(chaveSessao)) {
      return;
    }

    const timer = setTimeout(() => {
      setAberto(true);
    }, 350);

    return () => clearTimeout(timer);
  }, [popup]);

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

  if (!aberto || !popup) return null;

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
    <span className="flex w-full flex-col items-center justify-center rounded-lg bg-amber-400 hover:bg-amber-300 active:scale-[0.99] px-5 py-3 text-center text-slate-950 shadow-sm transition">
      <span className="text-sm font-extrabold uppercase tracking-wide leading-tight">
        {popup.textoBotao}
      </span>
      {popup.subtextoBotao && (
        <span className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-slate-900/85">
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-xs"
      onClick={fecharPopup}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={fecharPopup}
          aria-label="Fechar pop-up"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-950/65 text-white hover:bg-slate-950 transition cursor-pointer"
        >
          ✕
        </button>

        <div className="relative aspect-[4/3] w-full bg-slate-100">
          <Image
            src={popup.imagemUrl}
            alt={popup.titulo}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 448px"
            className="object-cover"
          />
        </div>

        <div className="p-4 sm:p-5 space-y-3 bg-white">
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
            className="w-full rounded-lg border border-slate-200 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
          >
            Fechar aviso
          </button>
        </div>
      </div>
    </div>
  );
}