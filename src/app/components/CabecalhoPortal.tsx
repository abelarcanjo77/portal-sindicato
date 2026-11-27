import Link from "next/link";
import Image from "next/image";
import {
  IconBrandFacebookFilled,
  IconBrandInstagram,
  IconBrandWhatsapp,
  IconBrandYoutubeFilled,
} from "@tabler/icons-react";
import type { Categoria } from "@/sanity/lib/queries";
import { BarraNavegacao } from "./BarraNavegacao";

export interface RedesSociaisPortal {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  whatsappUrl?: string;
}

interface CabecalhoPortalProps {
  categorias: Categoria[];
  termoBusca?: string;
  logoUrl?: string;
  logoAlt?: string;
  tituloPortal?: string;
  subtituloPortal?: string;
  redesSociais?: RedesSociaisPortal;
}

export function CabecalhoPortal({
  categorias,
  termoBusca = "",
  logoUrl,
  logoAlt = "Logo do sindicato",
  tituloPortal = "Portal do Sindicato",
  subtituloPortal = "Informação, direitos e mobilização da categoria",
  redesSociais,
}: CabecalhoPortalProps) {
  const srcLogo = logoUrl || "/img/logo-topo-site.svg";

  const linksSociais = [
    redesSociais?.instagram && {
      nome: "Instagram",
      href: redesSociais.instagram,
      icone: <IconBrandInstagram size={18} stroke={1.8} />,
    },
    redesSociais?.facebook && {
      nome: "Facebook",
      href: redesSociais.facebook,
      icone: <IconBrandFacebookFilled size={18} />,
    },
    redesSociais?.youtube && {
      nome: "YouTube",
      href: redesSociais.youtube,
      icone: <IconBrandYoutubeFilled size={18} />,
    },
    redesSociais?.whatsappUrl && {
      nome: "WhatsApp",
      href: redesSociais.whatsappUrl,
      icone: <IconBrandWhatsapp size={18} stroke={1.8} />,
    },
  ].filter(Boolean) as { nome: string; href: string; icone: React.ReactNode }[];

  return (
    <header className="bg-blue-900 text-white shadow-md">
      <div className="mx-auto max-w-6xl px-4 py-5 md:py-4 flex flex-col items-center md:flex-row md:items-center md:justify-between gap-4">
        <div className="min-w-0 flex items-center gap-3">
          <Image
            src={srcLogo}
            alt={logoAlt}
            width={80}
            height={80}
            className="h-16 w-16 md:h-20 md:w-20 object-contain bg-white p-1 rounded-full shrink-0"
          />
          <div>
            <Link
              href="/"
              className="inline-block text-2xl font-extrabold tracking-tight text-white hover:text-blue-200 transition"
            >
              {tituloPortal}
            </Link>
            <p className="mt-0.5 text-sm text-blue-200/90">
              {subtituloPortal}
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto">
          {linksSociais.length > 0 && (
            <div className="flex items-center gap-1.5 self-end sm:self-auto">
              {linksSociais.map((rede) => (
                <a
                  key={rede.nome}
                  href={rede.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={rede.nome}
                  title={rede.nome}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-blue-950/80 text-blue-100 hover:bg-amber-400 hover:text-slate-950 ring-1 ring-white/15 transition"
                >
                  {rede.icone}
                </a>
              ))}
            </div>
          )}

          <div className="flex flex-row items-center gap-2.5 w-full sm:w-auto">
            <form
              action="/busca"
              method="GET"
              className="flex flex-1 sm:w-72 lg:w-80 gap-2"
            >
              <input
                type="text"
                name="q"
                defaultValue={termoBusca}
                placeholder="Buscar matérias, tags ou temas..."
                aria-label="Buscar matérias"
                className="min-w-0 flex-1 rounded-lg bg-white px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 shadow-xs focus:outline-none focus:ring-2 focus:ring-sky-400"
              />
              <button
                type="submit"
                className="shrink-0 rounded-lg bg-blue-950 hover:bg-blue-500 active:bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-xs transition cursor-pointer"
              >
                Buscar
              </button>
            </form>

            <div>
              <Link
                href="/studio"
                className="lg:hidden inline-flex items-center justify-center rounded-lg bg-yellow-500 hover:bg-white/15 px-2 py-1 text-xl text-black hover:text-white ring-1 ring-white/20 transition whitespace-nowrap"
              >
                ✎
              </Link>
              <Link
                href="/studio"
                className="hidden lg:inline-flex items-center justify-center rounded-lg bg-yellow-500 hover:bg-white/15 px-3.5 py-2 text-xs font-semibold text-black hover:text-white ring-1 ring-white/20 transition whitespace-nowrap"
              >
                Área do Editor
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Barra de Categorias */}
      <BarraNavegacao categorias={categorias} />
    </header>
  );
}