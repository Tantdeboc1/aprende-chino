// src/hooks/useSocial.test.js
// El nombre y la foto que viajan dentro de una invitación los escribe el
// emisor, así que puede poner los de otra persona. Estos tests fijan que el
// receptor solo muestre la identidad resuelta desde publicProfiles/{from}.
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const MY_UID = 'me-uid';

vi.mock('@/context/AuthContext.jsx', () => ({
  useAuth: () => ({ mode: 'google', user: { uid: MY_UID, photoURL: null } }),
}));

// Perfiles públicos por uid (la fuente fiable: solo su dueño los escribe).
let publicProfiles = {};
// Invitaciones entrantes tal cual llegan de Firestore (payload del emisor).
let incomingDocs = [];

vi.mock('@/lib/socialStore.js', () => ({
  subscribeIncomingRequests: (uid, cb) => { cb(incomingDocs); return Promise.resolve(() => {}); },
  subscribeOutgoingRequests: (uid, cb) => { cb([]); return Promise.resolve(() => {}); },
  subscribeFriendships:      (uid, cb) => { cb([]); return Promise.resolve(() => {}); },
  fetchPublicProfile: (uid) => Promise.resolve(publicProfiles[uid] || null),
  syncPublicProfile: () => Promise.resolve(),
}));

const { useSocial } = await import('./useSocial.js');

beforeEach(() => {
  publicProfiles = { [MY_UID]: { uid: MY_UID, displayName: 'Yo', friendCode: 'ABC123' } };
  incomingDocs = [];
});

describe('useSocial · identidad de las invitaciones recibidas', () => {
  it('muestra el nombre del perfil público, no el que escribió el emisor', async () => {
    publicProfiles['atacante'] = {
      uid: 'atacante', displayName: 'Pepe', avatarId: 'a1', photoURL: null,
    };
    incomingDocs = [{
      id: 'atacante_me-uid', from: 'atacante', to: MY_UID,
      fromName: 'Soporte HanyuPath', fromAvatarId: 'falso', fromPhotoURL: 'https://malo.example/x.png',
    }];

    const { result } = renderHook(() => useSocial());

    await waitFor(() => expect(result.current.incoming[0]?.fromName).toBe('Pepe'));
    expect(result.current.incoming[0].fromAvatarId).toBe('a1');
    expect(result.current.incoming[0].fromPhotoURL).toBeNull();
  });

  it('sin perfil público del emisor cae al usuario genérico, no al payload', async () => {
    // Un emisor sin publicProfiles/{uid} no puede colar su nombre por la puerta
    // de atrás: preferimos un nombre vacío a uno suplantado.
    incomingDocs = [{
      id: 'anon_me-uid', from: 'anon', to: MY_UID,
      fromName: 'Soporte HanyuPath', fromAvatarId: 'falso', fromPhotoURL: 'https://malo.example/x.png',
    }];

    const { result } = renderHook(() => useSocial());

    await waitFor(() => expect(result.current.incoming).toHaveLength(1));
    expect(result.current.incoming[0].fromName).toBe('');
    expect(result.current.incoming[0].fromPhotoURL).toBeNull();
  });
});
