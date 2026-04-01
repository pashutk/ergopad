import { test, expect, Page, BrowserContext } from '@playwright/test';

// Intercept clipboard writes so tests don't need real clipboard permissions.
async function setupClipboardMock(page: Page) {
  await page.addInitScript(() => {
    let lastCopied = '';
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: (text: string) => {
          lastCopied = text;
          (window as any).__lastCopied = text;
          return Promise.resolve();
        },
        readText: () => Promise.resolve(lastCopied),
      },
      writable: true,
      configurable: true,
    });
  });
}

async function gotoApp(page: Page) {
  await page.goto('/ergopad');
  // Wait for the app to finish loading (past Initialization/Loading states)
  await expect(page.getByRole('button', { name: 'middle' })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await setupClipboardMock(page);
});

test('page loads — drawing surface and column buttons are visible', async ({ page }) => {
  await gotoApp(page);
  // Two.js appends an SVG (its default renderer) inside .boo
  await expect(page.locator('.boo')).toBeVisible();
  for (const col of ['thumb', 'index_far', 'index', 'middle', 'ring', 'pinky']) {
    await expect(page.getByRole('button', { name: col, exact: true })).toBeVisible();
  }
});

test('middle column is active by default', async ({ page }) => {
  await gotoApp(page);
  // Active column has "outline" layout — Windmill renders it with border classes.
  // Verify it has a distinct class compared to the others.
  const middleBtn = page.getByRole('button', { name: 'middle' });
  const thumbBtn = page.getByRole('button', { name: 'thumb' });
  const middleClass = await middleBtn.getAttribute('class');
  const thumbClass = await thumbBtn.getAttribute('class');
  expect(middleClass).not.toBe(thumbClass);
});

test('column switching changes the active column', async ({ page }) => {
  await gotoApp(page);
  const pinkyBtn = page.getByRole('button', { name: 'pinky' });
  const middleBtn = page.getByRole('button', { name: 'middle' });

  const middleClassBefore = await middleBtn.getAttribute('class');
  await pinkyBtn.click();
  const middleClassAfter = await middleBtn.getAttribute('class');
  const pinkyClassAfter = await pinkyBtn.getAttribute('class');

  // middle should no longer be "outline"
  expect(middleClassBefore).not.toBe(middleClassAfter);
  // pinky should now be "outline" (different from middle's non-active class)
  expect(pinkyClassAfter).toBe(middleClassBefore);
});

test('clicking on canvas adds points (verified via export)', async ({ page }) => {
  await gotoApp(page);

  const touchArea = page.locator('.touchytouchy');
  const box = await touchArea.boundingBox();
  expect(box).not.toBeNull();

  // Add 3 points to the middle column (default)
  for (const [x, y] of [[100, 150], [200, 200], [150, 250]]) {
    await page.mouse.move(box!.x + x, box!.y + y);
    await page.mouse.down();
    await page.mouse.up();
  }

  // Export → Raw and check clipboard content
  await page.getByText('Export').click();
  await page.getByText('Raw').click();

  const copied = await page.evaluate(() => (window as any).__lastCopied);
  const data = JSON.parse(copied);
  expect(data.middle).toHaveLength(3);
  expect(data.middle[0]).toMatchObject({ x: expect.any(Number), y: expect.any(Number) });
});

test('reset column clears points for the active column only', async ({ page }) => {
  await gotoApp(page);

  const touchArea = page.locator('.touchytouchy');
  const box = await touchArea.boundingBox();
  expect(box).not.toBeNull();

  // Add a point to middle (default) and a point to ring
  await page.mouse.move(box!.x + 100, box!.y + 100);
  await page.mouse.down();
  await page.mouse.up();

  await page.getByRole('button', { name: 'ring' }).click();
  await page.mouse.move(box!.x + 200, box!.y + 200);
  await page.mouse.down();
  await page.mouse.up();

  // Switch back to middle and reset
  await page.getByRole('button', { name: 'middle' }).click();
  await page.getByRole('button', { name: /reset column/i }).click();

  await page.getByText('Export').click();
  await page.getByText('Raw').click();
  const data = JSON.parse(await page.evaluate(() => (window as any).__lastCopied));

  expect(data.middle).toHaveLength(0);
  expect(data.ring).toHaveLength(1);
});

test('reset all clears all columns', async ({ page }) => {
  await gotoApp(page);

  const touchArea = page.locator('.touchytouchy');
  const box = await touchArea.boundingBox();
  expect(box).not.toBeNull();

  await page.mouse.move(box!.x + 100, box!.y + 100);
  await page.mouse.down();
  await page.mouse.up();

  await page.getByRole('button', { name: /reset all/i }).click();

  await page.getByText('Export').click();
  await page.getByText('Raw').click();
  const data = JSON.parse(await page.evaluate(() => (window as any).__lastCopied));

  for (const col of ['thumb', 'index_far', 'index', 'middle', 'ring', 'pinky']) {
    expect(data[col]).toHaveLength(0);
  }
});

test('aux lines checkbox toggles', async ({ page }) => {
  await gotoApp(page);
  const checkbox = page.locator('input[type="checkbox"]');
  await expect(checkbox).toBeChecked();
  await checkbox.click();
  await expect(checkbox).not.toBeChecked();
  await checkbox.click();
  await expect(checkbox).toBeChecked();
});

test('scale calibration modal opens and closes', async ({ page }) => {
  await gotoApp(page);
  await page.getByRole('button', { name: /tune scale/i }).click();
  await expect(page.getByText('Tune scale factor')).toBeVisible();
  await page.getByRole('button', { name: /ok/i }).click();
  await expect(page.getByText('Tune scale factor')).not.toBeVisible();
});

test('ppm persists across page reloads', async ({ page }) => {
  await gotoApp(page);

  // Open the scale modal, enter a value, and close
  await page.getByRole('button', { name: /tune scale/i }).click();
  await expect(page.getByText('Tune scale factor')).toBeVisible();

  // The input controls ppm via a calculation based on the red line width.
  // Verify that after interaction, localStorage retains a stored_ppm value.
  await page.fill('input[type="number"]', '100');
  await page.getByRole('button', { name: /ok/i }).click();

  const ppmBefore = await page.evaluate(() =>
    window.localStorage.getItem('stored_ppm'),
  );
  expect(ppmBefore).not.toBeNull();

  // Reload and verify ppm is restored
  await page.reload();
  await expect(page.getByRole('button', { name: 'middle' })).toBeVisible();

  const ppmAfter = await page.evaluate(() =>
    window.localStorage.getItem('stored_ppm'),
  );
  expect(ppmAfter).toBe(ppmBefore);
});
