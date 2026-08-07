// src/context/MusicContext.test.jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MusicProvider, useMusic } from './MusicContext.jsx';

// jsdom no implementa reproducción real de audio.
beforeEach(() => {
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
  localStorage.clear();
});
afterEach(() => cleanup());

function Consumer() {
  const { enabled, volume, toggle, setVolume } = useMusic();
  return (
    <div>
      <span>enabled:{String(enabled)}</span>
      <span>volume:{volume}</span>
      <button onClick={() => toggle()}>toggle</button>
      <button onClick={() => setVolume(1.5)}>set-over</button>
    </div>
  );
}

describe('MusicContext', () => {
  it('arranca desactivada por defecto (sin ajustes previos)', () => {
    render(<MusicProvider><Consumer /></MusicProvider>);
    expect(screen.getByText('enabled:false')).toBeTruthy();
  });

  it('toggle() activa la música y persiste la preferencia', () => {
    render(<MusicProvider><Consumer /></MusicProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'toggle' }));
    expect(screen.getByText('enabled:true')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('music-settings')).enabled).toBe(true);
  });

  it('setVolume() satura al rango [0,1] y persiste', () => {
    render(<MusicProvider><Consumer /></MusicProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'set-over' }));
    expect(screen.getByText('volume:1')).toBeTruthy();
    expect(JSON.parse(localStorage.getItem('music-settings')).volume).toBe(1);
  });
});
