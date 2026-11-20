import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://portal-sindicato.vercel.app"
  ),
  title: {
    default: "Portal do Sindicato | Notícias, Jurídico e Conquistas da Categoria",
    template: "%s | Portal do Sindicato",
  },
  description:
    "Acompanhe as notícias oficiais, ações jurídicas, convenções coletivas e comunicados do sindicato.",
  openGraph: {
    siteName: "Portal do Sindicato",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
  },
};