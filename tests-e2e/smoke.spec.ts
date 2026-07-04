// Playwright smoke (tech spec §11): boot, walk, talk, save/reload.
// Viewport is the 1920×1080 design resolution, so canvas clicks map 1:1 to
// design coordinates (the canvas letterboxes only at other aspect ratios).

import { test, expect, type Page } from '@playwright/test';

/** Wait for PixiStage to finish its async scene build for a location. */
async function waitForScene(page: Page, locationId: string) {
  await expect(page.locator(`[data-scene-ready="${locationId}"]`)).toBeAttached({ timeout: 20_000 });
}

/** Title → New Game (spec §8: Title → Save slots → Game). */
async function startNewGame(page: Page) {
  await page.goto('/');
  await expect(page.getByTestId('title-screen')).toBeVisible({ timeout: 20_000 });
  await page.getByTestId('title-new').click();
  await expect(page.getByTestId('title-screen')).not.toBeVisible();
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

test('settings usable from title AND in-game (RC gate)', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('title-screen')).toBeVisible({ timeout: 20_000 });

  // from the title screen: open, change a setting, close — clicks must land
  await page.getByTestId('title-settings').click();
  await expect(page.getByTestId('settings')).toBeVisible();
  await page.getByTestId('set-textscale-1.2').click();
  await expect(page.getByTestId('set-textscale-1.2')).toHaveClass(/border-amber/);
  await page.getByTestId('settings-close').click();
  await expect(page.getByTestId('settings')).not.toBeVisible();

  // persisted outside saves
  const stored = await page.evaluate(() => localStorage.getItem('gg_settings'));
  expect(JSON.parse(stored ?? '{}').textScale).toBe(1.2);

  // in-game: the HUD gear opens it; Escape closes it
  await page.getByTestId('title-new').click();
  await expect(page.getByTestId('hud-settings')).toBeVisible({ timeout: 20_000 });
  await page.getByTestId('hud-settings').click();
  await expect(page.getByTestId('settings')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('settings')).not.toBeVisible();
});

test('boot → walk → talk → save → reload', async ({ page }) => {
  await startNewGame(page);

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

  // the conversation banked its card — a fresh talk attempt gets the trust-tier
  // greeting instead of a re-run (oncePerDay + III.23.3)
  await clickStage(page, 820, 800);
  await expect(page.getByTestId('greeting-bubble')).toBeVisible({ timeout: 10_000 });

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
  await startNewGame(page);
  await expect(page.getByTestId('hud-location')).toHaveText("Gary's Apartment", { timeout: 20_000 });
  await waitForScene(page, 'gary_apartment');

  // walk: apartment → percolator (Dot: the red-pens case — tutorial fodder)
  await clickStage(page, 1760, 820);
  await waitForScene(page, 'the_percolator');
  await clickStage(page, 820, 800); // interview mode: no pathing, immediate
  await expect(page.getByTestId('interview-mode')).toBeVisible({ timeout: 10_000 });
  await playConversation(page);
  await expect(page.getByTestId('interview-mode')).not.toBeVisible();

  // → market row (Milo: the CRIMES? notebook)
  await clickStage(page, 1760, 820);
  await waitForScene(page, 'market_row');
  await clickStage(page, 1550, 800);
  await playConversation(page);

  // → founders' square
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
  await page.getByTestId('notebook-close').click();

  // night 1: "Later" sends Gary home; the gate holds until D1 is deduced
  await page.getByTestId('hud-advance').click();
  await expect(page.getByTestId('hud-clock')).toContainText('night');
  await expect(page.getByTestId('hud-location')).toHaveText("Gary's Apartment");
  await page.getByTestId('hud-advance').click(); // blocked
  await expect(page.getByTestId('hud-clock')).toContainText('Day 1');

  // the night ritual, first movement: the Evening Edition (II.15.1)
  await page.getByTestId('hud-edition').click();
  await expect(page.getByTestId('newspaper')).toBeVisible();
  await page.getByTestId('headline-h_d1_measured').click();
  await page.getByTestId('kicker-k_d1_facts').click();
  await page.getByTestId('paper-publish').click();
  await expect(page.getByTestId('paper-published')).toBeVisible({ timeout: 5_000 });
  await page.getByTestId('paper-close').click();

  // second movement: the board. First open ever → Gary teaches the loop
  // (playtest revision 2) using the Red Pen Bandit — a real pin→string→click
  // cycle, unaided, before the real case.
  await page.getByTestId('hud-board').click();
  await expect(page.getByTestId('board')).toBeVisible();
  await expect(page.getByTestId('board-tutorial')).toBeVisible();
  await expect(page.getByTestId('tut-sit')).toBeVisible();
  await page.getByTestId('tut-next').click();
  await expect(page.getByTestId('tut-pin')).toBeVisible();
  await page.getByTestId('tray-dots_missing_pens').click(); // tutorial advances by watching state
  await expect(page.getByTestId('tut-pin2')).toBeVisible();
  await page.getByTestId('tray-milos_crimes_notebook').click();
  await expect(page.getByTestId('tut-string')).toBeVisible();
  await page.getByTestId('pin-dots_missing_pens').click();
  await page.getByTestId('pin-milos_crimes_notebook').click();
  await page.getByTestId('board-tie').click();
  await expect(page.getByTestId('deduction-flash')).toBeVisible({ timeout: 5_000 });
  await expect(page.getByTestId('tut-click')).toBeVisible();
  await page.getByTestId('tut-next').click();
  await expect(page.getByTestId('tut-questions')).toBeVisible();
  await page.getByTestId('tut-done').click();
  await expect(page.getByTestId('board-tutorial')).not.toBeVisible();
  await expect(page.getByTestId('deduction-flash')).not.toBeVisible({ timeout: 6_000 });

  // the Open Questions strip shows tonight's gate with its slots ready
  await expect(page.getByTestId('open-q-d1_emptied_before')).toBeVisible();

  // now the real case: pin the two D1 cards, hold them, tie the string
  await page.getByTestId('tray-empty_vault').click();
  await page.getByTestId('tray-unforced_lock').click();
  await page.getByTestId('pin-empty_vault').click();
  await page.getByTestId('pin-unforced_lock').click();
  await page.getByTestId('board-tie').click();
  await expect(page.getByTestId('deduction-flash')).toBeVisible({ timeout: 5_000 });
  // its open question retires from the strip once the story clicks
  await expect(page.getByTestId('open-q-d1_emptied_before')).not.toBeVisible();
  await page.getByTestId('board-close').click();

  // gate opens: night -> day 2 morning, where Morning Pages waits (III.26)
  await page.getByTestId('hud-advance').click();
  await expect(page.getByTestId('hud-clock')).toContainText('Day 2');
  await expect(page.getByTestId('morning-pages')).toBeVisible({ timeout: 5_000 });
  await page.getByTestId('mp-q-q_who_emptied_the_capsule').click();
  await page.getByTestId('mp-commit').click();
  await expect(page.getByTestId('morning-pages')).not.toBeVisible();
});

