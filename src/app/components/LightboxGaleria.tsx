"use client";

import { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

export interface ImagemLightbox {
  url: string;
  alt?: string;
  legenda?: string;
}

interface LightboxGaleriaProps {
  imagens: ImagemLightbox[];
  indiceInicial: number | null;
  onFechar: () => void;
}

export function LightboxGaleria({
  imagens,
  indiceInicial,
  onFechar,
}: LightboxGaleriaProps) {
  const aberto = indiceInicial !== null && imagens.length > 0;

  useEffect(() => {
    if (!aberto) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar();
    };

    const overflowAnterior = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = overflowAnterior;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [aberto, onFechar]);

  if (!aberto || indiceInicial === null) return null;

  const temVariasFotos = imagens.length > 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visualização ampliada da imagem"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-3 sm:p-6 backdrop-blur-xs"
      onClick={onFechar}
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl bg-slate-900/95 p-3 sm:p-5 shadow-2xl ring-1 ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho e botão fechar */}
        <div className="mb-3 flex items-center justify-between gap-4 px-1">
          <span className="text-xs font-medium text-slate-300">
            {temVariasFotos
              ? `${imagens.length} fotos na galeria • Arraste ou use as setas`
              : "Visualização ampliada"}
          </span>

          <button
            type="button"
            onClick={onFechar}
            aria-label="Fechar visualização"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Carrossel Swiper */}
        <Swiper
          modules={[Navigation, Pagination, Keyboard]}
          initialSlide={indiceInicial}
          navigation={temVariasFotos}
          pagination={
            temVariasFotos
              ? {
                  clickable: true,
                  renderBullet: (_index, className) =>
                    `<span class="${className} banner-pill"></span>`,
                }
              : false
          }
          keyboard={{ enabled: true }}
          spaceBetween={16}
          slidesPerView={1}
          className="lightbox-swiper banner-swiper w-full rounded-xl"
        >
          {imagens.map((item, idx) => (
            <SwiperSlide key={`${item.url}-${idx}`}>
              <div className="flex flex-col items-center justify-center pb-11">
                <div className="relative h-[58vh] sm:h-[68vh] w-full overflow-hidden rounded-lg bg-slate-950">
                  {item.url && (
                    <Image
                      src={item.url}
                      alt={item.alt || item.legenda || `Imagem ${idx + 1}`}
                      fill
                      unoptimized
                      sizes="(max-width: 1024px) 100vw, 900px"
                      className="object-contain select-none"
                    />
                  )}
                </div>

                {item.legenda && (
                  <p className="mt-3 max-w-2xl text-center text-xs sm:text-sm text-slate-200 px-2">
                    {item.legenda}
                  </p>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}