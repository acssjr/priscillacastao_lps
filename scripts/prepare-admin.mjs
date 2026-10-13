import { randomBytes } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
let text = await readFile(".env.local", "utf8").catch(error => { if (error.code !== "ENOENT") throw error; return ""; });
const line = text.split(/\r?\n/).find(line => line.startsWith("ADMIN_SESSION_SECRET="));
if (!line || line.slice("ADMIN_SESSION_SECRET=".length).trim().length < 32) {
  text = text.replace(/^ADMIN_SESSION_SECRET=.*$/m, "");
  text += "\nADMIN_SESSION_SECRET=" + randomBytes(32).toString("hex") + "\n";
}
text = text.replace(/^ADMIN_SETUP_TOKEN=.*\r?\n?/gm, "");
await writeFile(".env.local", text, { mode: 0o600 });
console.log("Segredo de sessão configurado. O acesso ao painel usa somente usuário e senha.");
