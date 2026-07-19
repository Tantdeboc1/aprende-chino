// src/components/WelcomeFlow.jsx
import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { GENDERS, updateUserProfile } from '@/utils/userProfile.js';
import { AVATARS, getAvatarsByGender, isAvatarUnlocked, DEFAULT_AVATAR_ID } from '@/data/avatars.js';
import { setDailyGoal, DAILY_GOAL_PRESETS, getStreak } from '@/utils/streak.js';
import { getLevelInfo } from '@/utils/leveling.js';
import { APP_NAME } from '@/utils/appInfo.js';

const STEPS = 4;

export default function WelcomeFlow({ onComplete }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [gender, setGender] = useState(null);
  const [avatarId, setAvatarId] = useState(null);
  // 'normal' preseleccionado: el usuario puede pasar el paso sin pensar.
  const [goalXp, setGoalXp] = useState(120);

  // Galería filtrada por género; si el filtro deja muy pocos (p. ej. 'nb'),
  // se muestran todos para que siempre haya variedad donde elegir. Los
  // avatares con desbloqueo por nivel no aparecen en el onboarding (un
  // usuario nuevo es nivel 1; uno migrado conserva su nivel).
  const gallery = useMemo(() => {
    const level = getLevelInfo(getStreak().totalXP || 0).level;
    const unlocked = (list) => list.filter(a => isAvatarUnlocked(a, level));
    const filtered = unlocked(getAvatarsByGender(gender));
    return filtered.length >= 4 ? filtered : unlocked(AVATARS);
  }, [gender]);

  const trimmedName = name.trim();
  const canNext =
    step === 0 ? !!trimmedName :
    step === 1 ? !!gender :
    step === 2 ? !!avatarId :
    true; // paso 3 (meta) siempre tiene valor preseleccionado

  const goNext = () => {
    if (!canNext) return;
    if (step < STEPS - 1) {
      setStep(s => s + 1);
    } else {
      // El usuario eligió un avatar de forma explícita en el onboarding: ese
      // avatar manda. Desactivamos la foto de Google (si entra con Google)
      // para que se vea lo que ha elegido — si la prefiere, la reactiva con el
      // interruptor de Ajustes. Mismo criterio que al elegir avatar en Ajustes.
      updateUserProfile({ gender, avatarId: avatarId || DEFAULT_AVATAR_ID, useGooglePhoto: false });
      setDailyGoal(goalXp);
      onComplete(trimmedName);
    }
  };

  const goBack = () => setStep(s => Math.max(0, s - 1));

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: J.paper }}>
      <div className="max-w-sm w-full" style={{ background: J.paperHi, borderRadius: 22, padding: 32, border: `1px solid ${J.hair}` }}>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="font-cn flex justify-center"
            style={{ width: 56, height: 56, borderRadius: 16, background: J.jade, color: J.butter,
                     fontSize: 32, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            路
          </div>
          {/* Marca fija + tagline traducido */}
          <p style={{ color: J.ink, fontSize: 16, fontWeight: 700, marginTop: 10, marginBottom: 0 }}>{APP_NAME}</p>
          <p style={{ color: J.inkSoft, fontSize: 13, marginTop: 2 }}>{t('app_tagline', 'Learn Chinese')}</p>
        </div>

        {/* Indicador de paso */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: STEPS }).map((_, i) => (
            <span key={i} style={{
              width: i === step ? 22 : 8, height: 8, borderRadius: 99,
              background: i <= step ? J.jade : J.hair,
              transition: 'all 250ms ease',
            }} />
          ))}
        </div>

        {/* ── Paso 0: Nombre ── */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 style={{ fontSize: 20, fontWeight: 700, color: J.ink, textAlign: 'center', margin: 0 }}>
              {t('welcome_name_placeholder')}
            </h2>
            <input
              type="text"
              autoFocus
              placeholder={t('welcome_name_placeholder')}
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') goNext(); }}
              className="placeholder-[var(--mute-strong)]"
              style={{
                width: '100%', padding: '14px 18px', border: `2px solid ${J.border}`, borderRadius: 14,
                fontSize: 16, background: J.paper, color: J.ink, outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = J.jade}
              onBlur={e => e.target.style.borderColor = J.hair}
            />
          </div>
        )}

        {/* ── Paso 1: Género ── */}
        {step === 1 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: J.ink, textAlign: 'center', margin: '0 0 18px' }}>
              {t('welcome_step_gender_title')}
            </h2>
            <div className="flex flex-col gap-3">
              {GENDERS.map(g => {
                const on = gender === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setGender(g.id)}
                    className="flex items-center gap-3 w-full"
                    style={{
                      padding: '14px 18px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                      background: on ? J.jade : J.paper,
                      border: `2px solid ${on ? J.jadeDeep : J.hair}`,
                      color: on ? J.paperHi : J.ink,
                      transition: 'all 180ms ease',
                    }}
                  >
                    <span className="font-cn" style={{ fontSize: 22, fontWeight: 700 }}>{g.cn}</span>
                    <span style={{ fontSize: 15, fontWeight: 700 }}>{t(g.i18nKey)}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Paso 2: Avatar ── */}
        {step === 2 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: J.ink, textAlign: 'center', margin: '0 0 18px' }}>
              {t('avatar_picker_title')}
            </h2>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))', gap: 10,
              maxHeight: 280, overflowY: 'auto',
            }}>
              {gallery.map(av => {
                const selected = av.id === avatarId;
                return (
                  <button
                    key={av.id}
                    onClick={() => setAvatarId(av.id)}
                    title={av.label}
                    style={{
                      background: selected ? J.jade : J.paper,
                      border: `2px solid ${selected ? J.jadeDeep : J.hair}`,
                      borderRadius: 14, padding: 5, cursor: 'pointer',
                      aspectRatio: '1 / 1', overflow: 'hidden', position: 'relative',
                      transform: selected ? 'scale(1.04)' : 'scale(1)',
                      transition: 'transform 150ms ease, background 200ms ease',
                    }}
                  >
                    <img src={av.src} alt={t('avatar_' + av.id, av.label)} draggable={false}
                      loading="lazy" decoding="async"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 10, display: 'block' }} />
                    {selected && (
                      <span style={{
                        position: 'absolute', top: 3, right: 3,
                        background: J.butter, color: J.jadeDeep,
                        fontSize: 10, fontWeight: 800, width: 18, height: 18, borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.35)',
                      }}>✓</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Paso 3: Meta diaria ── */}
        {step === 3 && (
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: J.ink, textAlign: 'center', margin: '0 0 6px' }}>
              {t('welcome_step_goal_title', '¿Cuánto quieres practicar al día?')}
            </h2>
            <p style={{ fontSize: 12.5, color: J.inkSoft, textAlign: 'center', margin: '0 0 18px' }}>
              {t('welcome_step_goal_hint', 'Puedes cambiarlo cuando quieras en Ajustes')}
            </p>
            <div className="flex flex-col gap-3">
              {DAILY_GOAL_PRESETS.map(p => {
                const on = goalXp === p.xp;
                const label = t(`settings_goal_${p.id}`);
                const desc = t(`welcome_goal_${p.id}_desc`);
                return (
                  <button
                    key={p.id}
                    onClick={() => setGoalXp(p.xp)}
                    className="flex items-center gap-3 w-full"
                    style={{
                      padding: '14px 18px', borderRadius: 14, cursor: 'pointer', textAlign: 'left',
                      background: on ? J.jade : J.paper,
                      border: `2px solid ${on ? J.jadeDeep : J.hair}`,
                      color: on ? J.paperHi : J.ink,
                      transition: 'all 180ms ease',
                    }}
                  >
                    <span style={{ fontSize: 22 }}>{p.icon}</span>
                    <span style={{ flex: 1 }}>
                      <span style={{ display: 'block', fontSize: 15, fontWeight: 700 }}>
                        {label} · {p.xp} XP
                      </span>
                      <span style={{ display: 'block', fontSize: 12, opacity: 0.8 }}>{desc}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Navegación */}
        <div className="flex gap-3" style={{ marginTop: 24 }}>
          {step > 0 && (
            <button
              onClick={goBack}
              style={{
                padding: '14px 20px', borderRadius: 99, border: `1px solid ${J.hair}`,
                background: J.paper, color: J.ink, fontWeight: 700, fontSize: 15, cursor: 'pointer',
              }}
            >
              {t('welcome_back_button')}
            </button>
          )}
          <button
            onClick={goNext}
            disabled={!canNext}
            style={{
              flex: 1, padding: '14px 22px', borderRadius: 99, border: 0,
              background: canNext ? J.jade : J.mute2,
              color: J.onAccent, fontWeight: 700, fontSize: 15,
              cursor: canNext ? 'pointer' : 'default',
              boxShadow: canNext ? '0 4px 12px -4px rgba(31,74,51,0.4)' : 'none',
            }}
          >
            {step < STEPS - 1 ? t('welcome_next_button') : t('welcome_start_button')}
          </button>
        </div>
      </div>
    </div>
  );
}
