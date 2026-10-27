import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('aprende-chino-auth-mode', 'guest');
    localStorage.setItem('aprende-chino-username', 'Prueba');
    localStorage.setItem('i18nextLng', 'es');
  });
  await page.goto('/#/word-search', { waitUntil: 'domcontentloaded' });
  await expect(page.getByTestId('wordsearch-board')).toBeVisible({ timeout: 30000 });
});

async function findWord(page, size, text) {
  const cells = await page.getByTestId('wordsearch-board').locator('button').allTextContents();
  const chars = Array.from(text);
  for (let i = 0; i < cells.length; i++) {
    for (const step of [1, size]) {
      const end = i + step * (chars.length - 1);
      if (end >= cells.length || (step === 1 && Math.floor(i / size) !== Math.floor(end / size))) continue;
      if (chars.every((char, j) => cells[i + j * step] === char)) return [i, end];
    }
  }
  throw new Error(`Word not found: ${text}`);
}

async function tapWord(page, size, word) {
  const [from, to] = await findWord(page, size, word);
  await page.locator(`[data-wordsearch-cell="${from}"]`).tap();
  await page.locator(`[data-wordsearch-cell="${to}"]`).tap();
}

test('mobile word selection and new rounds use app vocabulary', async ({ page }) => {
  const board = page.getByTestId('wordsearch-board');
  const words = await page.getByTestId('wordsearch-word').allTextContents();
  await page.locator('[data-wordsearch-cell="0"]').tap();
  await page.locator('[data-wordsearch-cell="6"]').tap();
  await expect(page.getByRole('status')).toContainText('horizontal o vertical');
  await tapWord(page, 5, words[0]);
  await expect(page.getByText('1 de 2 encontradas')).toBeVisible();
  await tapWord(page, 5, words[1]);
  await expect(page.getByRole('status')).toHaveText('¡Ronda completada!');
  await expect(page.getByRole('button', { name: 'Repetir ronda' })).toHaveCount(0);
  const first = await board.innerText();
  await page.getByRole('button', { name: 'Nueva sopa' }).click();
  await expect(page.getByText('Ronda 2')).toBeVisible();
  await expect(page.getByText('0 de 2 encontradas')).toBeVisible();
  expect(await board.innerText()).not.toBe(first);
  expect(await page.getByTestId('wordsearch-word').allTextContents()).not.toEqual(words);
  await expect(page.getByLabel('Cuadrícula y palabras')).toHaveValue('0');
});

test('drag and keyboard work across grid sizes and mobile widths', async ({ page }) => {
  const board = page.getByTestId('wordsearch-board');
  for (const width of [320, 360, 390, 414]) {
    await page.setViewportSize({ width, height: 844 });
    for (const [variant, size] of [['0', 5], ['1', 6], ['2', 7]]) {
      await page.getByLabel('Cuadrícula y palabras').selectOption(variant);
      await expect(board.locator('button')).toHaveCount(size * size);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const word = await page.getByTestId('wordsearch-word').first().innerText();
      const [start, end] = await findWord(page, size, word);
      const from = await page.locator(`[data-wordsearch-cell="${start}"]`).boundingBox();
      const to = await page.locator(`[data-wordsearch-cell="${end}"]`).boundingBox();
      await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
      await page.mouse.down();
      await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, { steps: 5 });
      await page.mouse.up();
      await expect(page.getByText(new RegExp('^1 de .* encontradas$'))).toBeVisible();
    }
  }
  await page.getByLabel('Cuadrícula y palabras').selectOption('0');
  const word = await page.getByTestId('wordsearch-word').first().innerText();
  const [start, end] = await findWord(page, 5, word);
  await page.locator(`[data-wordsearch-cell="${start}"]`).focus(); await page.keyboard.press('Enter');
  await page.locator(`[data-wordsearch-cell="${end}"]`).focus(); await page.keyboard.press('Enter');
  await expect(page.getByText('1 de 2 encontradas')).toBeVisible();
  await page.getByRole('button', { name: 'Volver a Practicar' }).click();
  await expect(page.getByRole('heading', { name: 'Practicar', exact: true })).toBeVisible();
});
