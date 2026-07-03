import { chromium } from '@playwright/test';
const BASE = 'http://localhost:5918';
const log = (...a) => console.log('[RC]', ...a);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', (e) => log('PAGE ERROR:', e.message));

async function waitForScene(locationId) {
  await page.locator(`[data-scene-ready="${locationId}"]`).waitFor({ state: 'attached', timeout: 20000 });
}
async function clickStage(x, y) {
  await page.locator('canvas').click({ position: { x, y }, force: true });
}

// pre-seed localStorage with textSpeed=0 (instant) to test the DialogueBox
// consumption path independent of the broken Settings modal
await page.goto(BASE);
await page.evaluate(() => localStorage.setItem('gg_settings', JSON.stringify({ textSpeed: 0 })));
await page.reload();

await page.getByTestId('title-screen').waitFor({ state: 'visible', timeout: 20000 });
await page.getByTestId('title-new').click();
await page.getByTestId('title-screen').waitFor({ state: 'hidden', timeout: 5000 });
log('New Game: OK');

await page.getByTestId('hud-location').waitFor({ state: 'visible', timeout: 20000 });
await waitForScene('gary_apartment');
log('apartment scene ready: OK');

await clickStage(1760, 820);
await waitForScene('the_percolator');
await clickStage(820, 800);
await page.getByTestId('dialogue-box').waitFor({ state: 'visible', timeout: 10000 });
await page.waitForTimeout(30);
const l1 = await page.getByTestId('dialogue-line').innerText();
await page.waitForTimeout(500);
const l2 = await page.getByTestId('dialogue-line').innerText();
log('line @30ms:', JSON.stringify(l1));
log('line @530ms:', JSON.stringify(l2));
log('instant-text pipeline (pre-seeded localStorage) works:', l1 === l2 && l1.length > 3);

await page.getByTestId('hud-save').click();
await page.getByTestId('toast').waitFor({ state: 'visible', timeout: 5000 });
const toast = await page.getByTestId('toast').innerText();
log('save toast:', toast);

await page.reload();
await page.getByTestId('title-screen').waitFor({ state: 'visible', timeout: 20000 });
const hasContinue = await page.getByTestId('title-continue').count();
log('Continue button present after reload:', hasContinue > 0);
if (hasContinue) {
  const t = await page.getByTestId('title-continue').innerText();
  log('Continue label:', t);
  await page.getByTestId('title-continue').click();
  await page.getByTestId('title-screen').waitFor({ state: 'hidden', timeout: 5000 });
  await page.getByTestId('hud-location').waitFor({ state: 'visible', timeout: 20000 });
  const loc = await page.getByTestId('hud-location').innerText();
  log('location restored after Continue:', loc);
}

await browser.close();
log('DONE');
