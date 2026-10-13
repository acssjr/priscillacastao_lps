// @vitest-environment node
import { beforeEach, afterEach, describe, expect, it, vi } from "vitest";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
const jar = new Map<string,string>();
vi.mock("next/headers", () => ({ cookies: async () => ({
  get: (name: string) => jar.has(name) ? { value: jar.get(name) } : undefined,
  set: (name: string, value: string) => jar.set(name, value),
  delete: (name: string) => jar.delete(name),
}) }));
let directory: string;
beforeEach(async () => {
  vi.resetModules(); jar.clear();
  directory = await mkdtemp(path.join(tmpdir(), "priscilla-cms-"));
  vi.stubEnv("CMS_DATA_DIRECTORY", directory); vi.stubEnv("DATABASE_URL", "");
  vi.stubEnv("ADMIN_SESSION_SECRET", "test-session-secret-independent-1234567890");
  vi.stubEnv("NODE_ENV", "test");
});
afterEach(async () => { await rm(directory, { recursive: true, force: true }); vi.unstubAllEnvs(); });
async function request(body: Record<string,unknown>, origin = "http://localhost:3003") {
  const { POST } = await import("@/app/api/admin/route");
  return POST(new Request("http://localhost:3003/api/admin", { method: "POST", headers: { origin, "content-type":"application/json" }, body: JSON.stringify(body) }));
}
async function activate() {
  const { mutateState } = await import("./store");
  const { hashPassword } = await import("./auth");
  await mutateState(state => {
    state.users.push({id:"fixture-admin",username:"priscilla",name:"Administrador",role:"admin",active:true,
      password:hashPassword("test-password-123"),version:1,createdAt:new Date().toISOString(),lastLoginAt:null});
  },false);
  expect((await request({action:"login",username:"priscilla",password:"test-password-123"})).status).toBe(200);
}

