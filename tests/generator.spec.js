import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { expectFits } from './helpers';

const output = (page) => page.locator('#generated-password');
const feedback = (page) => page.getByRole('status', { name: 'Generator feedback' });

test.beforeEach(async ({ page }) => { await page.goto('/'); });

test('generates, changes settings, copies, and handles invalid settings', async ({ page }) => {
  await page.evaluate(() => {
    window.__copied = '';
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async (value) => { window.__copied = value; },
    } });
  });
  await expect(output(page)).toHaveValue(/^[\s\S]{20}$/);
  await page.getByRole('button', { name: 'Generate password' }).click();
  await expect(feedback(page)).toContainText('New password generated');
  await page.getByRole('button', { name: 'Copy password' }).click();
  await expect(feedback(page)).toContainText('Copied!');
  expect(await page.evaluate(() => window.__copied)).toBe(await output(page).inputValue());
  for (const name of [/Uppercase/, /Lowercase/, /Numbers/, /Symbols/]) {
    await page.getByRole('checkbox', { name }).uncheck();
  }
  await expect(page.getByRole('alert')).toContainText('Select at least one character type');
  await expect(output(page)).toHaveValue('');
  await expect(page.getByRole('button', { name: 'Copy password' })).toBeDisabled();
  await page.getByRole('checkbox', { name: /Numbers/ }).check();
  await expect(output(page)).toHaveValue(/^\d{20}$/);
  await expect(page.getByRole('alert')).toHaveCount(0);
  await expectFits(page);
});

test('handles clipboard denial and missing clipboard without claiming success', async ({ page }) => {
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: async () => { throw new Error('Permission denied'); },
    } });
  });
  await page.getByRole('button', { name: 'Copy password' }).click();
  await expect(feedback(page)).toContainText('Could not copy');
  await page.evaluate(() => { Object.defineProperty(navigator, 'clipboard', { value: undefined }); });
  await page.getByRole('button', { name: 'Copy password' }).click();
  await expect(feedback(page)).toContainText('copy it manually');
  await expect(output(page)).not.toHaveValue('');
});

test('copies through the native clipboard API', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Clipboard read/write permission automation is supported in Chromium.');
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  const value = await output(page).inputValue();
  await page.getByRole('button', { name: 'Copy password' }).click();
  await expect(feedback(page)).toContainText('Copied!');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(value);
});

test('supports touch input and switching to landscape', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Touch interaction runs in the iPhone, Android, and iPad profiles.');
  const slider = page.getByRole('slider', { name: 'Password length' });
  await slider.scrollIntoViewIfNeeded();
  const bounds = await slider.boundingBox();
  await page.touchscreen.tap(bounds.x + bounds.width * .75, bounds.y + bounds.height / 2);
  const length = Number(await slider.inputValue());
  expect(length).toBeGreaterThan(20);
  expect((await output(page).inputValue()).length).toBe(length);
  await expectFits(page);
  const size = page.viewportSize();
  await page.setViewportSize({ width: Math.max(size.width, size.height), height: Math.min(size.width, size.height) });
  await page.getByRole('radio', { name: 'Memorable passphrase' }).tap();
  await expect(page.getByRole('slider', { name: 'Number of words' })).toHaveValue('6');
  await page.getByRole('button', { name: 'Generate passphrase' }).tap();
  expect((await output(page).inputValue()).split('-')).toHaveLength(6);
  await expectFits(page);
});

test('fails closed if secure randomness is unavailable', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'crypto', { configurable: true, value: undefined });
  });
  await page.reload();
  await expect(page.getByRole('alert')).toContainText('Secure randomness is unavailable');
  await expect(output(page)).toHaveValue('');
  await expect(page.getByRole('button', { name: 'Copy password' })).toBeDisabled();
});

test('supports passphrase settings, touch-sized actions and all separators', async ({ page }) => {
  await page.getByRole('radio', { name: 'Memorable passphrase' }).check();
  for (const separator of ['-', ' ', '.', '_']) {
    await page.getByRole('combobox', { name: 'Word separator' }).selectOption(separator);
    const words = (await output(page).inputValue()).split(separator);
    expect(words).toHaveLength(6);
    expect(words.every((word) => /^[a-z]+$/.test(word))).toBe(true);
  }
  await page.getByRole('button', { name: 'Generate passphrase' }).click();
  await expect(feedback(page)).toContainText('New passphrase generated');
  for (const button of await page.getByRole('button').all()) {
    const bounds = await button.boundingBox();
    expect(bounds.height).toBeGreaterThanOrEqual(44);
    expect(bounds.width).toBeGreaterThanOrEqual(44);
  }
  await expectFits(page);
});

test('works without external requests, storage writes or browser errors', async ({ page }) => {
  const errors = [];
  const outsideRequests = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('request', (request) => {
    if (!request.url().startsWith('http://127.0.0.1:4173/')) outsideRequests.push(request.url());
  });
  await page.reload();
  await page.getByRole('button', { name: 'Generate password' }).click();
  await page.getByRole('radio', { name: 'Memorable passphrase' }).check();
  await page.getByRole('button', { name: 'Generate passphrase' }).click();
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length, cookies: document.cookie })))
    .toEqual({ local: 0, session: 0, cookies: '' });
  expect(outsideRequests).toEqual([]);
  expect(errors).toEqual([]);
});

test('has no automated WCAG A/AA violations in both modes and validation state', async ({ page }) => {
  for (const state of ['password', 'invalid', 'passphrase']) {
    if (state === 'invalid') {
      for (const name of [/Uppercase/, /Lowercase/, /Numbers/, /Symbols/]) {
        await page.getByRole('checkbox', { name }).uncheck();
      }
    }
    if (state === 'passphrase') await page.getByRole('radio', { name: 'Memorable passphrase' }).check();
    const scan = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(scan.violations).toEqual([]);
  }
});

test('supports keyboard navigation, native range keys, and manual selection', async ({ page, isMobile }) => {
  test.skip(isMobile, 'Desktop keyboard behavior is covered in all three desktop browser engines.');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to password generator' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Let’s make a good one.' })).toBeFocused();
  const slider = page.getByRole('slider', { name: 'Password length' });
  await slider.focus();
  await page.keyboard.press('End');
  await expect(output(page)).toHaveValue(/^[\s\S]{128}$/);
  await page.keyboard.press('Home');
  await expect(output(page)).toHaveValue(/^[\s\S]{8}$/);
  await output(page).focus();
  await page.keyboard.press('ControlOrMeta+A');
  expect(await output(page).evaluate((element) => element.selectionEnd - element.selectionStart)).toBe(8);
  await expectFits(page);
});

test('reflows at 200% text size', async ({ page }) => {
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  await expectFits(page);
  await page.getByRole('radio', { name: 'Memorable passphrase' }).check();
  await page.getByRole('button', { name: 'Generate passphrase' }).click();
  await expectFits(page);
});
