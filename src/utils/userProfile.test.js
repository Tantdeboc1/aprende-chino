// src/utils/userProfile.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import { loadUserProfile, updateUserProfile, resolveAvatarSrc } from './userProfile.js';
import { DEFAULT_AVATAR_ID } from '@/data/avatars.js';

beforeEach(() => localStorage.clear());

describe('userProfile', () => {
  it('sin nada guardado, devuelve el perfil por defecto', () => {
    expect(loadUserProfile()).toEqual({ gender: null, avatarId: DEFAULT_AVATAR_ID, useGooglePhoto: true });
  });

  it('updateUserProfile fusiona el patch con lo existente y persiste', () => {
    updateUserProfile({ gender: 'f' });
    const next = updateUserProfile({ avatarId: 'ninja' });
    expect(next).toEqual({ gender: 'f', avatarId: 'ninja', useGooglePhoto: true });
    expect(loadUserProfile()).toEqual(next);
  });

  it('JSON corrupto en localStorage no revienta: cae al perfil por defecto', () => {
    localStorage.setItem('aprende-chino-profile', '{roto');
    expect(loadUserProfile()).toEqual({ gender: null, avatarId: DEFAULT_AVATAR_ID, useGooglePhoto: true });
  });

  describe('resolveAvatarSrc', () => {
    it('usa la foto de Google si el modo es google, no se ha desactivado y hay URL', () => {
      const result = resolveAvatarSrc({ useGooglePhoto: true }, 'google', 'https://foto.google/x', 'avatar.png');
      expect(result).toEqual({ src: 'https://foto.google/x', isGoogle: true });
    });

    it('si se desactivó useGooglePhoto, usa el avatar elegido aunque haya foto de Google', () => {
      const result = resolveAvatarSrc({ useGooglePhoto: false }, 'google', 'https://foto.google/x', 'avatar.png');
      expect(result).toEqual({ src: 'avatar.png', isGoogle: false });
    });

    it('en modo invitado, usa siempre el avatar elegido', () => {
      const result = resolveAvatarSrc({ useGooglePhoto: true }, 'guest', 'https://foto.google/x', 'avatar.png');
      expect(result).toEqual({ src: 'avatar.png', isGoogle: false });
    });
  });
});
