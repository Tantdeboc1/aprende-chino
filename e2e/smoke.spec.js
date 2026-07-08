// e2e/smoke.spec.js
// Smoke test del arranque y el flujo de entrada:
//   carga → splash → login → invitado → onboarding (paso del nombre).
// Objetivo: cazar "pantalla en blanco" y roturas del flujo de entrada, que los
// tests unitarios no cubren. No valida contenido de lecciones, solo que la app
// arranca y navega.
import { test, expect } from '@playwright/test';

test('arranca y muestra la marca HanyuPath', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');

  // La marca aparece en el splash y en el login (el splash dura unos segundos).
  await expect(page.getByText('HanyuPath').first()).toBeVisible({ timeout: 15_000 });

  // No debe haber excepciones no capturadas durante el arranque.
  expect(errors, `errores de página: ${errors.join(' | ')}`).toEqual([]);
});

test('entrar como invitado lleva al onboarding', async ({ page }) => {
  await page.goto('/');

  // Tras el splash aparece el login. Esperamos el botón de invitado y pulsamos.
  const guest = page.getByRole('button', { name: /invitado/i });
  await guest.click({ timeout: 15_000 });

  // El onboarding empieza pidiendo el nombre.
  await expect(page.getByPlaceholder(/cómo te llamas/i)).toBeVisible();
});
