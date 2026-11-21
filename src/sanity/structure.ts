import type { StructureResolver } from "sanity/structure";

/* Estrutura pastas Dashboard */
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Gestão do Portal")
    .items([
      S.listItem()
        .title("Todas as Notícias")
        .child(
          S.documentTypeList("noticia")
            .title("Todas as Notícias")
            .defaultOrdering([{ field: "dataPublicacao", direction: "desc" }])
        ),
      S.divider(),
      S.listItem()
        .title("Notícias — Geral")
        .child(
          S.documentTypeList("noticia")
            .title("Notícias — Geral")
            .filter('_type == "noticia" && categoria->slug.current == "noticia"')
            .defaultOrdering([{ field: "dataPublicacao", direction: "desc" }])
        ),
      S.listItem()
        .title("Notícias — Jurídico")
        .child(
          S.documentTypeList("noticia")
            .title("Notícias — Jurídico")
            .filter('_type == "noticia" && categoria->slug.current == "juridico"')
            .defaultOrdering([{ field: "dataPublicacao", direction: "desc" }])
        ),
        S.listItem()
        .title("Notícias — Reunião Setorial")
        .child(
          S.documentTypeList("noticia")
            .title("Notícias — Reunião Setorial")
            .filter('_type == "noticia" && categoria->slug.current == "reuniao-setorial"')
            .defaultOrdering([{ field: "dataPublicacao", direction: "desc" }])
        ),
      S.divider(),
      S.documentTypeListItem("categoria").title("Categorias"),
    ]);