// e2e/minigame-results.spec.js
// Golden path de un minijuego completo, de principio a fin:
//   invitado → Destrezas → "Completa la Frase" → GameIntro → jugar todas las
//   rondas (una opción cualquiera por ronda, da igual acertar o fallar: tras
//   cualquier respuesta aparece "Siguiente"/"Ver resultados") → pantalla de
//   resultados → "Jugar de nuevo" reinicia la partida en la ronda 1.
// CompleteSentence se eligió porque termina tras un nº fijo de rondas, a
// diferencia de los contrarreloj (60s) — así el spec no depende del reloj.
// El nº de rondas depende de cuántas frases tenga la lección preseleccionada
// (se lee del contador "N/total" en pantalla en vez de asumir un valor fijo).
import { test, expect } from '@playwright/test';

test('Completa la Frase: jugar hasta el resultado y "Jugar de nuevo" reinicia', async ({ page }) => {
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
    await page.getByRole('button', { name: /siguiente|ver resultados/i }).click();
  }

  // ── Resultados ────────────────────────────────────────────────────────────
  await expect(page.getByText('¡Ronda completada!')).toBeVisible();

  await page.getByRole('button', { name: 'Jugar de nuevo' }).click();
  await expect(page.getByText(`1/${totalRounds}`)).toBeVisible();

  expect(errors, `errores de página: ${errors.join(' | ')}`).toEqual([]);
});
