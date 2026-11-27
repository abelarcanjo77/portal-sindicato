import { type SchemaTypeDefinition } from 'sanity'
import categoria from './categoria'
import noticia from './noticia'
import { bannerDestaque } from './bannerDestaque'
import { popupAviso } from './popupAviso'
import { configuracoesPortal } from './configuracoesPortal'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [noticia, categoria, bannerDestaque, popupAviso, configuracoesPortal],
}