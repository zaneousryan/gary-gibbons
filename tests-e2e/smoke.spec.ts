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
  for (let i = 0; i < 80; i++) {
    if (!(await box.isVisible())) return;
    const press = page.getByTestId('stance-press');
    const line = page.getByTestId('dialogue-line');
    try {
      if (await press.isVisible()) {
        await press.click({ timeout: 2000 });
      } else if (await line.isVisible()) {
        // first click completes the typewriter, second advances — both land here
        await line.click({ timeout: 2000 });
      }
    } catch {
      // node changed mid-click — loop re-evaluates
    }
    await page.waitForTimeout(140);
  }
  throw new Error('conversation did not finish in 80 interactions');
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

test('day 1 ceremony set-piece fires at the square', async ({ page }) => {
  test.setTimeout(180_000); // three scene walks + a 13-node set-piece
  await page.goto('/');
  await expect(page.getByTestId('hud-location')).toHaveText("Gary's Apartment", { timeout: 20_000 });
  await waitForScene(page, 'gary_apartment');

  // walk: apartment → percolator → market row → founders' square
  await clickStage(page, 1760, 820);
  await waitForScene(page, 'the_percolator');
  await clickStage(page, 1760, 820);
  await waitForScene(page, 'market_row');
  await clickStage(page, 1760, 820);
  await waitForScene(page, 'founders_square');
  await expect(page.getByTestId('hud-location')).toHaveText("Founders' Square");

  // advance to evening — the ceremony trigger fires unskippably
  await page.getByTestId('hud-advance').click();
  await page.getByTestId('hud-advance').click();
  await expect(page.getByTestId('dialogue-box')).toBeVisible({ timeout: 10_000 });
  await playConversation(page);

  // post-ceremony: the monument examine shows the empty vault text
  await waitForScene(page, 'founders_square');
  await clickStage(page, 820, 560);
  await expect(page.getByTestId('examine-panel')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('examine-panel')).toContainText('nothing at all');
  await page.getByTestId('examine-close').click();

  // the notebook recorded it
  await page.getByTestId('hud-notebook').click();
  await page.getByTestId('notebook-tab-questions').click();
  await expect(page.getByTestId('notebook-question-q_who_emptied_the_capsule')).toBeVisible();
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