describe("CMS real persistence and authorization", () => {
  it("blocks anonymous reads, public registration and cross-origin login", async () => {
    const { GET } = await import("@/app/api/admin/route");
    expect((await GET()).status).toBe(401);
    expect((await request({ action:"login" }, "https://untrusted.example")).status).toBe(400);
    expect((await request({ action:"setup" })).status).toBe(401);
    await expect((await import("./store")).readState().then(s => s.users)).resolves.toHaveLength(0);
  });
  it("separates draft, publication and restore without changing the other campaigns", async () => {
    await activate();
    const { GET } = await import("@/app/api/admin/route");
    const original = await (await GET()).json();
    const values = structuredClone(original.draft);
    values["forro-do-zero"].faq.title = "Dúvidas editadas pelo painel";
    values["forro-do-zero"].whatsapp.phone = "5571999999999";
    const saved = await (await request({ action:"save", revision:original.revision, values })).json();
    expect(saved.published["forro-do-zero"].faq.title).toBe(original.published["forro-do-zero"].faq.title);
    const published = await (await request({ action:"publish", revision:saved.revision, values })).json();
    expect(published.published["forro-do-zero"].faq.title).toBe("Dúvidas editadas pelo painel");
    expect(published.published["forro-evolucao"]).toEqual(original.published["forro-evolucao"]);
    expect(published.history).toHaveLength(1);
    const restored = await (await request({ action:"restore", revision:published.revision, id:published.history[0].id })).json();
    expect(restored.draft).toEqual(original.published);
    expect(restored.published).toEqual(published.published);
  });
  it("rejects stale revisions without losing a saved draft", async () => {
    await activate();
    const { readState } = await import("./store");
    const initial = await readState(), values = structuredClone(initial.draft);
    values["forro-roots"].faq.title = "Novo título do roots";
    expect((await request({ action:"save", revision:initial.contentRevision, values })).status).toBe(200);
    expect((await request({ action:"publish", revision:initial.contentRevision, values:initial.draft })).status).toBe(400);
    expect((await readState()).draft["forro-roots"].faq.title).toBe("Novo título do roots");
  });
  it("rejects structural changes, external image URLs and nonexistent uploads", async () => {
    await activate();
    const { defaults } = await import("./catalog");
    for (const field of ["route","image","media"]) {
      const values = structuredClone(defaults);
      if (field === "route") values["forro-do-zero"].route = "/wrong";
      else values["forro-do-zero"].hero.image.src = field === "image" ? "//untrusted.example/image.webp" : "/api/media/00000000-0000-4000-8000-000000000000";
      expect((await request({ action:"save", revision:0, values })).status).toBe(400);
    }
  });
  it("allows FAQ growth and reordering while rejecting empty answers", async () => {
    const { defaults, validateContent } = await import("./catalog");
    const values = structuredClone(defaults);
    values["forro-do-zero"].faq.items.push({ question:"Como remarcar uma aula?", answer:"Entre em contato para combinar uma nova data." });
    values["forro-do-zero"].faq.items.reverse();
    expect(validateContent(values)["forro-do-zero"].faq.items[0].question).toBe("Como remarcar uma aula?");
    values["forro-do-zero"].faq.items[0].answer = "";
    expect(() => validateContent(values)).toThrow();
  });
  it("invalidates signed sessions after logout and password changes", async () => {
    await activate();
    const { createSession, validSession, currentUser } = await import("./auth");
    const user = (await currentUser())!;
    const oldToken = createSession(user.id,user.version);
    expect(validSession(oldToken,user.id,user.version)).toBe(true);
    expect((await request({ action:"password", current:"test-password-123", password:"replacement-password-123" })).status).toBe(200);
    expect(validSession(oldToken,user.id,(await currentUser())!.version)).toBe(false);
    expect((await request({ action:"logout" })).status).toBe(200);
    expect(await currentUser()).toBeNull();
    expect((await request({ action:"save", revision:0, values:{} })).status).toBe(401);
  });
  it("throttles repeated bad passwords and rejects public registration", async () => {
    await activate();
    expect((await request({ action:"setup", username:"another", password:"another-password" })).status).toBe(400);
    await request({ action:"logout" });
    for (let i=0;i<5;i++) expect((await request({ action:"login", username:"priscilla", password:"wrong" })).status).toBe(401);
    expect((await request({ action:"login", username:"priscilla", password:"test-password-123" })).status).toBe(401);
  });
  it("protects user management and revokes sessions of disabled editors", async () => {
    await activate();
    const { POST } = await import("@/app/api/admin/users/route");
    const userRequest = (body: Record<string,unknown>) => POST(new Request("http://localhost:3003/api/admin/users", { method:"POST", headers:{ origin:"http://localhost:3003" }, body:JSON.stringify(body) }));
    const created = await (await userRequest({ action:"create", name:"Editor de teste", username:"editor", role:"editor", password:"editor-password" })).json();
    const editor = created.users.find((user: {username:string}) => user.username === "editor");
    const admin = created.users.find((user: {username:string}) => user.username === "priscilla");
    expect((await userRequest({ action:"access", id:admin.id, active:false })).status).toBe(400);
    const { createSession, COOKIE } = await import("./auth");
    const editorToken = createSession(editor.id,1), adminToken = jar.get(COOKIE)!;
    jar.set(COOKIE,editorToken);
    expect((await userRequest({ action:"create", name:"Inválido", username:"invalid",role:"admin",password:"some-password" })).status).toBe(403);
    jar.set(COOKIE,adminToken);
    expect((await userRequest({ action:"access", id:editor.id, active:false })).status).toBe(200);
    jar.set(COOKIE,editorToken);
    expect(await (await import("./auth")).currentUser()).toBeNull();
  });
  it("keeps public defaults available without a production database", async () => {
    vi.stubEnv("NODE_ENV","production");
    const { publicContent, readState } = await import("./store");
    const spy = vi.spyOn(console,"error").mockImplementation(() => {});
    await expect(readState()).rejects.toThrow("DATABASE_URL");
    expect((await publicContent())["forro-do-zero"].id).toBe("forro-do-zero");
    spy.mockRestore();
  });
});
