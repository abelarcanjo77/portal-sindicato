import { defineField, defineType } from "sanity";

export const popupAviso = defineType({
  name: "popupAviso",
  title: "Pop-up de Entrada",
  type: "document",
  fields: [
    defineField({
      name: "ativo",
      title: "Ativar pop-up?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "titulo",
      title: "Título interno / Texto alternativo (acessibilidade)",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "imagem",
      title: "Imagem do pop-up",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "textoBotao",
      title: "Texto do botão",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "subtextoBotao",
      title: "Subtexto do botão (opcional)",
      type: "string",
    }),
    defineField({
      name: "urlDestino",
      title: "Link de redirecionamento",
      type: "string",
      description: "Ex.: /noticias/assembleia ou https://chat.whatsapp.com/...",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "abrirNovaAba",
      title: "Abrir link em nova aba?",
      type: "boolean",
      initialValue: true,
    }),
    defineField({
      name: "frequencia",
      title: "Frequência de exibição",
      type: "string",
      initialValue: "sessao",
      options: {
        list: [
          { title: "Uma vez por sessão do navegador", value: "sessao" },
          { title: "Sempre que abrir a Home", value: "sempre" },
        ],
        layout: "radio",
      },
    }),
  ],
  preview: {
    select: {
      title: "titulo",
      ativo: "ativo",
      media: "imagem",
    },
    prepare({ title, ativo, media }) {
      return {
        title: title || "Pop-up sem título",
        subtitle: ativo ? "Ativo no site" : "Desativado",
        media,
      };
    },
  },
});