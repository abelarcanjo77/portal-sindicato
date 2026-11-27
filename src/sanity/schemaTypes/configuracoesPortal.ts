import { defineField, defineType } from 'sanity'

export const configuracoesPortal = defineType({
  name: 'configuracoesPortal',
  title: 'Configurações do Portal',
  type: 'document',
  groups: [
    { name: 'visual', title: 'Cabeçalho e Visual', default: true },
    { name: 'rodape', title: 'Rodapé e Contato' },
    { name: 'categorias', title: 'Categorias do Rodapé' },
  ],
  fields: [
    // --- CABEÇALHO E VISUAL ---
    defineField({
      name: 'logoSindicato',
      title: 'Logo do Sindicato (Cabeçalho e Rodapé)',
      description: 'Usado no cabeçalho e reaproveitado automaticamente no rodapé.',
      type: 'image',
      group: 'visual',
      options: { hotspot: true },
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo (acessibilidade)',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'tituloCabecalho',
      title: 'Título no Cabeçalho',
      description: 'Ex: Portal do Sindicato ou nome curto da entidade.',
      type: 'string',
      group: 'visual',
      initialValue: 'Portal do Sindicato',
    }),
    defineField({
      name: 'descricaoCabecalho',
      title: 'Descrição / Slogan no Cabeçalho',
      description: 'Texto curto exibido logo abaixo do título no topo do site.',
      type: 'string',
      group: 'visual',
      initialValue: 'Informação, direitos e mobilização da categoria',
    }),
    defineField({
      name: 'temaFundoSite',
      title: 'Tema de Fundo do Site',
      type: 'string',
      group: 'visual',
      initialValue: 'padrao',
      options: {
        list: [
          { title: 'Padrão (Fundo claro neutro)', value: 'padrao' },
          { title: 'Novembro Azul (Campanha azul)', value: 'novembro-azul' },
          { title: 'Outubro Rosa (Campanha rosa)', value: 'outubro-rosa' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'redesSociais',
      title: 'Redes Sociais (Cabeçalho e Rodapé)',
      type: 'object',
      group: 'visual',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram (URL)', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook (URL)', type: 'url' }),
        defineField({ name: 'youtube', title: 'YouTube (URL)', type: 'url' }),
        defineField({ name: 'whatsappUrl', title: 'WhatsApp (Link wa.me)', type: 'url' }),
      ],
    }),

    // --- RODAPÉ E CONTATO ---
    defineField({
      name: 'nomeSindicato',
      title: 'Nome Completo do Sindicato',
      type: 'string',
      group: 'rodape',
      initialValue: 'Sindicato dos Trabalhadores',
    }),
    defineField({
      name: 'sigla',
      title: 'Sigla',
      type: 'string',
      group: 'rodape',
    }),
    defineField({
      name: 'cnpj',
      title: 'CNPJ',
      type: 'string',
      group: 'rodape',
    }),
    defineField({
      name: 'descricaoInstitucional',
      title: 'Texto Institucional Curto',
      type: 'text',
      rows: 3,
      group: 'rodape',
    }),
    defineField({
      name: 'endereco',
      title: 'Endereço da Sede',
      type: 'string',
      group: 'rodape',
    }),
    defineField({
      name: 'cepCidade',
      title: 'CEP e Cidade/UF',
      type: 'string',
      group: 'rodape',
    }),
    defineField({
      name: 'horarioAtendimento',
      title: 'Horário de Atendimento',
      type: 'string',
      group: 'rodape',
    }),
    defineField({
      name: 'telefone',
      title: 'Telefone',
      type: 'string',
      group: 'rodape',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp (Número para exibição)',
      type: 'string',
      group: 'rodape',
    }),
    defineField({
      name: 'email',
      title: 'E-mail de Contato',
      type: 'string',
      group: 'rodape',
    }),
    defineField({
      name: 'linksInstitucionais',
      title: 'Links da Coluna Institucional',
      type: 'array',
      group: 'rodape',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Texto do link', type: 'string' }),
            defineField({ name: 'href', title: 'Caminho (ex: /diretoria)', type: 'string' }),
          ],
        },
      ],
    }),

    // --- CATEGORIAS DO RODAPÉ ---
    defineField({
      name: 'categoriasRodape',
      title: 'Categorias Exibidas no Rodapé',
      description: 'Escolha e ordene quais categorias aparecem na coluna do rodapé.',
      type: 'array',
      group: 'categorias',
      of: [{ type: 'reference', to: [{ type: 'categoria' }] }],
    }),
    defineField({
      name: 'categoriasMultimidiaRodape',
      title: 'Categorias de Multimídia no Rodapé (Opcional)',
      type: 'array',
      group: 'categorias',
      of: [{ type: 'reference', to: [{ type: 'categoria' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'nomeSindicato',
      subtitle: 'temaFundoSite',
      media: 'logoSindicato',
    },
    prepare({ title, subtitle, media }) {
      const mapaTema: Record<string, string> = {
        padrao: 'Tema: Padrão',
        'novembro-azul': 'Tema: Novembro Azul',
        'outubro-rosa': 'Tema: Outubro Rosa',
      }
      return {
        title: title || 'Configurações do Portal',
        subtitle: mapaTema[subtitle || 'padrao'] || 'Configurações gerais',
        media,
      }
    },
  },
})