// src/components/LoginScreen.jsx
// Puerta de entrada: el usuario elige entre cuenta Google (sync entre
// dispositivos vía Firestore) o modo invitado (todo en localStorage).
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { useAuth } from '@/context/AuthContext.jsx';

// Logo G de Google (svg inline para no añadir dependencia).
function GoogleIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.4 6.3 14.7z"/>
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.5 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.6l6.2 5.2C41.9 35.5 44 30 44 24c0-1.3-.1-2.4-.4-3.5z"/>
    </svg>
  );
}

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signInWithGoogle, continueAsGuest, error } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleGoogle = async () => {
    if (busy) return;
    setBusy(true);
    try { await signInWithGoogle(); }
    finally { setBusy(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: J.paper }}>
      <div
        className="max-w-sm w-full"
        style={{ background: J.paperHi, borderRadius: 22, padding: 32, border: `1px solid ${J.hair}` }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="font-cn"
            style={{
              width: 64, height: 64, borderRadius: 18, background: J.jade, color: J.butter,
              fontSize: 36, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            路
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: J.ink, margin: '16px 0 6px' }}>
            {t('login_title', '¡Bienvenido!')}
          </h1>
          <p style={{ color: J.inkSoft, fontSize: 13, margin: 0 }}>
            {t('login_subtitle', 'Elige cómo quieres empezar')}
          </p>
        </div>

        {/* Botón Google */}
        <button
          onClick={handleGoogle}
          disabled={busy}
          style={{
            width: '100%', padding: '14px 18px', borderRadius: 14,
            background: J.paper, color: J.ink,
            border: `2px solid ${J.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontWeight: 700, fontSize: 15, cursor: busy ? 'default' : 'pointer',
            opacity: busy ? 0.6 : 1, transition: 'all 180ms ease',
          }}
        >
          <GoogleIcon />
          {busy ? t('login_connecting', 'Conectando…') : t('login_with_google', 'Continuar con Google')}
        </button>

        {/* Separador */}
        <div className="flex items-center gap-3" style={{ margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: J.hair }} />
          <span style={{ color: J.muteStrong, fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {t('login_or', 'o')}
          </span>
          <div style={{ flex: 1, height: 1, background: J.hair }} />
        </div>

        {/* Botón Invitado */}
        <button
          onClick={continueAsGuest}
          disabled={busy}
          style={{
            width: '100%', padding: '14px 18px', borderRadius: 14, border: 0,
            background: J.jade, color: J.onAccent,
            fontWeight: 700, fontSize: 15, cursor: 'pointer',
            boxShadow: '0 4px 12px -4px rgba(31,74,51,0.4)',
          }}
        >
          {t('login_as_guest', 'Continuar como invitado')}
        </button>

        <p style={{ color: J.muteStrong, fontSize: 11, textAlign: 'center', marginTop: 18, lineHeight: 1.5 }}>
          {t(
            'login_guest_warning',
            'Como invitado tu progreso se guarda solo en este dispositivo.',
          )}
        </p>

        {error && (
          <div style={{
            marginTop: 14, padding: 10, borderRadius: 10,
            background: J.redBg, color: J.redDeep, fontSize: 12, textAlign: 'center',
          }}>
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
