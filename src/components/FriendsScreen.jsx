// src/components/FriendsScreen.jsx
// Pantalla de Amigos: tu código de amigo, añadir por código, invitaciones
// (recibidas/enviadas) y lista de amigos con ranking por XP. Solo para
// usuarios Google; en modo invitado muestra una invitación a iniciar sesión.
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { JTopBar, JMark, JSection, JCard, JLabel } from '@/components/jade';
import { useAuth } from '@/context/AuthContext.jsx';
import { useSocial } from '@/hooks/useSocial.js';
import { getAvatarById, DEFAULT_AVATAR_ID } from '@/data/avatars.js';
import { loadUserProfile, resolveAvatarSrc } from '@/utils/userProfile.js';
import { getStreak } from '@/utils/streak.js';
import { getLevelInfo } from '@/utils/leveling.js';
import { formatCode, normalizeCode } from '@/lib/socialStore.js';

const APP_URL = 'https://aprende-chino-hsk1.vercel.app/';

// Resuelve la imagen de un perfil público (foto Google o avatar del catálogo).
function avatarSrcOf(profile) {
  if (profile?.photoURL) return profile.photoURL;
  const a = getAvatarById(profile?.avatarId) || getAvatarById(DEFAULT_AVATAR_ID);
  return a.src;
}

function Avatar({ src, size = 44, ring = J.jade }) {
  return (
    <span style={{
      background: J.paperHi, border: `2px solid ${ring}`, borderRadius: '50%',
      width: size, height: size, overflow: 'hidden', flexShrink: 0, display: 'block',
    }}>
      <img src={src} alt="" draggable={false} referrerPolicy="no-referrer"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
    </span>
  );
}

function BackButton({ label, onClick }) {
  return (
    <button onClick={onClick}
      style={{ background: J.paperHi, border: 0, borderRadius: 14, padding: '6px 12px',
               fontSize: 13, color: J.inkSoft, fontWeight: 600, cursor: 'pointer' }}>
      ← {label}
    </button>
  );
}

