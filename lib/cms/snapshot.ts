import { publicUser, type CmsState, type CmsUser } from "./store";
export function publicState(state: CmsState, user: CmsUser) {
  return { revision: state.contentRevision, draft: state.draft, published: state.published,
    publishedAt: state.publishedAt, history: state.history, media: state.media, user: publicUser(user),
    storage: process.env.DATABASE_URL ? "database" as const : "local" as const };
}
export type Snapshot = ReturnType<typeof publicState>;
