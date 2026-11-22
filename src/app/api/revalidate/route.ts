import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

interface WebhookPayload {
  _type?: string;
  slug?: {
    current?: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-revalidate-secret");

    if (
      !process.env.SANITY_REVALIDATE_SECRET ||
      secret !== process.env.SANITY_REVALIDATE_SECRET
    ) {
      return NextResponse.json(
        { message: "Token de revalidação inválido" },
        { status: 401 }
      );
    }

    const body = (await req.json()) as WebhookPayload;

    // Atualiza tags de cache específicas quando aplicável
    if (body?._type === "bannerDestaque") {
      revalidateTag("bannerDestaque", "max");
    }

    // Atualiza a home, últimas notícias, busca e categorias
    revalidatePath("/", "page");
    revalidatePath("/ultimasNoticias", "page");
    revalidatePath("/busca", "page");
    revalidatePath("/categoria/[slug]", "page");

    // Se for uma notícia com slug, atualiza também a página específica dela
    if (body?._type === "noticia" && body?.slug?.current) {
      revalidatePath(`/noticias/${body.slug.current}`, "page");
    } else if (body?._type !== "bannerDestaque") {
      revalidatePath("/noticias/[slug]", "page");
    }

    return NextResponse.json({
      revalidated: true,
      type: body?._type ?? "desconhecido",
      slug: body?.slug?.current ?? null,
    });
  } catch (error) {
    console.error("Erro no webhook de revalidação:", error);
    return NextResponse.json(
      { message: "Erro ao revalidar o cache" },
      { status: 500 }
    );
  }
}