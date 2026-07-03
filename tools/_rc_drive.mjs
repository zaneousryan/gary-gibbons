// TEMP RC drive script — gg-verifier hand inspection, deleted after use.
import { chromium } from '@playwright/test';

const BASE = 'http://localhost:5918';
const log = (...a) => console.log('[RC]', ...a);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', (e) => log('PAGE ERROR:', e.message));
page.on('console', (m) => { if (m.type() === 'error') log('CONSOLE ERROR:', m.text()); });

async function waitForScene(locationId) {
  await page.locator(`[data-scene-ready="${locationId}"]`).waitFor({ state: 'attached', timeout: 20000 });
}
async function clickStage(x, y) {
  await page.locator('canvas').click({ position: { x, y }, force: true });
}

// 1. title screen renders
await page.goto(BASE);
await page.getByTestId('title-screen').waitFor({ state: 'visible', timeout: 20000 });
log('title screen rendered: OK');

// 2. Settings opens/closes
await page.getByTestId('title-settings').click();
await page.getByTestId('settings').waitFor({ state: 'visible', timeout: 5000 });
log('settings opened: OK');
await page.getByTestId('settings-close').click();
await page.getByTestId('settings').waitFor({ state: 'hidden', timeout: 5000 });
log('settings closed: OK');

// 3. New Game
await page.getByTestId('title-new').click();
await page.getByTestId('title-screen').waitFor({ state: 'hidden', timeout: 5000 });
log('new game clicked: title screen hidden');

// 4. apartment scene
await page.getByTestId('hud-location').waitFor({ state: 'visible', timeout: 20000 });
const loc = await page.getByTestId('hud-location').innerText();
log('hud-location:', loc);
await waitForScene('gary_apartment');
log('apartment scene ready: OK');

// 5. set text speed instant via settings
await page.getByTestId('title-settings').click().catch(async () => {
  // if title-settings not present in-game, use a generic settings toggle
});
// In-game settings likely opened via HUD; try to locate a settings button.
let settingsOpened = false;
try {
  await page.getByTestId('settings').waitFor({ state: 'visible', timeout: 3000 });
  settingsOpened = true;
} catch {}
if (!settingsOpened) {
  // try HUD settings button test ids
  const candidates = ['hud-settings', 'settings-open'];
  for (const c of candidates) {
    const el = page.getByTestId(c);
    if (await el.count()) {
      await el.click();
      settingsOpened = true;
      break;
    }
  }
}
log('settings opened from in-game:', settingsOpened);
if (settingsOpened) {
  const instantBtn = page.locator('button:has-text("instant")');
  await instantBtn.click();
  log('text speed set to instant: clicked');
  await page.getByTestId('settings-close').click();
}

// walk to percolator, open dialogue with Dot
await clickStage(1760, 820);
await waitForScene('the_percolator');
log('walked to percolator: OK');
await clickStage(820, 800);
await page.getByTestId('dialogue-box').waitFor({ state: 'visible', timeout: 10000 });
log('dialogue opened: OK');
// check the line is rendered complete immediately (no visible typewriter progression)
await page.waitForTimeout(50);
const line1 = await page.getByTestId('dialogue-line').innerText();
await page.waitForTimeout(400);
const line2 = await page.getByTestId('dialogue-line').innerText();
log('line at t=50ms:', JSON.stringify(line1));
log('line at t=450ms:', JSON.stringify(line2));
log('instant text confirmed (line unchanged, non-empty):', line1 === line2 && line1.length > 0);

// close dialogue by clicking through if it's a single-line, else leave as is; try to close via Escape
await page.keyboard.press('Escape').catch(() => {});

// 6. save via HUD
await page.getByTestId('hud-save').click({ force: true }).catch(async () => {
  log('hud-save click failed, dialogue may still be open, attempting to advance/close it first');
});
let toastText = '';
try {
  await page.getByTestId('toast').waitFor({ state: 'visible', timeout: 5000 });
  toastText = await page.getByTestId('toast').innerText();
} catch (e) {
  log('save toast wait failed:', e.message);
}
log('save toast:', toastText);

// 7. reload page
await page.reload();
await page.getByTestId('title-screen').waitFor({ state: 'visible', timeout: 20000 });
const hasContinue = await page.getByTestId('title-continue').count();
log('title screen after reload shows Continue button:', hasContinue > 0);
if (hasContinue > 0) {
  const continueText = await page.getByTestId('title-continue').innerText();
  log('continue button text:', continueText);
}

// 8. Continue restores
if (hasContinue > 0) {
  await page.getByTestId('title-continue').click();
  await page.getByTestId('title-screen').waitFor({ state: 'hidden', timeout: 5000 });
  await page.getByTestId('hud-location').waitFor({ state: 'visible', timeout: 20000 });
  const locAfter = await page.getByTestId('hud-location').innerText();
  log('location after Continue:', locAfter);
}

await browser.close();
log('DONE');
