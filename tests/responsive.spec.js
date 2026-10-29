import { expect, test } from '@playwright/test';
import { expectFits } from './helpers';

const output = (page) => page.locator('#generated-password');
test.beforeEach(async ({ page }) => { await page.goto('/'); });

test.describe('viewport matrix', () => {
  const sizes = [
    [240, 600], [280, 653], [320, 568], [360, 800], [375, 667], [390, 844],
    [414, 896], [568, 320], [667, 375], [768, 1024], [820, 1180],
    [959, 900], [960, 900], [1024, 768], [1280, 720], [1440, 900], [1920, 1080], [2560, 1440],
  ];
  for (const [width, height] of sizes) {
    test(`fits ${width}x${height} with maximum-length output in both modes`, async ({ page }) => {
      await page.setViewportSize({ width, height });
      await expectFits(page);
      await page.getByRole('slider', { name: 'Password length' }).focus();
      await page.keyboard.press('End');
      await expect(output(page)).toHaveValue(/^[\s\S]{128}$/);
      await expectFits(page);
      await page.getByRole('radio', { name: 'Memorable passphrase' }).check();
      await page.getByRole('slider', { name: 'Number of words' }).focus();
      await page.keyboard.press('End');
      await expect(page.getByRole('slider', { name: 'Number of words' })).toHaveValue('10');
      expect((await output(page).inputValue()).split('-')).toHaveLength(10);
      await expectFits(page);
    });
  }
});
