import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import i18n from '@/i18n';
import { CONNECTORS } from '@/data/connectors.js';
import Connectors from './index.jsx';
import fr from '@/locales/fr.js';
import de from '@/locales/de.js';
import italian from '@/locales/it.js';
import pt from '@/locales/pt.js';

vi.mock('@/utils/arrayUtils.js', () => ({ shuffle: values => [...values] }));

beforeAll(async () => {
  for (const [language, translations] of Object.entries({ fr, de, it: italian, pt })) i18n.addResourceBundle(language, 'translation', translations, true, true);
  await i18n.changeLanguage('en');
});
afterEach(cleanup);

describe('connectors', () => {
  it('keeps exercise data consistent with the examples', () => {
    for (const item of CONNECTORS) {
      expect(item.parts.join('')).toBe(item.zh);
      expect(item.blank.replace('____', item.answer)).toBe(item.zh);
      expect(new Set([item.answer, ...item.distractors]).size).toBe(4);
      for (const field of ['meaning', 'translation', 'explanation']) {
        expect(item[field]).toHaveLength(6);
        expect(item[field].every(value => typeof value === 'string' && value.trim())).toBe(true);
      }
    }
  });

  it('filters the guide and speaks an example', () => {
    const speak = vi.fn();
    render(<Connectors goBack={vi.fn()} speakChinese={speak} />);
    fireEvent.change(screen.getByLabelText('Function'), { target: { value:'cause' } });
    fireEvent.click(screen.getByRole('button', { name:/Connector guide/ }));
    expect(screen.getByText('因为……所以……')).toBeTruthy();
    expect(screen.queryByText('如果……就……')).toBeNull();
    fireEvent.click(screen.getAllByRole('button', { name:/Listen:/ })[0]);
    expect(speak).toHaveBeenCalled();
  });

  it('explains the difference between sufficient and necessary conditions', () => {
    const sufficient = CONNECTORS.find(item => item.id === 'provided');
    const necessary = CONNECTORS.find(item => item.id === 'onlyif');
    expect(sufficient.explanation[0]).toContain('suficiente');
    expect(necessary.explanation[0]).toContain('necesaria');
  });

  it.each(['fr', 'de', 'it', 'pt'])('renders connector content in %s', async language => {
    await i18n.changeLanguage(language);
    try {
      render(<Connectors goBack={vi.fn()} speakChinese={vi.fn()} />);
      fireEvent.click(screen.getByRole('button', { name: new RegExp(i18n.t('connectors_study'), 'i') }));
      const index = ['es', 'en', 'fr', 'de', 'it', 'pt'].indexOf(language);
      expect(screen.getByText(CONNECTORS[0].translation[index])).toBeTruthy();
      expect(screen.getAllByText(CONNECTORS[0].explanation[index]).length).toBeGreaterThan(0);
    } finally { await i18n.changeLanguage('en'); }
  });

  it('checks an answer and advances without counting twice', () => {
    render(<Connectors goBack={vi.fn()} speakChinese={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name:/Complete sentences/ }));
    expect(screen.getByText('1 / 10')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name:'最后' }));
    fireEvent.click(screen.getByRole('button', { name:'Check' }));
    expect(screen.getByRole('status').textContent).toContain('Correct!');
    fireEvent.click(screen.getByRole('button', { name:'Next' }));
    expect(screen.getByText('2 / 10')).toBeTruthy();
  });

  it('constructs and checks a sentence from fragments', () => {
    render(<Connectors goBack={vi.fn()} speakChinese={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name:/Order sentences/ }));
    for (const text of CONNECTORS[0].parts) fireEvent.click(screen.getByRole('button', { name:text }));
    fireEvent.click(screen.getByRole('button', { name:'Check' }));
    expect(screen.getByRole('status').textContent).toContain('Correct!');
  });

  it('accepts the right relationship', () => {
    render(<Connectors goBack={vi.fn()} speakChinese={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name:/Identify the relationship/ }));
    fireEvent.click(screen.getByRole('button', { name:'Sequence' }));
    fireEvent.click(screen.getByRole('button', { name:'Check' }));
    expect(screen.getByRole('status').textContent).toContain('Correct!');
  });

  it('finishes a filtered session using its actual question count', () => {
    render(<Connectors goBack={vi.fn()} speakChinese={vi.fn()} />);
    fireEvent.change(screen.getByLabelText('Function'), { target: { value:'conclusion' } });
    fireEvent.click(screen.getByRole('button', { name:/Complete sentences/ }));
    expect(screen.getByText('1 / 1')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name:'总之' }));
    fireEvent.click(screen.getByRole('button', { name:'Check' }));
    fireEvent.click(screen.getByRole('button', { name:'See results' }));
    expect(screen.getByText('1 / 1')).toBeTruthy();
    expect(screen.getByText('Practice complete!')).toBeTruthy();
  });
});
