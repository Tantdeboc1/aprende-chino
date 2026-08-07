// src/components/ErrorBoundary.test.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@/i18n';

const captureErrorMock = vi.hoisted(() => vi.fn());
const isChunkLoadErrorMock = vi.hoisted(() => vi.fn(() => false));
const reloadForFreshBuildMock = vi.hoisted(() => vi.fn(() => true));
vi.mock('@/utils/errorTracking.js', () => ({ captureError: captureErrorMock }));
vi.mock('@/utils/lazyWithRetry.js', () => ({
  isChunkLoadError: isChunkLoadErrorMock,
  reloadForFreshBuild: reloadForFreshBuildMock,
}));

import ErrorBoundary from './ErrorBoundary.jsx';

function Bomb() {
  throw new Error('boom');
}

beforeEach(() => {
  captureErrorMock.mockClear();
  isChunkLoadErrorMock.mockReturnValue(false);
  reloadForFreshBuildMock.mockClear();
  // React (y jsdom) vuelcan el error del render a consola; lo silenciamos
  // en estos tests concretos porque es el comportamiento esperado.
  vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

describe('ErrorBoundary', () => {
  it('sin error, renderiza los children normalmente', () => {
    render(<ErrorBoundary><p>contenido normal</p></ErrorBoundary>);
    expect(screen.getByText('contenido normal')).toBeTruthy();
  });

  it('un error en un hijo se captura, se reporta y muestra el mensaje del error', () => {
    render(<ErrorBoundary><Bomb /></ErrorBoundary>);
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText('boom')).toBeTruthy();
    expect(captureErrorMock).toHaveBeenCalledWith(expect.any(Error), expect.objectContaining({ boundary: 'ErrorBoundary' }));
  });

  it('"Retry" resetea el estado y vuelve a intentar renderizar los children', () => {
    let shouldThrow = true;
    function MaybeBomb() {
      if (shouldThrow) throw new Error('boom');
      return <p>ya va bien</p>;
    }
    render(<ErrorBoundary><MaybeBomb /></ErrorBoundary>);
    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: /retry/i }));
    expect(screen.getByText('ya va bien')).toBeTruthy();
  });

  it('un chunk error (build desactualizado) muestra el mensaje de recarga y "Reload" recarga', () => {
    isChunkLoadErrorMock.mockReturnValue(true);
    render(<ErrorBoundary><Bomb /></ErrorBoundary>);
    expect(screen.getByText('A new version is available')).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: /reload/i }));
    expect(reloadForFreshBuildMock).toHaveBeenCalledTimes(1);
  });
});
