import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'noticia',
  title: 'Matéria / Notícia',
  type: 'document',
  groups: [
    { name: 'conteudo', title: 'Conteúdo da Matéria', default: true },
    { name: 'config', title: 'Capa, Categorias e Data' },
  ],
  fields: [
    defineField({
      name: 'titulo',
      title: 'Título da Matéria',
      type: 'string',
      group: 'conteudo',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'resumo',
      title: 'Linha Fina / Resumo',
      description: 'Texto curto exibido nos cards da página inicial.',
      type: 'text',
      rows: 3,
      group: 'conteudo',
    }),
    defineField({
      name: 'slug',
      title: 'Link (Slug)',
      type: 'slug',
      group: 'config',
      options: { source: 'titulo', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'destaqueHome',
      title: 'Exibir no Destaque Principal do Site?',
      type: 'boolean',
      initialValue: false,
      group: 'config',
    }),
    defineField({
      name: 'dataPublicacao',
      title: 'Data da Publicação',
      type: 'datetime',
      group: 'config',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'imagemDestaque',
      title: 'Imagem de Destaque (Capa)',
      type: 'image',
      options: { hotspot: true },
      group: 'config',
    }),
    defineField({
      name: 'categoria',
      title: 'Categoria',
      type: 'reference',
      to: [{ type: 'categoria' }],
      group: 'config',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      group: 'config',
    }),
    defineField({
      name: 'conteudo',
      title: 'Corpo da Matéria',
      type: 'array',
      group: 'conteudo',
      of: [
        { type: 'block' },
        {
          type: 'image',
          title: 'Foto Única',
          options: { hotspot: true },
          fields: [{ name: 'legenda', title: 'Legenda da foto', type: 'string' }],
        },
        {
          name: 'videoEmbed',
          title: 'Incorporar Vídeo (YouTube/Vimeo)',
          type: 'object',
          fields: [{ name: 'url', title: 'URL do Vídeo', type: 'url' }],
        },
        {
          name: 'galeriaFotos',
          title: 'Galeria de Fotos',
          type: 'object',
          fields: [
            {
              name: 'imagens',
              title: 'Fotos da Galeria',
              type: 'array',
              of: [{ type: 'image', options: { hotspot: true } }],
            },
          ],
        },
        {
          name: 'pdfEmbutido',
          title: 'Incorporar Documento PDF',
          type: 'object',
          fields: [
            { name: 'tituloDocumento', title: 'Título do PDF', type: 'string' },
            {
              name: 'arquivo',
              title: 'Arquivo PDF',
              type: 'file',
              options: { accept: '.pdf' },
            },
          ],
        },
      ],
    }),
  ],
})