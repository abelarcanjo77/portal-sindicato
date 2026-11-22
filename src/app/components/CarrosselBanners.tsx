"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, A11y } from "swiper/modules";
import type { BannerDestaque } from "@/sanity/lib/queries";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface CarrosselBannersProps {
  banners: BannerDestaque[];
}

export function CarrosselBanners({ banners }: CarrosselBannersProps) {
  if (!banners || banners.length === 0) return null;

  const temVarios = banners.length > 1;

  return (
    <section
      aria-label="Destaques principais"
      className="relative w-full bg-slate-900 select-none group"
    >
      <Swiper
        modules={[Autoplay, Navigation, Pagination, A11y]}
        slidesPerView={1}
        loop={temVarios}
        autoplay={
          temVarios
            ? {
                delay: 5500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }
            : false
        }
        navigation={
          temVarios
            ? {
                prevEl: ".banner-prev",
                nextEl: ".banner-next",
              }
            : false
        }
        pagination={
          temVarios
            ? {
                clickable: true,
              }
            : false
        }
        className="w-full"
      >
        {banners.map((banner, index) => {
          const isExterno =
            banner.urlDestino.startsWith("http://") ||
            banner.urlDestino.startsWith("https://");

          const conteudoBotao = (
            <span className="flex flex-col items-center justify-center rounded-md bg-amber-400 hover:bg-amber-300 active:scale-[0.99] px-5 py-2.5 sm:px-8 sm:py-3 text-center text-slate-950 shadow-lg ring-1 ring-black/15 transition">
              <span className="text-xs sm:text-sm md:text-base font-extrabold uppercase tracking-wide leading-tight">
                {banner.textoBotao}
              </span>
              {banner.subtextoBotao && (
                <span className="mt-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-900/90">
                  {banner.subtextoBotao}
                </span>
              )}
            </span>
          );

          return (
            <SwiperSlide key={banner._id}>
              <div className="relative w-full aspect-[16/7] sm:aspect-[21/7] md:aspect-[1920/460] max-h-[480px] min-h-[230px] overflow-hidden bg-slate-900">
                <Image
                  src={banner.imagemUrl}
                  alt={banner.titulo}
                  fill
                  priority={index === 0}
                  unoptimized
                  sizes="100vw"
                  className="object-cover object-center"
                />

                {/* Leve degradê inferior para destacar o botão flutuante */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/55 via-black/20 to-transparent" />

                {/* Botão flutuante centralizado na parte inferior */}
                <div className="absolute inset-x-0 bottom-7 sm:bottom-9 z-10 mx-auto max-w-4xl px-4 flex justify-center">
                  {isExterno || banner.abrirNovaAba ? (
                    <a
                      href={banner.urlDestino}
                      target={banner.abrirNovaAba ? "_blank" : undefined}
                      rel={
                        banner.abrirNovaAba ? "noopener noreferrer" : undefined
                      }
                      className="w-full max-w-lg"
                    >
                      {conteudoBotao}
                    </a>
                  ) : (
                    <Link href={banner.urlDestino} className="w-full max-w-2xl">
                      {conteudoBotao}
                    </Link>
                  )}
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      {/* Setas laterais customizadas */}
      {temVarios && (
        <>
          <button
            type="button"
            aria-label="Banner anterior"
            className="banner-prev absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-xs transition opacity-85 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>

          <button
            type="button"
            aria-label="Próximo banner"
            className="banner-next absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-black/35 hover:bg-black/60 text-white backdrop-blur-xs transition opacity-85 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 4.5l7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        </>
      )}
    </section>
  );
}