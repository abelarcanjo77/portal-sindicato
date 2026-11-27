import type { Metadata } from "next";
import "./globals.css";
import { getConfiguracoesPortal } from "@/sanity/lib/queries";

export const dynamic = "force-dynamic";

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

const CLASSES_TEMA_FUNDO: Record<string, string> = {
  padrao: "tema-fundo-padrao",
  "novembro-azul": "tema-fundo-novembro-azul",
  "outubro-rosa": "tema-fundo-outubro-rosa",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getConfiguracoesPortal();
  const classeTema =
    CLASSES_TEMA_FUNDO[config?.temaFundoSite || "padrao"] ||
    "tema-fundo-padrao";

  return (
    <html lang="pt-BR">
      <body className={`min-h-screen antialiased transition-colors duration-300 ${classeTema}`}>
        {children}
      </body>
    </html>
  );
}