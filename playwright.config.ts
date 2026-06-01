import { defineConfig } from '@playwright/test';
export default defineConfig({
    testDir: './tests',
    timeout: 40 * 1000,
    expect: {
        timeout: 30 * 1000,
    },
    reporter: [['html',{open:'never'}]],
    use: {
        browserName: 'chromium',
        headless: false,
    }
})