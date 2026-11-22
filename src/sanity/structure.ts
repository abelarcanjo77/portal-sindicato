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
        .title("Notícias por Categoria")
        .child(
          S.documentTypeList("categoria")
            .title("Categorias")
            .child((categoryId) =>
              S.documentTypeList("noticia")
                .title("Notícias da Categoria")
                .filter('_type == "noticia" && categoria._ref == $categoryId')
                .params({ categoryId })
                .defaultOrdering([
                  { field: "dataPublicacao", direction: "desc" },
                ])
            )
        ),

      S.divider(),

      S.documentTypeListItem("categoria").title("Gerenciar Categorias"),
    ]);