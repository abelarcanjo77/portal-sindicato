import type { StructureResolver } from "sanity/structure";

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
      S.listItem()
        .title("Notícias — Jurídico")
        .child(
          S.documentTypeList("noticia")
            .title("Notícias — Jurídico")
            .filter('_type == "noticia" && categoria->slug.current == "juridico"')
            .defaultOrdering([{ field: "dataPublicacao", direction: "desc" }])
        ),
      S.divider(),
      S.documentTypeListItem("categoria").title("Categorias"),
    ]);