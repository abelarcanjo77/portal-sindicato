import { type SchemaTypeDefinition } from 'sanity'
import categoria from './categoria'
import noticia from './noticia'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [noticia, categoria],
}