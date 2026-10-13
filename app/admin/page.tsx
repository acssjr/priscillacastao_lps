import type { Metadata } from "next";
import { currentUser } from "@/lib/cms/auth";
import { readState } from "@/lib/cms/store";
import { publicState } from "@/lib/cms/snapshot";
import type { Snapshot } from "@/lib/cms/snapshot";
import { AdminPanel } from "@/components/cms/admin-panel";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Painel | Priscilla Castão", robots: { index: false, follow: false } };
export default async function AdminPage() {
  let initial: Snapshot | undefined;

  let unavailable = false;
  try {
    const state = await readState(), user = await currentUser();
    initial = user ? publicState(state, user) : undefined;

  } catch { unavailable = true; }
  return <AdminPanel key={initial?.user.id || "login"} mode={unavailable ? "unavailable" : initial ? "editor" : "login"} initial={initial} />;
}
