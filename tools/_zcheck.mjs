import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('http://localhost:5918');
await page.getByTestId('title-screen').waitFor({ state: 'visible' });
await page.getByTestId('title-settings').click();
await page.getByTestId('settings').waitFor({ state: 'visible' });
const titleZ = await page.getByTestId('title-screen').evaluate(el => getComputedStyle(el).zIndex);
const settingsZ = await page.getByTestId('settings').evaluate(el => getComputedStyle(el).zIndex);
console.log('title-screen z-index:', titleZ);
console.log('settings z-index:', settingsZ);
// try clicking settings-close with a short timeout, catch and report
try {
  await page.getByTestId('settings-close').click({ timeout: 3000 });
  console.log('settings-close click: SUCCEEDED');
} catch (e) {
  console.log('settings-close click: FAILED -', e.message.split('\n')[0]);
}
await browser.close();
