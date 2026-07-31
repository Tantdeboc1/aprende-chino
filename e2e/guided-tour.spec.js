// e2e/guided-tour.spec.js
// El tutorial guiado del primer arranque (GuidedTour.jsx): se arma solo al
// terminar el registro, ilumina un elemento real por paso y solo avanza si
// se toca justo ESE elemento — el resto de la pantalla queda bloqueado por
// la máscara. Este test recorre los 8 pasos y comprueba que el bloqueo es
// real, no solo visual. Complementa a critical-flow.spec.js, que lo salta.
import { test, expect } from '@playwright/test';

test('el tutorial guiado bloquea fuera del objetivo y termina en Fundamentos', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');

  // ── Registro (igual que critical-flow) ───────────────────────────────────
  await page.getByRole('button', { name: /invitado/i }).click({ timeout: 15_000 });
  await page.getByPlaceholder(/cómo te llamas/i).fill('Tour E2E');
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.getByRole('button', { name: /hombre/i }).click();
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.locator('button:has(img)').first().click();
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.getByRole('button', { name: /comenzar/i }).click();

  // ── Paso 1: bienvenida, sin elemento resaltado ───────────────────────────
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('Te enseño la app en un minuto');
  await expect(dialog).toContainText('Paso 1 de 8');

  // ── El bloqueo es real: tocar un destino que NO es el resaltado no hace
  // nada. force:true porque la máscara lo cubre — sin eso Playwright ya
  // fallaría solo esperando a que sea "clicable", que es justo lo que se
  // quiere demostrar.
  await page.locator('[data-tour="nav-home"]').click({ force: true });
  await expect(dialog).toContainText('Paso 1 de 8');
  await expect(page).toHaveURL(/#\/home$/);

  // ── Paso 1 → 2: el único botón de este paso es "Empezar" ────────────────
  await dialog.getByRole('button', { name: /empezar/i }).click();
  await expect(dialog).toContainText('Paso 2 de 8');
  await expect(dialog).toContainText('Repaso');

  // ── Pasos 2-6: cada uno ilumina una pestaña de la barra inferior ────────
  const navSteps = [
    ['nav-review', /#\/review$/, 'Practicar'],
    ['nav-practice', /#\/minigames$/, 'Diccionario'],
    ['nav-dictionary', /#\/dictionary$/, 'Perfil'],
    ['nav-profile', /#\/profile$/, 'Inicio'],
    ['nav-home', /#\/home$/, 'Las secciones se pliegan'],
  ];
  for (const [target, expectedUrl, nextTitle] of navSteps) {
    await page.locator(`[data-tour="${target}"]`).click();
    await expect(page).toHaveURL(expectedUrl);
    await expect(dialog).toContainText(nextTitle);
  }
  await expect(dialog).toContainText('Paso 7 de 8');

  // ── Paso 7: despliega la sección Fundamentos del Home ────────────────────
  const basicsHeader = page.locator('[data-tour="section-basics"]');
  await expect(basicsHeader).toHaveAttribute('aria-expanded', 'false');
  await basicsHeader.click();
  await expect(basicsHeader).toHaveAttribute('aria-expanded', 'true');
  await expect(dialog).toContainText('Paso 8 de 8');
  await expect(dialog).toContainText('Empieza por aquí');

  // ── Paso 8: la tarjeta de Introducción cierra el tutorial ────────────────
  await page.locator('[data-tour="lesson-intro"] button').click();
  await expect(page).toHaveURL(/#\/intro-detail$/);
  await expect(dialog).toBeHidden();

  // El estado queda en 'done': no debe volver a aparecer al navegar.
  const tourState = await page.evaluate(() => localStorage.getItem('aprende-chino-tour-v1'));
  expect(tourState).toContain('"done"');

  expect(errors, `errores de página: ${errors.join(' | ')}`).toEqual([]);
});
