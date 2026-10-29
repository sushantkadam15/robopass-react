import { expect } from '@playwright/test';

export async function expectFits(page) {
  await expect.poll(() => page.evaluate(() => {
    const width = document.documentElement.clientWidth;
    const outside = [...document.querySelectorAll('button, select, textarea, input[type="range"], .checkbox-setting, .mode-picker, .generator, .site-footer')]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width && (rect.left < -1 || rect.right > width + 1);
      }).map((element) => element.outerHTML.slice(0, 150));
    const output = document.querySelector('#generated-password');
    return { outside, documentOverflow: document.documentElement.scrollWidth > width + 1,
      clippedOutput: output.scrollHeight > output.clientHeight + 1 || output.scrollWidth > output.clientWidth + 1 };
  })).toEqual({ outside: [], documentOverflow: false, clippedOutput: false });
  await expect(page.locator('#generated-password')).toBeVisible();
}