export default function FriendsScreen({ userName, onBack }) {
  const { t } = useTranslation();
  const { mode, user } = useAuth();
  const {
    enabled, loading, myCode, friends, incoming, outgoing,
    addByCode, acceptRequest, declineRequest, cancelRequest, removeFriend,
  } = useSocial();

  const [codeInput, setCodeInput] = useState('');
  const [note, setNote] = useState(null);     // { type, text }
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  // Datos propios para la fila "yo" del ranking (frescos desde localStorage).
  const meRow = useMemo(() => {
    const streak = getStreak();
    const profile = loadUserProfile();
    const eff = resolveAvatarSrc(profile, mode, user?.photoURL,
      (getAvatarById(profile.avatarId) || getAvatarById(DEFAULT_AVATAR_ID)).src);
    return {
      uid: user?.uid,
      isMe: true,
      name: userName || t('settings_default_user'),
      src: eff.src,
      totalXP: streak.totalXP || 0,
      level: getLevelInfo(streak.totalXP || 0).level,
      currentStreak: streak.currentStreak || 0,
    };
  }, [userName, mode, user, t]);

  // Ranking: yo + amigos, ordenado por XP descendente.
  const ranking = useMemo(() => {
    const rows = [meRow];
    for (const f of friends) {
      const p = f.profile;
      rows.push({
        uid: f.uid,
        isMe: false,
        name: p?.displayName || '…',
        src: avatarSrcOf(p),
        totalXP: p?.totalXP || 0,
        level: p?.level || 1,
        currentStreak: p?.currentStreak || 0,
      });
    }
    return rows.sort((a, b) => b.totalXP - a.totalXP);
  }, [meRow, friends]);

  if (!enabled) {
    return (
      <div style={{ minHeight: '100vh', background: J.paper, paddingBottom: 90 }}>
        <JTopBar left={<JMark />} />
        <div style={{ padding: '6px 20px 24px' }}>
          {onBack && <BackButton label={t('friends_back', 'Perfil')} onClick={onBack} />}
          <JSection label={t('friends_title', 'Amigos')} cn="朋友" />
          <JCard>
            <p style={{ fontSize: 14, color: J.inkSoft, lineHeight: 1.5 }}>
              {t('friends_guest_cta', 'Inicia sesión con Google para añadir amigos, ver invitaciones y comparar vuestro progreso.')}
            </p>
          </JCard>
        </div>
      </div>
    );
  }

  const flash = (type, text) => {
    setNote({ type, text });
    setTimeout(() => setNote(null), 2600);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const code = normalizeCode(codeInput);
    if (code.length < 6) { flash('err', t('friends_err_short', 'Código incompleto.')); return; }
    setBusy(true);
    try {
      await addByCode(code);
      setCodeInput('');
      flash('ok', t('friends_sent', '¡Invitación enviada!'));
    } catch (err) {
      const map = {
        'not-found': t('friends_err_notfound', 'No existe ningún usuario con ese código.'),
        'self': t('friends_err_self', 'Ese es tu propio código 🙂'),
        'already-friends': t('friends_err_already', 'Ya sois amigos.'),
      };
      flash('err', map[err?.code] || t('friends_err_generic', 'No se pudo enviar la invitación.'));
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = async () => {
    if (!myCode) return;
    try {
      await navigator.clipboard.writeText(formatCode(myCode));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard bloqueado */ }
  };

  const handleShareCode = async () => {
    if (!myCode) return;
    const text = `${t('friends_share_text', 'Añádeme en Aprende Chino con mi código de amigo')}: ${formatCode(myCode)}\n\n${APP_URL}`;
    try {
      if (navigator.share) await navigator.share({ title: 'Aprende Chino', text, url: APP_URL });
      else { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    } catch { /* cancelado */ }
  };

  const handleRemove = async (row) => {
    if (!window.confirm(t('friends_remove_confirm', '¿Eliminar a {{name}} de tus amigos?', { name: row.name }))) return;
    try { await removeFriend(row.uid); }
    catch { flash('err', t('friends_err_generic', 'No se pudo completar la acción.')); }
  };

  return (
    <div style={{ minHeight: '100vh', background: J.paper, paddingBottom: 90 }}>
      <JTopBar left={<JMark />} />
      <div style={{ padding: '6px 20px 24px' }}>
        {onBack && <BackButton label={t('friends_back', 'Perfil')} onClick={onBack} />}

        <h1 style={{ margin: '10px 0 0', fontWeight: 700, fontSize: 26, letterSpacing: '-0.025em', color: J.ink }}>
          {t('friends_title', 'Amigos')}<span style={{ color: J.red }}>.</span>
        </h1>
        <p style={{ color: J.inkSoft, fontSize: 13.5, marginTop: 4 }}>
          朋友 · {t('friends_subtitle', 'Aprended juntos y comparad vuestro progreso')}
        </p>

        {/* ─── Mi código de amigo ──────────────────────────────────────────── */}
        <JSection label={t('friends_my_code', 'Tu código de amigo')} cn="好友码" />
        <div style={{
          background: J.jade, color: J.paperHi, borderRadius: 18, padding: '18px 20px',
          boxShadow: '0 6px 16px -6px rgba(31,74,51,0.5)',
        }}>
          <JLabel color={J.butter}>{t('friends_my_code', 'Tu código de amigo')}</JLabel>
          <div style={{
            fontSize: 34, fontWeight: 800, letterSpacing: '0.08em', color: J.butter,
            marginTop: 6, fontFamily: J.mono,
          }}>
            {myCode ? formatCode(myCode) : '······'}
          </div>
          <div className="flex gap-2" style={{ marginTop: 14 }}>
            <button onClick={handleCopy} disabled={!myCode}
              style={{ flex: 1, padding: '10px 12px', borderRadius: 12, border: 0,
                       background: 'rgba(255,255,255,0.16)', color: J.paperHi, fontSize: 13,
                       fontWeight: 700, cursor: myCode ? 'pointer' : 'default' }}>
              {copied ? t('friends_copied', '¡Copiado!') : t('friends_copy', 'Copiar')}
            </button>
            <button onClick={handleShareCode} disabled={!myCode}
              style={{ flex: 1, padding: '10px 12px', borderRadius: 12, border: 0,
                       background: J.butter, color: J.jadeDeep, fontSize: 13,
                       fontWeight: 800, cursor: myCode ? 'pointer' : 'default' }}>
              {t('friends_share', 'Compartir')}
            </button>
          </div>
        </div>

        {/* ─── Añadir amigo por código ─────────────────────────────────────── */}
        <JSection label={t('friends_add', 'Añadir amigo')} cn="添加" />
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            value={codeInput}
            onChange={(e) => setCodeInput(formatCode(normalizeCode(e.target.value).slice(0, 6)))}
            placeholder={t('friends_add_placeholder', 'Código de tu amigo')}
            inputMode="text"
            autoCapitalize="characters"
            maxLength={7}
            style={{
              flex: 1, padding: '12px 14px', borderRadius: 12,
              border: `1px solid ${J.border}`, background: J.paperHi,
              fontSize: 16, fontWeight: 700, letterSpacing: '0.06em',
              color: J.ink, fontFamily: J.mono, textTransform: 'uppercase',
            }}
          />
          <button type="submit" disabled={busy}
            style={{ padding: '12px 18px', borderRadius: 12, border: 0, background: J.red,
                     color: J.paperHi, fontSize: 14, fontWeight: 700,
                     cursor: busy ? 'default' : 'pointer', opacity: busy ? 0.7 : 1 }}>
            {t('friends_add_button', 'Enviar')}
          </button>
        </form>
        {note && (
          <p style={{ marginTop: 8, fontSize: 13, fontWeight: 600,
                      color: note.type === 'ok' ? J.jade : J.red }}>
            {note.text}
          </p>
        )}

        {/* ─── Invitaciones recibidas ──────────────────────────────────────── */}
        {incoming.length > 0 && (
          <>
            <JSection label={t('friends_incoming', 'Invitaciones recibidas')} cn="邀请"
              right={<span style={{ fontSize: 12, fontWeight: 700, color: J.red }}>{incoming.length}</span>} />
            <div className="space-y-2">
              {incoming.map((req) => (
                <JCard key={req.id} padding="10px 12px">
                  <div className="flex items-center gap-3">
                    <Avatar src={avatarSrcOf({ photoURL: req.fromPhotoURL, avatarId: req.fromAvatarId })} size={42} ring={J.red} />
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 14, fontWeight: 700, color: J.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {req.fromName || t('settings_default_user')}
                      </p>
                      <p style={{ fontSize: 12, color: J.mute }}>{t('friends_wants_to_add', 'Quiere ser tu amigo')}</p>
                    </div>
                    <button onClick={() => acceptRequest(req)} aria-label={t('friends_accept', 'Aceptar')}
                      style={{ padding: '8px 14px', borderRadius: 10, border: 0, background: J.jade,
                               color: J.paperHi, fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                      {t('friends_accept', 'Aceptar')}
                    </button>
                    <button onClick={() => declineRequest(req)} aria-label={t('friends_decline', 'Rechazar')}
                      style={{ padding: '8px 10px', borderRadius: 10, border: `1px solid ${J.hairS}`,
                               background: 'transparent', color: J.mute, fontSize: 16, fontWeight: 700,
                               cursor: 'pointer', lineHeight: 1 }}>
                      ✕
                    </button>
                  </div>
                </JCard>
              ))}
            </div>
          </>
        )}

        {/* ─── Invitaciones enviadas ───────────────────────────────────────── */}
        {outgoing.length > 0 && (
          <>
            <JSection label={t('friends_outgoing', 'Invitaciones enviadas')} cn="已发送" />
            <div className="space-y-2">
              {outgoing.map((req) => (
                <JCard key={req.id} padding="10px 12px">
                  <div className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: 13, color: J.inkSoft, fontWeight: 600 }}>
                        {t('friends_pending', 'Pendiente de aceptar')}
                      </p>
                    </div>
                    <button onClick={() => cancelRequest(req)}
                      style={{ padding: '6px 12px', borderRadius: 10, border: `1px solid ${J.hairS}`,
                               background: 'transparent', color: J.mute, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                      {t('friends_cancel', 'Cancelar')}
                    </button>
                  </div>
                </JCard>
              ))}
            </div>
          </>
        )}

        {/* ─── Ranking de amigos ───────────────────────────────────────────── */}
        <JSection label={t('friends_ranking', 'Clasificación')} cn="排行榜"
          right={<span style={{ fontSize: 12, fontWeight: 700, color: J.mute }}>{friends.length} {t('friends_count', 'amigos')}</span>} />
        {loading ? (
          <JCard><p style={{ fontSize: 13, color: J.mute, textAlign: 'center' }}>{t('friends_loading', 'Cargando…')}</p></JCard>
        ) : friends.length === 0 ? (
          <JCard>
            <p style={{ fontSize: 14, color: J.inkSoft, lineHeight: 1.5 }}>
              {t('friends_empty', 'Aún no tienes amigos. Comparte tu código para empezar.')}
            </p>
          </JCard>
        ) : (
          <JCard padding="6px 0">
            {ranking.map((row, i) => (
              <div key={row.uid || i} className="flex items-center gap-3"
                style={{
                  padding: '10px 16px',
                  borderTop: i === 0 ? 0 : `1px solid ${J.hair}`,
                  background: row.isMe ? J.jadeBg : 'transparent',
                }}>
                <span style={{ width: 22, textAlign: 'center', fontSize: 14, fontWeight: 800,
                               color: i === 0 ? J.sand : J.mute }}>
                  {i + 1}
                </span>
                <Avatar src={row.src} size={40} ring={row.isMe ? J.jade : J.hairS} />
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: 14, fontWeight: 700, color: J.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.name}{row.isMe && <span style={{ color: J.jade, fontWeight: 600 }}> · {t('friends_you', 'tú')}</span>}
                  </p>
                  <p style={{ fontSize: 12, color: J.mute }}>
                    {t('friends_level', 'Nivel')} {row.level}
                    {row.currentStreak > 0 && <> · 🔥 {row.currentStreak}</>}
                  </p>
                </div>
                <span style={{ fontSize: 13, fontWeight: 800, color: J.jade }}>
                  {row.totalXP.toLocaleString()} XP
                </span>
                {!row.isMe && (
                  <button onClick={() => handleRemove(row)} aria-label={t('friends_remove', 'Eliminar amigo')}
                    style={{ background: 'transparent', border: 0, color: J.mute2, cursor: 'pointer', padding: 4, lineHeight: 1 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </JCard>
        )}
      </div>
    </div>
  );
}
