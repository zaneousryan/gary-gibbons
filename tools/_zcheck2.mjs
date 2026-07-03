import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await page.goto('http://localhost:5918');
await page.getByTestId('title-screen').waitFor({ state: 'visible' });
await page.getByTestId('title-settings').click();
await page.getByTestId('settings').waitFor({ state: 'visible' });
try {
  await page.locator('button:has-text("instant")').click({ timeout: 3000 });
  console.log('instant text-speed button click: SUCCEEDED');
} catch (e) {
  console.log('instant text-speed button click: FAILED -', e.message.split('\n')[0]);
}
try {
  await page.keyboard.press('Escape');
  const visible = await page.getByTestId('settings').isVisible();
  console.log('after Escape, settings still visible:', visible);
} catch (e) {
  console.log('Escape attempt error:', e.message);
}
await browser.close();