test('day 2 dust library puzzle at the vault', async ({ page }) => {
  await startNewGame(page);
  await expect(page.getByTestId('hud-location')).toHaveText("Gary's Apartment", { timeout: 20_000 });
  await waitForScene(page, 'gary_apartment');

  // dev shortcut: jump the clock to Day 2 and teleport to the square
  await page.keyboard.press('`');
  await expect(page.getByTestId('dev-menu')).toBeVisible();
  await page.getByRole('button', { name: 'D2', exact: true }).click();
  await page.getByRole('button', { name: "Founders' Square" }).click();
  await page.keyboard.press('`');
  await waitForScene(page, 'founders_square');

  // Morning Pages fires on Day 2 — commit and carry on
  const mp = page.getByTestId('morning-pages');
  if (await mp.isVisible().catch(() => false)) {
    await page.getByTestId('mp-commit').click();
  }

  // the monument opens the Dust Library
  await clickStage(page, 820, 560);
  await expect(page.getByTestId('puzzle')).toBeVisible({ timeout: 15_000 });

  // match all four voids to Poppy's checklist
  const pairs: [string, string][] = [
    ['void_crate', 'item_crates'],
    ['void_bundle', 'item_letter_bundles'],
    ['void_tin', 'item_oilcloth_parcel'],
    ['void_envelope', 'item_sealed_envelope'],
  ];
  for (const [v, item] of pairs) {
    await page.getByTestId(`void-${v}`).click();
    await page.getByTestId(`checkitem-${item}`).click();
  }
  await page.getByTestId('puzzle-submit').click();
  await expect(page.getByTestId('puzzle')).not.toBeVisible({ timeout: 5_000 });
  await expect(page.getByTestId('inner-voice')).toBeVisible({ timeout: 5_000 }); // the sharp-edge chill

  // second visit yields the wax scrapings (II.12.4)
  await clickStage(page, 820, 560);
  await expect(page.getByTestId('examine-panel')).toBeVisible({ timeout: 15_000 });
  await expect(page.getByTestId('examine-panel')).toContainText('green wax');
});

test('examine and phase advance', async ({ page }) => {
  await startNewGame(page);
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

