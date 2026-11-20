import type { StructureResolver } from 'sanity/structure'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Painel Editorial do Sindicato')
    .items([
      S.listItem()
        .title('Todas as Matérias')
        .schemaType('noticia')
        .child(S.documentTypeList('noticia').title('Todas as Matérias')),
      S.listItem()
        .title('Matérias em Destaque na Capa')
        .schemaType('noticia')
        .child(
          S.documentList()
            .title('Destaques da Capa')
            .filter('_type == "noticia" && destaqueHome == true')
        ),
      S.divider(),
      S.documentTypeListItem('categoria').title('Categorias'),
    ])