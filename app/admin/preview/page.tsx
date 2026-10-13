import { redirect } from "next/navigation";
import { currentUser } from "@/lib/cms/auth";
import { readState } from "@/lib/cms/store";
import { campaignIds } from "@/lib/cms/catalog";
import { LivePreview } from "@/components/cms/live-preview";
export const dynamic = "force-dynamic";
export { metadata } from "../page";
export default async function PreviewPage({ searchParams }: { searchParams: Promise<{ campaign?: string; edit?: string }> }) {
  if (!await currentUser()) redirect("/admin");
  const { campaign, edit } = await searchParams;
  const id = campaignIds.find(id => id === campaign) || "forro-do-zero";
  return <LivePreview initial={(await readState()).draft[id]} editable={edit === "1"} />;
}
