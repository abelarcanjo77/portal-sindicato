import { defineField, defineType } from 'sanity'

export default defineType({
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
      description: 'Exemplo: #1D4ED8 para azul ou #DC2626 para vermelho',
      type: 'string',
    }),
  ],
})