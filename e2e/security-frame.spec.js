import { test, expect } from '@playwright/test';

test('an embedded app exposes no account controls or learning UI', async ({ page, baseURL }) => {
  await page.route('**/__security_frame_test__', route => route.fulfill({
    status: 200,
    contentType: 'text/html',
    body: `<iframe title="security-frame" src="${baseURL}/#/lesson/1"></iframe>`,
  }));
  await page.goto('/__security_frame_test__');
  const frame = page.frameLocator('iframe[title="security-frame"]');
  await expect(frame.getByRole('link', { name: /Open HanyuPath/ })).toBeVisible();
  await expect(frame.getByRole('button')).toHaveCount(0);
});
