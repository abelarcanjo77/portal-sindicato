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
      name: "tipoMidia",
      title: "Tipo de mídia",
      type: "string",
      initialValue: "imagem",
      options: {
        list: [
          { title: "Imagem", value: "imagem" },
          { title: "Vídeo (Arquivo MP4 ou YouTube)", value: "video" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "imagem",
      title: "Imagem do pop-up",
      type: "image",
      options: { hotspot: true },
      hidden: ({ parent }) => parent?.tipoMidia === "video",
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as { tipoMidia?: string };
          if (parent?.tipoMidia !== "video" && !value) {
            return "Envie uma imagem para o pop-up.";
          }
          return true;
        }),
    }),
    defineField({
      name: "videoArquivo",
      title: "Arquivo de vídeo (MP4 / WebM)",
      type: "file",
      options: { accept: "video/*" },
      hidden: ({ parent }) => parent?.tipoMidia !== "video",
    }),
    defineField({
      name: "videoUrl",
      title: "Ou URL de vídeo (YouTube / Vimeo / MP4 externo)",
      type: "url",
      description: "Use se não enviar um arquivo acima.",
      hidden: ({ parent }) => parent?.tipoMidia !== "video",
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
      tipoMidia: "tipoMidia",
      media: "imagem",
    },
    prepare({ title, ativo, tipoMidia, media }) {
      const modo = tipoMidia === "video" ? "Vídeo" : "Imagem";
      return {
        title: title || "Pop-up sem título",
        subtitle: `${ativo ? "Ativo" : "Desativado"} • ${modo}`,
        media,
      };
    },
  },
});