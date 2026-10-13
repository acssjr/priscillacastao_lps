import { readMedia } from "@/lib/cms/store";
export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) return new Response(null, { status: 404 });
  try {
    const media = await readMedia(id);
    if (!media) return new Response(null, { status: 404 });
    return new Response(new Uint8Array(media.bytes), { headers: { "Content-Type": media.mime,
      "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
  } catch { return new Response(null, { status: 503 }); }
}
