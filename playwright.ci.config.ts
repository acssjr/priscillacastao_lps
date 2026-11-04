import {defineConfig} from '@playwright/test'
export default defineConfig({
 testDir:'./e2e',testMatch:['booking-integrity.spec.ts','booking-availability.spec.ts','booking-accessibility.spec.ts','booking-responsive.spec.ts'],
 forbidOnly:true,retries:0,workers:1,reporter:process.env.CI?'github':'list',
 use:{baseURL:'http://127.0.0.1:3000',viewport:{width:390,height:844},reducedMotion:'reduce',trace:'retain-on-failure'},
 webServer:{command:'npm run start -- --hostname 127.0.0.1 --port 3000',url:'http://127.0.0.1:3000',reuseExistingServer:false,env:{DATABASE_URL:'',NEXT_PUBLIC_SITE_URL:'http://127.0.0.1:3000'}}
})
