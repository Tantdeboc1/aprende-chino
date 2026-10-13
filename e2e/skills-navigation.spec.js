// e2e/skills-navigation.spec.js
// Regresión del bug: tras entrar a un minijuego desde Practicar y volver, el
// propio botón "← Volver" del hub de Practicar se quedaba sin efecto (React
// descartaba el setState porque prevScreen === screen). Vivía en el estado de
// navegación de App.jsx (navigateTo/handleBottomNav/prevScreen), que no tenía
// ningún test — solo se detectó jugando a mano. Este spec reproduce el click
// a click exacto que lo desenmascaró.
import { test, expect } from '@playwright/test';

async function onboardAsGuest(page, name) {
  await page.goto('/');
  await page.getByRole('button', { name: /invitado/i }).click({ timeout: 15_000 });

  await page.getByPlaceholder(/cómo te llamas/i).fill(name);
  await page.getByRole('button', { name: /siguiente/i }).click();

  await page.getByRole('button', { name: /hombre/i }).click();
  await page.getByRole('button', { name: /siguiente/i }).click();

  await page.locator('button:has(img)').first().click();
  await page.getByRole('button', { name: /siguiente/i }).click();

  await page.getByRole('button', { name: /comenzar/i }).click();
  await page.getByRole('button', { name: 'Saltar y explorar', exact: true }).click();
  await page.getByRole('button', { name: /saltar tutorial/i }).click();

  await expect(page.getByText('¿Qué aprendemos hoy?')).toBeVisible();
}

test('Practicar: volver de un minijuego y pulsar "Volver" del hub lleva a Inicio', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await onboardAsGuest(page, 'Tester Nav');

  // Dos minijuegos distintos en la misma sesión: si el fallo fuera "solo pasa
  // la primera vez", una sola vuelta no lo detectaría.
  for (const [gameName, category] of [['Carrera Contrarreloj', 'Vocabulario y bases'], ['Tonos al oído', 'Escuchar']]) {
    await page.getByRole('button', { name: 'Practicar' }).click();
    await expect(page.getByRole('heading', { name: 'Practicar', exact: true, level: 1 })).toBeVisible();

    await page.getByRole('button', { name: category, exact: true }).click();
    const card = page.locator('button, [role="button"]').filter({ hasText: gameName }).first();
    await card.click();

    // GameIntro: explicación + "Comenzar juego".
    await page.getByRole('button', { name: 'Comenzar juego' }).click();
    await expect(page.getByRole('button', { name: /volver a practicar/i })).toBeVisible();

    // Salir del minijuego de vuelta al hub...
    await page.getByRole('button', { name: /volver a practicar/i }).click();
    await expect(page.getByRole('heading', { name: 'Practicar', exact: true, level: 1 })).toBeVisible();

    // ...y pulsar el "Volver" del propio hub: antes del fix, esto no hacía
    // nada (prevScreen === 'minigames' === screen actual).
    await page.getByRole('button', { name: /^←\s*todas las categorías$/i }).click();
    await page.getByRole('button', { name: /^←\s*inicio$/i }).click();
    await expect(page.getByText('¿Qué aprendemos hoy?')).toBeVisible();
  }

  expect(errors, `errores de página: ${errors.join(' | ')}`).toEqual([]);
});

test('Diccionario y Repaso: el botón atrás vuelve a Inicio', async ({ page }) => {
  await onboardAsGuest(page, 'Tester Nav 2');

  await page.getByRole('button', { name: 'Diccionario' }).click();
  await expect(page.getByPlaceholder(/buscar/i).or(page.getByText(/diccionario/i).first())).toBeVisible();
  await page.getByRole('button', { name: /^←\s*volver$/i }).click();
  await expect(page.getByText('¿Qué aprendemos hoy?')).toBeVisible();

  await page.getByRole('button', { name: 'Repaso' }).click();
  // "Repaso" (srs_mode_title) — cuenta fresca sin SRS: ModeSelector cae en su
  // estado vacío, pero el h1 con este título se renderiza en ambos casos.
  await expect(page.getByRole('heading', { name: 'Repaso', level: 1 })).toBeVisible();
  await page.getByRole('button', { name: /^←\s*volver$/i }).click();
  await expect(page.getByText('¿Qué aprendemos hoy?')).toBeVisible();
});
