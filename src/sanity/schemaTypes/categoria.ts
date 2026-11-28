import { defineField, defineType } from 'sanity'

const categoriaType = defineType({
  name: 'categoria',
  title: 'Categoria',
  type: 'document',
  fields: [
    defineField({
      name: 'titulo',
      title: 'Nome da Categoria',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'titulo', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'cor',
      title: 'Cor da Etiqueta (Hex)',
      type: 'string',
    }),
    defineField({
      name: 'icone',
      title: 'Ícone da Categoria (SVG ou PNG)',
      type: 'image',
      description: 'Envie um ícone quadrado em SVG ou PNG transparente.',
      options: {
        accept: 'image/svg+xml, image/png',
      },
    }),
  ],
  preview: {
    select: {
      title: 'titulo',
      media: 'icone',
    },
  },
})

export default categoriaType