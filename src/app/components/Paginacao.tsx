import Link from "next/link";

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  baseUrl: string;
}

export function Paginacao({
  paginaAtual,
  totalPaginas,
  baseUrl,
}: PaginacaoProps) {
  if (totalPaginas <= 1) return null;

  const temAnterior = paginaAtual > 1;
  const temProxima = paginaAtual < totalPaginas;

  const gerarHref = (pagina: number) =>
    pagina === 1 ? baseUrl : `${baseUrl}?page=${pagina}`;

  return (
    <nav
      aria-label="Navegação de páginas"
      className="mt-10 flex items-center justify-between border-t border-slate-200 pt-6"
    >
      {temAnterior ? (
        <Link
          href={gerarHref(paginaAtual - 1)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
        >
          ← Anterior
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400 cursor-not-allowed">
          ← Anterior
        </span>
      )}

      <span className="text-sm text-slate-600">
        Página <strong className="text-slate-900">{paginaAtual}</strong> de{" "}
        <strong className="text-slate-900">{totalPaginas}</strong>
      </span>

      {temProxima ? (
        <Link
          href={gerarHref(paginaAtual + 1)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
        >
          Próxima →
        </Link>
      ) : (
        <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-400 cursor-not-allowed">
          Próxima →
        </span>
      )}
    </nav>
  );
}