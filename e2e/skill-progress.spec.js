import { test, expect } from '@playwright/test';

test('Progreso por destrezas: persiste un intento y abre prácticas desde el perfil', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await page.getByRole('button', { name: /invitado/i }).click({ timeout: 15_000 });

  await page.getByPlaceholder(/cómo te llamas/i).fill('Tester Minijuego');
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.getByRole('button', { name: /hombre/i }).click();
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.locator('button:has(img)').first().click();
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.getByRole('button', { name: /comenzar/i }).click();
  await page.getByRole('button', { name: 'Saltar y explorar', exact: true }).click();
  await page.getByRole('button', { name: /saltar tutorial/i }).click();

  // ── Destrezas → Completa la Frase → intro ────────────────────────────────
  await page.getByRole('button', { name: 'Practicar' }).click();
  await expect(page.getByText('Practica por destrezas')).toBeVisible();
  await page.locator('button, [role="button"]').filter({ hasText: 'Completa la Frase' }).first().click();
  await page.getByRole('button', { name: 'Comenzar juego' }).click();

  // ── Jugar todas las rondas ────────────────────────────────────────────────
  const counter = page.getByText(/^\d+\/\d+$/);
  await expect(counter).toBeVisible();
  const totalRounds = Number((await counter.textContent()).split('/')[1]);
  expect(totalRounds).toBeGreaterThan(0);

  for (let round = 1; round <= totalRounds; round++) {
    await expect(page.getByText(`${round}/${totalRounds}`)).toBeVisible();
    const options = page.locator('div.grid.grid-cols-2 button');
    await expect(options).toHaveCount(4);
    await options.first().click();
    await expect(page.getByRole('status')).toContainText(/correct/i);
    await page.getByRole('button', { name: /siguiente|ver resultados/i }).click();
  }

  // ── Resultados ────────────────────────────────────────────────────────────
  await expect(page.getByText('¡Ronda completada!')).toBeVisible();

  await page.goto('/#/profile');
  const panel = page.getByRole('region', { name: 'Progreso por destrezas' });
  await expect(panel).toBeVisible();
  await expect(panel.getByText(/^1 intento ·/)).toBeVisible();
  await expect(page.getByRole('main')).toHaveCSS('opacity', '1');
  await expect(panel).toHaveCSS('opacity', '1');
  await panel.screenshot({ path: 'output/skill-progress.png', animations: 'disabled' });
  await panel.getByText('Ver detalles', { exact: true }).click();
  await expect(panel.getByText('Intentos recientes', { exact: true })).toBeVisible();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('aprende-chino-skill-progress-v1')).length)).toBe(1);

  await panel.getByRole('button', { name: 'Practicar: Comprensión oral' }).click();
  await expect(page.getByRole('button', { name: 'Comenzar juego' })).toBeVisible();
  await page.getByRole('button', { name: /volver/i }).first().click();
  await expect(page.getByText('Practica por destrezas')).toBeVisible();
  await page.getByRole('button', { name: /volver/i }).first().click();
  await expect(page.getByRole('region', { name: 'Progreso por destrezas' })).toBeVisible();
  await page.getByRole('button', { name: 'Practicar: Escritura a mano' }).click();
  await expect(page.getByRole('button', { name: 'Ver Orden de Trazos' })).toBeVisible();
  await page.getByRole('button', { name: /volver/i }).first().click();
  await expect(page.getByRole('region', { name: 'Progreso por destrezas' })).toBeVisible();

  expect(errors, `errores de página: ${errors.join(' | ')}`).toEqual([]);
});
