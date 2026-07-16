// e2e/critical-flow.spec.js
// El flujo crítico completo de un usuario nuevo:
//   invitado → onboarding (nombre, género, avatar, meta) → home →
//   Lección 1 → tab Practicar → Quiz rápido → responder una pregunta.
// Si esto pasa, la app es usable de punta a punta; complementa a smoke.spec.js
// (que solo cubre el arranque). Textos en es-ES (locale fijado en la config).
import { test, expect } from '@playwright/test';

test('usuario nuevo completa onboarding y responde una pregunta del quiz', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');

  // ── Entrar como invitado (tras el splash) ────────────────────────────────
  await page.getByRole('button', { name: /invitado/i }).click({ timeout: 15_000 });

  // ── Onboarding: paso 1, nombre ───────────────────────────────────────────
  await page.getByPlaceholder(/cómo te llamas/i).fill('Tester E2E');
  await page.getByRole('button', { name: /siguiente/i }).click();

  // Paso 2: género
  await page.getByRole('button', { name: /hombre/i }).click();
  await page.getByRole('button', { name: /siguiente/i }).click();

  // Paso 3: avatar (el primero de la galería; son los únicos botones con imagen)
  await page.locator('button:has(img)').first().click();
  await page.getByRole('button', { name: /siguiente/i }).click();

  // Paso 4: meta diaria (viene preseleccionada) → Comenzar
  await page.getByRole('button', { name: /comenzar/i }).click();

  // ── Home: saludo con el nombre y tarjeta de la Lección 1 ─────────────────
  await expect(page.getByText('Tester E2E').first()).toBeVisible();
  const lesson1 = page.getByRole('button', { name: /lección 1/i }).first();
  await expect(lesson1).toBeVisible();
  await lesson1.click();

  // ── Detalle de lección: vocabulario cargado y tab Practicar ──────────────
  // (el tab es "Vocabulario (N)"; el "★ Vocabulario extra" es otra sección)
  await expect(page.getByRole('button', { name: /^vocabulario \(/i })).toBeVisible();
  await page.getByRole('button', { name: /^practicar$/i }).click();

  // ── Quiz rápido ──────────────────────────────────────────────────────────
  await page.getByRole('button', { name: /quiz rápido/i }).click();
  await page.getByRole('button', { name: /comenzar quiz/i }).click();

  // Pregunta 1 de 10 en pantalla, con sus 4 opciones.
  await expect(page.getByText('1/10')).toBeVisible();
  const options = page.locator('div.grid.grid-cols-2 button');
  await expect(options).toHaveCount(4);

  // Responder: tras contestar, las opciones quedan deshabilitadas (feedback).
  await options.first().click();
  await expect(options.first()).toBeDisabled();

  // Sin excepciones no capturadas en todo el recorrido.
  expect(errors, `errores de página: ${errors.join(' | ')}`).toEqual([]);
});
