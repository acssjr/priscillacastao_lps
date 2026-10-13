import { defineConfig, devices } from "@playwright/test";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { tmpdir } from "node:os";
const testDirectory = process.env.CMS_TEST_DIRECTORY ||= path.join(tmpdir(),"priscilla-admin-e2e-" + randomUUID());
export default defineConfig({
  testDir: "./e2e", testMatch: "admin.spec.ts", workers: 1, timeout: 60000,
  use: { baseURL:"http://localhost:3003", trace:"retain-on-failure" },
  webServer: {
    command:"npm run dev -- --port 3003",
    url:"http://localhost:3003/admin", reuseExistingServer:false,
    env:{ NEXT_DIST_DIR:".next-admin", CMS_DATA_DIRECTORY:testDirectory, DATABASE_URL:"",
      ADMIN_SESSION_SECRET:"e2e-session-secret-independent-1234567890" },
  },
  projects:[{ name:"desktop",use:{...devices["Desktop Chrome"],viewport:{width:1440,height:1000}} }],
});
