import { test, expect } from '@playwright/test';
async function register(page) {
  await page.goto('/');
  await page.getByRole('button', { name: /invitado/i }).click({ timeout: 15_000 });

  await page.getByPlaceholder(/cómo te llamas/i).fill('Tester Minijuego');
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.getByRole('button', { name: /hombre/i }).click();
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.locator('button:has(img)').first().click();
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.getByRole('button', { name: /comenzar/i }).click();
}

test('empezar desde cero abre directamente la primera lección', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await register(page);
  await page.getByRole('button', { name: /empiezo desde cero/i }).click();
  await expect(page.getByText('Lección 1', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Empezar esta lección' }).click();
  await expect(page.getByRole('button', { name: /^vocabulario \(/i })).toBeVisible();
  await expect(page).toHaveURL(/#\/lesson\/1$/);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('aprende-chino-profile')).startingRecommendation.source)).toBe('beginner');
  expect(errors).toEqual([]);
});

test('comprobación opcional guarda una recomendación sin alterar el aprendizaje', async ({ page }) => {
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await register(page);
  await page.getByRole('button', { name: /ya sé algo de chino/i }).click();
  for (let i = 1; i <= 6; i++) {
    await expect(page.getByText('Pregunta ' + i + '/6', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'No lo sé', exact: true }).click();
    await page.getByRole('button', { name: 'Siguiente', exact: true }).click();
  }
  await expect(page.getByText('Vocabulario: 0/3')).toBeVisible();
  await page.getByRole('button', { name: 'Explorar la app', exact: true }).click();
  await page.getByRole('button', { name: /saltar tutorial/i }).click();
  await expect(page.getByRole('button', { name: /tu punto de partida/i })).toBeVisible();
  const saved = await page.evaluate(() => ({ profile: JSON.parse(localStorage.getItem('aprende-chino-profile')), history: localStorage.getItem('aprende-chino-skill-progress-v1'), progress: JSON.parse(localStorage.getItem('aprende-chino-progress-v1') || '{}') }));
  expect(saved.profile.startingRecommendation.lesson).toBe(1);
  expect(saved.history).toBeNull();
  expect(saved.progress.__srs).toBeUndefined();
  await page.reload();
  await page.getByRole('button', { name: /tu punto de partida/i }).click();
  await expect(page).toHaveURL(/#\/lesson\/1$/);
  expect(errors).toEqual([]);
});
