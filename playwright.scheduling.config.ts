import {defineConfig} from '@playwright/test'
export default defineConfig({testDir:'./e2e',testMatch:['booking-integrity.spec.ts','booking-availability.spec.ts'],use:{baseURL:'http://localhost:3002',viewport:{width:390,height:844},reducedMotion:'reduce'},workers:1})
