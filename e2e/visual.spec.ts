import { test, expect, Page } from '@playwright/test';

async function setupClipboardMock(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: () => Promise.resolve() },
      writable: true,
      configurable: true,
    });
  });
}

async function gotoApp(page: Page) {
  await page.goto('/ergopad');
  await expect(page.getByRole('button', { name: 'middle' })).toBeVisible();
}

// Visual regression tests — snapshots are committed on first run and compared
// on subsequent runs. To update snapshots: npx playwright test --update-snapshots

test('initial empty state', async ({ page }) => {
  await setupClipboardMock(page);
  await gotoApp(page);
  await expect(page).toHaveScreenshot('initial-state.png');
});

test('with points added to middle column', async ({ page }) => {
  await setupClipboardMock(page);
  await gotoApp(page);

  const touchArea = page.locator('.touchytouchy');
  const box = await touchArea.boundingBox();
  expect(box).not.toBeNull();

  for (const [x, y] of [[150, 100], [170, 200], [190, 300], [200, 400]]) {
    await page.mouse.move(box!.x + x, box!.y + y);
    await page.mouse.down();
    await page.mouse.up();
  }

  await expect(page).toHaveScreenshot('middle-column-with-points.png');
});

test('after switching to pinky column', async ({ page }) => {
  await setupClipboardMock(page);
  await gotoApp(page);
  await page.getByRole('button', { name: 'pinky' }).click();
  await expect(page).toHaveScreenshot('pinky-column-selected.png');
});

test('scale calibration modal open', async ({ page }) => {
  await setupClipboardMock(page);
  await gotoApp(page);
  await page.getByRole('button', { name: /tune scale/i }).click();
  await expect(page.getByText('Tune scale factor')).toBeVisible();
  await expect(page).toHaveScreenshot('scale-modal-open.png');
});
