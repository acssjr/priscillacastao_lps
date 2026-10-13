import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { currentUser, assertUser, sameOrigin } from "@/lib/cms/auth";
import { mutateState, saveMedia, readState } from "@/lib/cms/store";
import { publicState } from "@/lib/cms/snapshot";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const actor = await currentUser();
    if (!actor) return Response.json({ error: "Sua sessão expirou. Entre novamente." }, { status: 401 });
    if (Number(request.headers.get("content-length") || 0) > 3_200_000) throw new Error("A imagem deve ter até 3 MB.");
    const form = await request.formData(), file = form.get("file");
    if (!(file instanceof File) || file.size > 3_000_000 || !file.size) throw new Error("Selecione uma imagem de até 3 MB.");
    const input = Buffer.from(await file.arrayBuffer());
    const decoder = sharp(input, { limitInputPixels: 40_000_000, animated: false });
    const info = await decoder.metadata();
    if (!["jpeg", "png", "webp"].includes(info.format || "")) throw new Error("Envie uma imagem JPG, PNG ou WebP válida.");
    const { data: bytes, info: output } = await decoder.rotate().webp({ quality: 88 }).toBuffer({ resolveWithObject: true });
    const id = randomUUID(), media = { id, name: file.name.slice(0, 120), type: "image/webp", size: bytes.length,
      date: new Date().toISOString(), width: output.width, height: output.height };
    await mutateState(async asyncState => {
      assertUser(asyncState, actor);
      if (Number(form.get("revision")) !== asyncState.contentRevision) throw new Error("O conteúdo mudou em outra janela. Atualize o painel.");
      if (asyncState.media.length >= 500) throw new Error("A biblioteca atingiu o limite de 500 imagens.");
      await saveMedia(id, media.type, bytes);
      asyncState.media.unshift(media);
    });
    return Response.json({ media, snapshot: publicState(await readState(), actor) }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Não foi possível enviar a imagem." }, { status: 400 });
  }
}
