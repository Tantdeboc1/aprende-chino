// e2e/settings-persistence.spec.js
// Golden path de Ajustes: cambiar una preferencia y comprobar que sobrevive
// a recargar la página (no solo que el estado de React cambia en caliente).
// "Alto contraste" se eligió porque su efecto es verificable sin ambigüedad
// fuera de React: añade la clase `high-contrast` a <html> (ver
// applyHighContrast() en highContrast.js), que initHighContrast() reaplica
// desde localStorage en el arranque, antes del primer render.
import { test, expect } from '@playwright/test';

test('Ajustes: activar "Alto contraste" persiste tras recargar la página', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await page.getByRole('button', { name: /invitado/i }).click({ timeout: 15_000 });

  await page.getByPlaceholder(/cómo te llamas/i).fill('Tester Ajustes');
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.getByRole('button', { name: /hombre/i }).click();
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.locator('button:has(img)').first().click();
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.getByRole('button', { name: /comenzar/i }).click();
  await page.getByRole('button', { name: /saltar tutorial/i }).click();

  // ── Perfil → Ajustes ──────────────────────────────────────────────────────
  await page.getByRole('button', { name: 'Perfil', exact: true }).click();
  await page.getByRole('button', { name: 'Ajustes' }).click();

  const contrastRow = page.getByText('Alto contraste').locator('../..');
  const contrastToggle = contrastRow.getByRole('button');
  await expect(contrastToggle).toHaveAttribute('aria-pressed', 'false');
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains('high-contrast')))
    .toBe(false);

  await contrastToggle.click();
  await expect(contrastToggle).toHaveAttribute('aria-pressed', 'true');
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains('high-contrast')))
    .toBe(true);

  // ── Recargar: la preferencia debe sobrevivir (localStorage, no solo estado) ─
  await page.reload();
  await expect
    .poll(() => page.evaluate(() => document.documentElement.classList.contains('high-contrast')))
    .toBe(true);

  // Y el propio interruptor en Ajustes debe reflejarlo al volver a entrar.
  await page.getByRole('button', { name: 'Perfil', exact: true }).click();
  await page.getByRole('button', { name: 'Ajustes' }).click();
  await expect(page.getByText('Alto contraste').locator('../..').getByRole('button'))
    .toHaveAttribute('aria-pressed', 'true');

  expect(errors, `errores de página: ${errors.join(' | ')}`).toEqual([]);
});
