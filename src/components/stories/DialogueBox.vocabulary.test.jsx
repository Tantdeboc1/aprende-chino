import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@/i18n';
import DialogueBox from './DialogueBox.jsx';

beforeEach(() => { window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} }); });
afterEach(cleanup);

it('explains and pronounces words supplied by the app dictionary', async () => {
  const speak = vi.fn();
  const advance = vi.fn();
  render(<DialogueBox speakerName="晓敏" chino="图书馆在北边。" pinyin="Túshūguǎn zài běibiān." traduccion="La biblioteca está al norte." wordHelp vocabulary={[{ char: '图书馆', pinyin: 'túshūguǎn', meaning: 'biblioteca' }]} speak={speak} onAdvance={advance} />);
  const word = await screen.findByRole('button', { name: '图书馆' });
  fireEvent.click(word);
  expect(screen.getByRole('status').textContent).toContain('biblioteca');
  fireEvent.click(screen.getByRole('button', { name: /escuchar palabra|listen to word/i }));
  await waitFor(() => expect(speak).toHaveBeenCalledWith({ hanzi: '图书馆', pinyin: 'túshūguǎn' }, { category: 'pronunciation' }));
  expect(advance).not.toHaveBeenCalled();
});
