// e2e/review-session.spec.js
// Golden path del Repaso (SRS) de principio a fin:
//   invitado → Lección 1 → Ejercicios → "Estudiar" (marca el primer grupo de
//   hasta 6 palabras como vistas nada más entrar, ver el useEffect de
//   Progressive.jsx → onTrackSeen → markWordSeen → initSRSCard, que deja
//   nextReview = ahora mismo) → Repaso → modo "Repaso del día" → voltear y
//   puntuar las tarjetas → pantalla de resultados → Terminar (vuelve a la
//   Lección 1, la pantalla anterior a entrar en Repaso).
// Nota: la ruta de "Quiz rápido" NO sirve para generar tarjetas due-ahora —
// un acierto llama a markWordResult (due ahora) pero un fallo llama además a
// updateSRS(quality 0), que reprograma la tarjeta 10 minutos en el futuro
// (paso de aprendizaje de SM-2), así que depende de acertar por azar.
// "Estudiar" es determinista: siempre marca "vistas" sin pasar por updateSRS.
//
// Antes de este spec, "Repaso" con una cuenta nueva solo llegaba al estado
// vacío (ModeSelector con dueCount=0): ningún test recorría la sesión de
// repaso real con tarjetas de por medio.
import { test, expect } from '@playwright/test';

test('Repaso: completar una sesión de "Repaso del día" tras generar tarjetas SRS con "Estudiar"', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));

  await page.goto('/');
  await page.getByRole('button', { name: /invitado/i }).click({ timeout: 15_000 });

  await page.getByPlaceholder(/cómo te llamas/i).fill('Tester Repaso');
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.getByRole('button', { name: /hombre/i }).click();
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.locator('button:has(img)').first().click();
  await page.getByRole('button', { name: /siguiente/i }).click();
  await page.getByRole('button', { name: /comenzar/i }).click();
  await page.getByRole('button', { name: /saltar tutorial/i }).click();
  await expect(page.getByText('¿Qué aprendemos hoy?')).toBeVisible();

  // ── Generar tarjetas SRS: Lección 1 → Ejercicios → Estudiar ──────────────
  await page.getByRole('button', { name: /lección 1/i }).first().click();
  await page.getByRole('button', { name: /^ejercicios$/i }).click();
  await page.getByRole('button', { name: 'Estudiar' }).click();
  await expect(page.getByText('Página 1 de', { exact: false })).toBeVisible();

  // Volver a la lección y de ahí a Repaso (la barra inferior sigue visible aquí).
  await page.getByRole('button', { name: /volver/i }).click();
  await page.getByRole('button', { name: 'Repaso' }).click();
  await expect(page.getByRole('heading', { name: 'Repaso', level: 1 })).toBeVisible();

  const dueOption = page.getByRole('button', { name: /repaso del día/i });
  await expect(dueOption).toContainText(/listas para repasar hoy/i);
  await dueOption.click();

  // Voltear y puntuar "Bien" hasta agotar la tanda (hasta 6 tarjetas, según
  // cuántas palabras tenga la Lección 1 en su primer grupo de 6).
  for (let i = 0; i < 6; i++) {
    const flipCard = page.getByRole('button', { name: /toca la tarjeta/i });
    if (!(await flipCard.isVisible().catch(() => false))) break;
    await flipCard.click();
    await page.getByRole('button', { name: /^bien /i }).click();
  }

  await expect(page.getByText('Sesión completada')).toBeVisible();
  await page.getByRole('button', { name: /^terminar$/i }).click();
  // "Terminar" hace goBack(): vuelve a la pantalla anterior a entrar en
  // Repaso (el detalle de la Lección 1), no forzosamente a Inicio.
  await expect(page.getByRole('button', { name: /^ejercicios$/i })).toBeVisible();

  expect(errors, `errores de página: ${errors.join(' | ')}`).toEqual([]);
});
