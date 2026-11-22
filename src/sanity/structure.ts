import type { StructureResolver } from "sanity/structure";

const SLUGS_MULTIMIDIA_ESTRUTURA = [
  "galeria-de-fotos",
  "galeria-de-videos",
  "multimidia",
];

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
            .filter(
              '_type == "categoria" && !(slug.current in $slugsExcluidos)'
            )
            .params({ slugsExcluidos: SLUGS_MULTIMIDIA_ESTRUTURA })
            .child((categoryId) =>
              S.documentTypeList("noticia")
                .title("Notícias da Categoria")
                .filter('_type == "noticia" && $categoryId in categorias[]._ref')
                .params({ categoryId })
                .defaultOrdering([
                  { field: "dataPublicacao", direction: "desc" },
                ])
            )
        ),

      S.listItem()
        .title("Multimídia")
        .child(
          S.list()
            .title("Multimídia")
            .items([
              S.listItem()
                .title("Galeria de Fotos")
                .child(
                  S.documentTypeList("noticia")
                    .title("Galeria de Fotos")
                    .filter(
                      '_type == "noticia" && "galeria-de-fotos" in categorias[]->slug.current'
                    )
                    .defaultOrdering([
                      { field: "dataPublicacao", direction: "desc" },
                    ])
                ),

              S.listItem()
                .title("Galeria de Vídeos")
                .child(
                  S.documentTypeList("noticia")
                    .title("Galeria de Vídeos")
                    .filter(
                      '_type == "noticia" && "galeria-de-videos" in categorias[]->slug.current'
                    )
                    .defaultOrdering([
                      { field: "dataPublicacao", direction: "desc" },
                    ])
                ),
            ])
        ),

      S.divider(),

      S.documentTypeListItem("categoria").title("Gerenciar Categorias"),
    ]);