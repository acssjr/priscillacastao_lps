import { randomBytes, randomUUID, scryptSync } from "node:crypto";
import { readFile, writeFile, rename, mkdir } from "node:fs/promises";
import path from "node:path";
import { neon } from "@neondatabase/serverless";
try { process.loadEnvFile(".env.local"); } catch (error) { if (error.code !== "ENOENT") throw error; }
const directory = process.env.CMS_DATA_DIRECTORY || path.join(process.cwd(), ".cms");
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
const stateFile = path.join(directory,"state.json");
let state;
try { state = sql ? (await sql`SELECT state FROM priscilla_cms WHERE id=1`)[0]?.state : JSON.parse(await readFile(stateFile,"utf8")); }
catch { throw new Error("Abra /admin uma vez para inicializar o armazenamento e execute novamente."); }
if (!state) throw new Error("O armazenamento ainda não foi inicializado. Abra /admin e execute novamente.");
if (state.users.some(user => user.username === "admin")) {
  console.log("O usuário admin já existe. A senha e os dados foram preservados.");
} else {
  const password = process.env.ADMIN_INITIAL_PASSWORD || randomBytes(18).toString("base64url");
  if (password.length < 8 || password.length > 128) throw new Error("A senha inicial deve ter de 8 a 128 caracteres.");
  const salt = randomBytes(16).toString("hex"), revision = state.revision;
  state.users.push({ id:randomUUID(),username:"admin",name:"Administrador",role:"admin",active:true,
    password:salt + ":" + scryptSync(password,salt,64).toString("hex"),version:1,
    createdAt:new Date().toISOString(),lastLoginAt:null });
  state.revision++;
  await mkdir(directory,{recursive:true});
  const credentialsFile = path.join(directory,sql ? "admin-producao.txt" : "admin-local.txt");
  // Write the private handoff before committing the account so failed file writes cannot lose its password.
  await writeFile(credentialsFile,"Acesso ao painel de Priscilla Castão\n\nUsuário: admin\nSenha inicial: " + password + "\n\nEntre em /admin. Para alterar a senha, use Minha conta. Novos acessos são criados em Usuários > Adicionar usuário.\n",{mode:0o600});
  if (sql) {
    const rows = await sql`UPDATE priscilla_cms SET state=${JSON.stringify(state)}::jsonb,revision=${state.revision} WHERE id=1 AND revision=${revision} RETURNING id`;
    if (!rows.length) throw new Error("Os dados mudaram durante o cadastro. Execute novamente.");
  } else {
    const temporary = path.join(directory,randomUUID() + ".tmp");
    await writeFile(temporary,JSON.stringify(state),{mode:0o600});
    await rename(temporary,stateFile);
  }
  console.log("Usuário admin cadastrado. Senha inicial salva no arquivo privado: " + credentialsFile);
}
