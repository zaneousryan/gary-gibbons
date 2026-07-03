// Playwright smoke (tech spec §11): boot, walk, talk, save/reload.
// Viewport is the 1920×1080 design resolution, so canvas clicks map 1:1 to
// design coordinates (the canvas letterboxes only at other aspect ratios).

import { test, expect, type Page } from '@playwright/test';

/** Wait for PixiStage to finish its async scene build for a location. */
async function waitForScene(page: Page, locationId: string) {
  await expect(page.locator(`[data-scene-ready="${locationId}"]`)).toBeAttached({ timeout: 20_000 });
}

async function clickStage(page: Page, x: number, y: number) {
  const canvas = page.locator('canvas');
  await canvas.click({ position: { x, y }, force: true });
}

/** Click through a running conversation, always choosing PRESS. */
async function playConversation(page: Page) {
  const box = page.getByTestId('dialogue-box');
  await expect(box).toBeVisible();
  for (let i = 0; i < 40; i++) {
    if (!(await box.isVisible())) return;
    const press = page.getByTestId('stance-press');
    const line = page.getByTestId('dialogue-line');
    const advance = page.getByTestId('dialogue-advance');
    if (await press.isVisible()) {
      await press.click();
    } else if (await advance.isVisible()) {
      await advance.click();
    } else if (await line.isVisible()) {
      await line.click(); // completes typing, then advances
    }
    await page.waitForTimeout(120);
  }
  throw new Error('conversation did not finish in 40 interactions');
}

test('boot → walk → talk → save → reload', async ({ page }) => {
  await page.goto('/');

  // boot: content loads, apartment scene appears
  await expect(page.getByTestId('hud-location')).toHaveText("Gary's Apartment", { timeout: 20_000 });
  await expect(page.getByTestId('hud-clock')).toContainText('Day 1');
  await expect(page.locator('canvas')).toBeVisible();
  await waitForScene(page, 'gary_apartment');

  // walk: click the exit hotspot; Gary walks there, scene changes
  await clickStage(page, 1760, 820);
  await expect(page.getByTestId('hud-location')).toHaveText('The Percolator', { timeout: 15_000 });

  // talk: Dot's talk hotspot opens the red-pens conversation
  await waitForScene(page, 'the_percolator');
  await clickStage(page, 820, 800);
  await playConversation(page);

  // the conversation banked its card — verify via a fresh talk attempt (oncePerDay toast)
  await clickStage(page, 820, 800);
  await expect(page.getByTestId('toast')).toBeVisible({ timeout: 10_000 });

  // save
  await page.getByTestId('hud-save').click();
  await expect(page.getByTestId('toast')).toContainText('Saved');

  // walk home, then load — we should be back at the Percolator
  await clickStage(page, 160, 820);
  await expect(page.getByTestId('hud-location')).toHaveText("Gary's Apartment", { timeout: 15_000 });
  await waitForScene(page, 'gary_apartment');
  await page.getByTestId('hud-load').click();
  await expect(page.getByTestId('hud-location')).toHaveText('The Percolator', { timeout: 10_000 });
});

test('examine and phase advance', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('hud-location')).toHaveText("Gary's Apartment", { timeout: 20_000 });
  await waitForScene(page, 'gary_apartment');

  // examine the board hotspot
  await clickStage(page, 960, 520);
  await expect(page.getByTestId('examine-panel')).toBeVisible({ timeout: 15_000 });
  await page.getByTestId('examine-close').click();

  // advance morning -> midday
  await page.getByTestId('hud-advance').click();
  await expect(page.getByTestId('hud-clock')).toContainText('midday');
});
