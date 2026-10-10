import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import ClassifiersScreen from './ClassifiersScreen.jsx';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ i18n: { language: 'es' } }) }));
vi.mock('@/components/ui/SpeakButton.jsx', () => ({ default: () => <button>Audio</button> }));

beforeEach(() => {
  history.replaceState({ appParent: '#/home' }, '', '#/classifiers');
  Object.defineProperty(window, 'scrollY', { value: 0, configurable: true, writable: true });
  Object.defineProperty(document.documentElement, 'scrollHeight', { value: 10000, configurable: true });
  vi.spyOn(window, 'scrollTo').mockImplementation(({ top }) => { window.scrollY = top; });
});
afterEach(() => cleanup());

function selectBook() {
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'ben' } });
  fireEvent.click(screen.getByRole('button', { name: 'Practicar', exact: true }));
  fireEvent.click(screen.getByRole('button', { name: 'Solo resultados' }));
}

describe('classifier navigation', () => {
  it('shows study first and filters by pinyin without requiring tone marks', () => {
    render(<ClassifiersScreen goBack={vi.fn()} />);
    expect(screen.getAllByRole('article')).toHaveLength(22);
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'ben' } });
    expect(screen.getAllByRole('article')).toHaveLength(1);
    expect(screen.getByText('一本书')).toBeTruthy();
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'noexistente' } });
    expect(screen.queryAllByRole('article')).toHaveLength(0);
    expect(screen.getByRole('status').textContent).toContain('No hay resultados');
    fireEvent.click(screen.getByRole('button', { name: 'Borrar búsqueda' }));
    expect(screen.getAllByRole('article')).toHaveLength(22);
  });

  it('returns to the searched selection and its scroll position, then resumes the same question', async () => {
    render(<ClassifiersScreen goBack={vi.fn()} />);
    selectBook();
    window.scrollY = 420;
    fireEvent.scroll(window);
    fireEvent.click(screen.getByRole('button', { name: 'Practicar 1 formas' }));
    expect(window.scrollY).toBe(0);
    expect(screen.getByText('Pregunta 1 de 2')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /^本\s*běn$/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    expect(screen.getByText('Pregunta 2 de 2')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Volver a la selección' }));
    await waitFor(() => expect(screen.getByRole('searchbox').value).toBe('ben'));
    expect(window.scrollY).toBe(420);
    expect(screen.getByRole('button', { name: 'Practicar 1 formas' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Continuar práctica · pregunta 2 de 2' }));
    expect(screen.getByText('Pregunta 2 de 2')).toBeTruthy();
    act(() => history.back());
    await waitFor(() => expect(screen.getByRole('searchbox').value).toBe('ben'));
  });

  it('restores the activity after leaving the screen and returning through browser history', () => {
    let saved;
    const view = render(<ClassifiersScreen goBack={vi.fn()} onStateChange={value => { saved = value; }} />);
    selectBook();
    fireEvent.click(screen.getByRole('button', { name: 'Practicar 1 formas' }));
    fireEvent.click(screen.getByRole('button', { name: /^本\s*běn$/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Siguiente' }));
    view.unmount();
    render(<ClassifiersScreen goBack={vi.fn()} initialState={saved} />);
    expect(screen.getByText('Pregunta 2 de 2')).toBeTruthy();
  });
});
