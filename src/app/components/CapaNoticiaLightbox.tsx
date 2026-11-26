"use client";

import { useState } from "react";
import Image from "next/image";
import { LightboxGaleria, type ImagemLightbox } from "./LightboxGaleria";

interface CapaNoticiaLightboxProps {
  url: string;
  alt: string;
  legenda?: string;
}

export function CapaNoticiaLightbox({
  url,
  alt,
  legenda,
}: CapaNoticiaLightboxProps) {
  const [aberta, setAberta] = useState(false);

  if (!url) return null;

  const imagens: ImagemLightbox[] = [
    {
      url,
      alt,
      legenda,
    },
  ];

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setAberta(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setAberta(true);
          }
        }}
        aria-label="Ampliar imagem de destaque"
        className="group relative my-8 h-72 md:h-[460px] w-full overflow-hidden rounded-xl bg-slate-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        <Image
          src={url}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 832px"
          className="object-cover group-hover:scale-[1.01] transition duration-300"
          priority
        />
        <span className="pointer-events-none absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-3 py-1 text-xs font-medium text-white opacity-90 group-hover:opacity-100 transition">
          Ampliar
        </span>
      </div>

      <LightboxGaleria
        imagens={imagens}
        indiceInicial={aberta ? 0 : null}
        onFechar={() => setAberta(false)}
      />
    </>
  );
}