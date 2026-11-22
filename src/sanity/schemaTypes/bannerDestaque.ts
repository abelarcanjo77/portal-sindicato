import { defineField, defineType } from "sanity";

export const bannerDestaque = defineType({
  name: "bannerDestaque",
  title: "Banner Destaque",
  type: "document",
  fields: [
    defineField({
      name: "titulo",
      title: "Identificação do Banner (Uso interno)",
      type: "string",
      description:
        "Ex: Campanha Salarial 2026/2027 ou Atualização Cadastral (usado também no alt da imagem).",
      validation: (Rule) => Rule.required().error("Informe um título de identificação."),
    }),
    defineField({
      name: "imagem",
      title: "Imagem do Banner",
      type: "image",
      description:
        "Tamanho recomendado: 1920 × 450 px (proporção aproximada 4:1) em JPG ou WebP com até 400 KB. Evite textos muito próximos da borda inferior, pois o botão flutuante ficará sobreposto na parte de baixo.",
      options: {
        hotspot: true,
      },
      validation: (Rule) => Rule.required().error("A imagem do banner é obrigatória."),
    }),
    defineField({
      name: "textoBotao",
      title: "Texto Principal do Botão Flutuante",
      type: "string",
      description: "Ex: FAZER MINHA ATUALIZAÇÃO CADASTRAL",
      validation: (Rule) =>
        Rule.required()
          .max(60)
          .error("Informe o texto do botão (máximo de 60 caracteres)."),
    }),
    defineField({
      name: "subtextoBotao",
      title: "Subtexto do Botão (Opcional)",
      type: "string",
      description: "Ex: (CLIQUE AQUI E SAIBA MAIS)",
      initialValue: "(CLIQUE AQUI E SAIBA MAIS)",
    }),
    defineField({
      name: "urlDestino",
      title: "URL de Destino do Botão",
      type: "string",
      description:
        "Cole um link externo (ex: https://...) ou uma rota interna do portal (ex: /noticias/campanha-salarial).",
      validation: (Rule) =>
        Rule.required().error("Informe a URL para onde o botão vai levar."),
    }),
    defineField({
      name: "abrirNovaAba",
      title: "Abrir link em nova aba?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "ordem",
      title: "Ordem de Exibição",
      type: "number",
      description: "Números menores aparecem primeiro no carrossel (ex: 1, 2, 3).",
      initialValue: 1,
    }),
    defineField({
      name: "ativo",
      title: "Banner Ativo?",
      type: "boolean",
      description: "Desmarque para ocultar temporariamente sem precisar excluir.",
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: "Ordem de Exibição",
      name: "ordemAsc",
      by: [{ field: "ordem", direction: "asc" }],
    },
  ],
  preview: {
    select: {
      title: "titulo",
      subtitle: "textoBotao",
      media: "imagem",
      ativo: "ativo",
    },
    prepare({ title, subtitle, media, ativo }) {
      return {
        title: `${ativo === false ? "[INATIVO] " : ""}${title}`,
        subtitle: subtitle ? `Botão: ${subtitle}` : "Sem texto de botão",
        media,
      };
    },
  },
});