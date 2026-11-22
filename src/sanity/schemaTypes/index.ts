import { type SchemaTypeDefinition } from 'sanity'
import categoria from './categoria'
import noticia from './noticia'
import { bannerDestaque } from './bannerDestaque'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [noticia, categoria, bannerDestaque],
}