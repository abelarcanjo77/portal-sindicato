import Link from "next/link";
import Image from "next/image";
import { IconBrandFacebookFilled, IconBrandInstagram, IconBrandYoutubeFilled,} from "@tabler/icons-react";
import { getCategorias } from "@/sanity/lib/queries";

export interface CategoriaRodape {
  _id?: string;
  titulo: string;
  slug: string;
}

interface RodapePortalProps {
  categorias?: CategoriaRodape[];
  nomeSindicato?: string;
  sigla?: string;
  cnpj?: string;
  endereco?: string;
  cepCidade?: string;
  horarioAtendimento?: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  redesSociais?: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    whatsappUrl?: string;
  };
  linksInstitucionais?: {
    label: string;
    href: string;
  }[];
}

export function RodapeStructure({
  categorias = [],
  nomeSindicato = "Sindicato dos Trabalhadores",
  sigla,
  cnpj,
  endereco = "Rua Exemplo, 123 — Centro",
  cepCidade = "CEP 00000-000 • São Paulo - SP",
  horarioAtendimento = "Segunda a sexta, das 8h às 17h",
  telefone = "(11) 0000-0000",
  whatsapp = "(11) 90000-0000",
  email = "contato@sindicato.org.br",
  redesSociais,
  linksInstitucionais = [
    { label: "Últimas Notícias", href: "/ultimasNoticias" },
    { label: "Diretoria", href: "/diretoria" },
    { label: "Convênios", href: "/convenios" },
    { label: "Atendimento Jurídico", href: "/atendimentoJuridico" },
    { label: "Fale Conosco", href: "/contato" },
  ],
}: RodapePortalProps) {
  const anoAtual = new Date().getFullYear();
  const whatsappLimpo = whatsapp.replace(/\D/g, "");
  const hrefWhatsapp =
    redesSociais?.whatsappUrl ||
    (whatsappLimpo ? `https://wa.me/55${whatsappLimpo}` : undefined);

  return (
    <footer className="mt-6 border-t border-slate-800 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Coluna 1: Identidade do Sindicato */}
          <div className="space-y-3">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-white/10 p-1">
                <Image
                  src="/img/logo-topo-site.svg"
                  alt={nomeSindicato}
                  fill
                  sizes="40px"
                  className="object-contain p-1"
                />
              </div>
              <div>
                <p className="text-sm font-bold leading-tight text-white">
                  {sigla ? `${sigla}` : nomeSindicato}
                </p>
                {sigla && (
                  <p className="text-xs text-slate-400 line-clamp-1">
                    {nomeSindicato}
                  </p>
                )}
              </div>
            </Link>

            <p className="text-xs leading-relaxed text-slate-400">
              Representação, defesa de direitos, orientação jurídica e
              acompanhamento das campanhas salariais da categoria.
            </p>

            {cnpj && (
              <p className="text-xs font-medium text-slate-400">
                CNPJ: <span className="text-slate-200">{cnpj}</span>
              </p>
            )}
          </div>

          {/* Coluna 2: Navegação Institucional */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Institucional
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {linksInstitucionais.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-slate-300 hover:text-amber-400 transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Coluna 3: Categorias do Portal */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              CATEGORIAS
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categorias.length > 0 ? (
                categorias.map((cat, idx) => {
                    if(cat.slug != "galeria-de-fotos" && cat.slug != "galeria-de-videos" && cat.slug != "multimidia" && cat.slug != "noticia"){
                        return(
                            <li key={cat._id ?? `${cat.slug}-${idx}`}>
                                <Link
                                href={`/categoria/${cat.slug}`}
                                className="text-slate-300 hover:text-amber-400 transition"
                                >
                                {cat.titulo}
                                </Link>
                            </li>
                        )
                    }
                })
              ) : (
                <li>
                  <Link
                    href="/ultimasNoticias"
                    className="text-slate-300 hover:text-amber-400 transition"
                  >
                    Todas as matérias
                  </Link>
                </li>
              )}
            </ul>
            <div className="mt-4">
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    MULTIMÍDIA
                </h2>
                <ul className="mt-4 space-y-2.5 text-sm">
                {categorias.length > 0 ? (
                    categorias.map((cat, idx) => {
                        if(cat.slug == "galeria-de-fotos" || cat.slug == "galeria-de-videos"){
                            return(
                                <li key={cat._id ?? `${cat.slug}-${idx}`}>
                                    <Link
                                    href={`/categoria/${cat.slug}`}
                                    className="text-slate-300 hover:text-amber-400 transition"
                                    >
                                    {cat.titulo}
                                    </Link>
                                </li>
                            )
                        }
                    })
                ) : (
                    <li>
                    <Link
                        href="/ultimasNoticias"
                        className="text-slate-300 hover:text-amber-400 transition"
                    >
                        Todas as matérias
                    </Link>
                    </li>
                )}
                </ul>
            </div>
          </div>
          

          {/* Coluna 4: Endereço, Horário e Atendimento */}
          <div className="space-y-3 text-sm">
            <h2 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Atendimento e Sede
            </h2>

            <div className="space-y-1 text-xs leading-relaxed text-slate-300">
              <p className="font-medium text-white">{endereco}</p>
              <p className="text-slate-400">{cepCidade}</p>
              <p className="pt-1 text-slate-300">{horarioAtendimento}</p>
            </div>

            <div className="space-y-1.5 pt-1 text-xs">
              {telefone && (
                <p>
                  <span className="text-slate-400">Telefone: </span>
                  <a
                    href={`tel:${telefone.replace(/\D/g, "")}`}
                    className="font-medium text-white hover:text-amber-400 transition"
                  >
                    {telefone}
                  </a>
                </p>
              )}

              {whatsapp && hrefWhatsapp && (
                <p>
                  <span className="text-slate-400">WhatsApp: </span>
                  <a
                    href={hrefWhatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-emerald-400 hover:underline"
                  >
                    {whatsapp}
                  </a>
                </p>
              )}

              {email && (
                <p>
                  <span className="text-slate-400">E-mail: </span>
                  <a
                    href={`mailto:${email}`}
                    className="font-medium text-white hover:text-amber-400 transition"
                  >
                    {email}
                  </a>
                </p>
              )}
            </div>

            {(redesSociais?.instagram ||
              redesSociais?.facebook ||
              redesSociais?.youtube) && (
              <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium">
                {redesSociais.instagram && (
                  <a
                    href={redesSociais.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-white/5 px-2.5 py-1 text-slate-200 hover:bg-white/10 hover:text-amber-400 transition flex gap-2 items-center"
                  >
                    <IconBrandInstagram size={15}/>
                    <span>Instagram</span>
                  </a>
                )}
                {redesSociais.facebook && (
                  <a
                    href={redesSociais.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-white/5 px-2.5 py-1 text-slate-200 hover:bg-white/10 hover:text-amber-400 transition flex gap-2 items-center"
                  >
                    <IconBrandFacebookFilled size={15}/>
                    <span>Facebook</span>
                  </a>
                )}
                {redesSociais.youtube && (
                  <a
                    href={redesSociais.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md bg-white/5 px-2.5 py-1 text-slate-200 hover:bg-white/10 hover:text-amber-400 transition flex gap-2 items-center"
                  >
                    <IconBrandYoutubeFilled size={15}/>
                    <span>YouTube</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Barra inferior */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-800/80 pt-6 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>
            © {anoAtual} {nomeSindicato}. Todos os direitos reservados.
          </p>
          <p>Portal Fictício de comunicação e serviços ao trabalhador.</p>
        </div>
      </div>
    </footer>
  );
}

export async function RodapePortal() {

    const categorias = await getCategorias()

    return(
        <RodapeStructure
            categorias={categorias}
            nomeSindicato="Nome Completo do Sindicato"
            sigla="SIGLA"
            cnpj="00.000.000/0001-00"
            endereco="Rua Principal, 100 - Centro"
            cepCidade="CEP 00000-000 • Cidade - UF"
            horarioAtendimento="Seg. a sex., das 8h30 às 17h30"
            telefone="(00) 0000-0000"
            whatsapp="(00) 00000-0000"
            email="atendimento@xxxxx.com.br"
            redesSociais={{
                instagram: "https://instagram.com/",
                facebook: "https://facebook.com/",
                youtube: "https://youtube.com/",
            }}
        />
    )
}