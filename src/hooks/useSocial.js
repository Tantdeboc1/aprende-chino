// src/hooks/useSocial.js
// Estado social en tiempo real para la pantalla de Amigos: mi código, amigos
// (con su perfil público para el ranking) e invitaciones entrantes/salientes.
// Solo opera con usuarios Google; en otro modo devuelve estado vacío.
//
// Toda la capa de Firestore vive en lib/socialStore.js y se importa de forma
// diferida: este hook solo se monta dentro de FriendsScreen (lazy), así que el
// SDK no entra en el bundle de arranque.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '@/context/AuthContext.jsx';

export function useSocial() {
  const { mode, user } = useAuth();
  const uid = mode === 'google' ? (user?.uid || null) : null;

  const [me, setMe] = useState(null);            // mi perfil público (incluye friendCode)
  const [incoming, setIncoming] = useState([]);  // invitaciones recibidas
  const [outgoing, setOutgoing] = useState([]);  // invitaciones enviadas
  const [friendships, setFriendships] = useState([]);
  const [friendProfiles, setFriendProfiles] = useState({}); // uid → perfil público
  const [senderProfiles, setSenderProfiles] = useState({}); // uid → perfil de quien me invita
  const [loading, setLoading] = useState(true);

  const storeRef = useRef(null);
  const getStore = useCallback(async () => {
    if (!storeRef.current) storeRef.current = await import('@/lib/socialStore.js');
    return storeRef.current;
  }, []);

  // Suscripciones en tiempo real (invitaciones + amistades).
  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    let cancelled = false;
    const unsubs = [];
    const track = (p) => p
      .then((u) => { if (cancelled) u(); else unsubs.push(u); })
      .catch((e) => console.warn('Suscripción social falló:', e));

    (async () => {
      const m = await getStore();
      if (cancelled) return;
      track(m.subscribeIncomingRequests(uid, (list) => !cancelled && setIncoming(list)));
      track(m.subscribeOutgoingRequests(uid, (list) => !cancelled && setOutgoing(list)));
      track(m.subscribeFriendships(uid, (list) => {
        if (cancelled) return;
        setFriendships(list);
        setLoading(false);
      }));
    })();

    return () => {
      cancelled = true;
      unsubs.forEach((u) => { try { u(); } catch {} });
    };
  }, [uid, getStore]);

  // Mi perfil público / código. Si aún no existe, lo genera con syncPublicProfile.
  useEffect(() => {
    if (!uid) return;
    let alive = true;
    (async () => {
      try {
        const m = await getStore();
        let prof = await m.fetchPublicProfile(uid);
        if (!prof?.friendCode) {
          try {
            await m.syncPublicProfile({ uid, photoURL: user?.photoURL || null });
            prof = await m.fetchPublicProfile(uid);
          } catch (e) { console.warn('No se pudo crear el perfil público:', e); }
        }
        if (alive) setMe(prof);
      } catch (e) {
        // Error de red/Firestore al leer el perfil: lo tragamos para no soltar
        // un unhandled rejection a Sentry (la UI se queda sin código de amigo).
        console.warn('No se pudo leer el perfil público:', e);
      }
    })();
    return () => { alive = false; };
  }, [uid, user?.photoURL, getStore]);

  // Lista estable de "otros" uid con los que tengo amistad.
  const otherUids = useMemo(
    () => friendships
      .map((f) => (f.members || []).find((x) => x !== uid))
      .filter(Boolean),
    [friendships, uid],
  );
  const otherUidsKey = otherUids.slice().sort().join(',');

  // Perfiles públicos de los amigos (para nombre/avatar/ranking).
  useEffect(() => {
    if (!uid || otherUids.length === 0) { setFriendProfiles({}); return; }
    let alive = true;
    (async () => {
      try {
        const m = await getStore();
        const entries = await Promise.all(
          otherUids.map(async (o) => [o, await m.fetchPublicProfile(o)]),
        );
        if (alive) setFriendProfiles(Object.fromEntries(entries.filter(([, p]) => p)));
      } catch (e) {
        // Error de red/Firestore al leer perfiles de amigos: lo tragamos para no
        // soltar un unhandled rejection a Sentry (el ranking se queda sin datos).
        console.warn('No se pudieron leer los perfiles de amigos:', e);
      }
    })();
    return () => { alive = false; };
    // otherUidsKey resume el contenido para no refetch en cada snapshot idéntico.
  }, [uid, otherUidsKey, getStore]); // eslint-disable-line react-hooks/exhaustive-deps

  // Amigos resueltos (uid + perfil), listos para pintar/ordenar.
  const friends = useMemo(
    () => otherUids.map((o) => ({ uid: o, profile: friendProfiles[o] || null })),
    [otherUids, friendProfiles],
  );

  // Perfiles públicos de quien me invita. El nombre y la foto que viajan DENTRO
  // de la invitación los escribe el emisor, así que puede poner los de otra
  // persona y hacerse pasar por ella. La fuente fiable es publicProfiles/{from}:
  // solo su dueño puede escribirlo y las reglas le validan el esquema.
  const incomingUids = useMemo(
    () => [...new Set(incoming.map((r) => r.from).filter(Boolean))],
    [incoming],
  );
  const incomingUidsKey = incomingUids.slice().sort().join(',');

  useEffect(() => {
    if (!uid || incomingUids.length === 0) { setSenderProfiles({}); return; }
    let alive = true;
    (async () => {
      try {
        const m = await getStore();
        const entries = await Promise.all(
          incomingUids.map(async (o) => [o, await m.fetchPublicProfile(o)]),
        );
        if (alive) setSenderProfiles(Object.fromEntries(entries.filter(([, p]) => p)));
      } catch (e) {
        // Sin perfil resuelto la invitación se pinta como usuario genérico
        // (ver incomingShown). Tragamos el error para no soltar un unhandled
        // rejection a Sentry.
        console.warn('No se pudieron leer los perfiles de los emisores:', e);
      }
    })();
    return () => { alive = false; };
    // incomingUidsKey resume el contenido para no refetch en cada snapshot igual.
  }, [uid, incomingUidsKey, getStore]); // eslint-disable-line react-hooks/exhaustive-deps

  // Oculta invitaciones con gente que ya es amiga (puede quedar alguna suelta
  // tras invitaciones cruzadas): ni se aceptan ni se reenvían, solo confunden.
  const friendUidSet = useMemo(() => new Set(otherUids), [otherUids]);
  // A quién le he escrito yo: sirve para detectar invitaciones cruzadas.
  const outgoingUidSet = useMemo(
    () => new Set(outgoing.map((r) => r.to).filter(Boolean)),
    [outgoing],
  );
  // Quién me ha escrito a mí: para no crear una segunda invitación cuando
  // basta con aceptar la suya.
  const incomingUidSet = useMemo(
    () => new Set(incoming.map((r) => r.from).filter(Boolean)),
    [incoming],
  );
  const incomingShown = useMemo(
    () => incoming
      .filter((r) => !friendUidSet.has(r.from))
      // Identidad SIEMPRE desde el perfil público, nunca desde el payload. Si
      // aún no ha cargado (o el emisor no tiene perfil), se pinta el usuario
      // genérico: preferimos un nombre vacío a uno suplantado.
      // De paso se exponen nivel y racha (ya los tenemos descargados): sin
      // ellos la tarjeta solo decía "quiere ser tu amigo" y se aceptaba a ciegas.
      .map((r) => {
        const p = senderProfiles[r.from];
        return {
          ...r,
          fromName:     p?.displayName || '',
          fromAvatarId: p?.avatarId    || null,
          fromPhotoURL: p?.photoURL    || null,
          fromLevel:    p?.level ?? null,
          fromStreak:   p?.currentStreak ?? 0,
          // Los dos os habéis invitado: aceptar zanja las dos invitaciones.
          mutual:       outgoingUidSet.has(r.from),
        };
      }),
    [incoming, friendUidSet, senderProfiles, outgoingUidSet],
  );
  const outgoingShown = useMemo(
    () => outgoing
      .filter((r) => !friendUidSet.has(r.to))
      .map((r) => ({ ...r, mutual: incomingUidSet.has(r.to) })),
    [outgoing, friendUidSet, incomingUidSet],
  );

  // ─── Acciones ──────────────────────────────────────────────────────────────
  // Fase 1: resuelve un código a { uid, profile } para que la UI confirme
  // "¿enviar a Fulanito?" antes de crear nada.
  const lookupCode = useCallback(async (rawCode) => {
    const m = await getStore();
    const toUid = await m.resolveFriendCode(rawCode);
    if (!toUid) { const e = new Error('not-found'); e.code = 'not-found'; throw e; }
    if (toUid === uid) { const e = new Error('self'); e.code = 'self'; throw e; }
    if (friendUidSet.has(toUid)) { const e = new Error('already-friends'); e.code = 'already-friends'; throw e; }
    const profile = await m.fetchPublicProfile(toUid);
    // Si esa persona ya te invitó, no tiene sentido crear una segunda
    // invitación cruzada: la pantalla ofrecerá aceptar la suya.
    return { uid: toUid, profile, theyInvitedYou: incomingUidSet.has(toUid) };
  }, [uid, friendUidSet, incomingUidSet, getStore]);

  // Fase 2: envía la invitación al destino ya resuelto/confirmado.
  // Devuelve 'created' o 'already-pending' para que la UI no mienta.
  const sendRequestTo = useCallback(async (target) => {
    const m = await getStore();
    const mine = me || await m.fetchPublicProfile(uid);
    return m.sendFriendRequest({
      fromUid: uid, toUid: target.uid,
      fromPublic: mine, toPublic: target.profile,
    });
  }, [uid, me, getStore]);

  // Aceptar directamente a alguien que ya te invitó (resuelto por código).
  const acceptFrom = useCallback(async (otherUid) => {
    const m = await getStore();
    await m.acceptFriendRequest({ fromUid: otherUid, toUid: uid });
  }, [uid, getStore]);

  const acceptRequest = useCallback(async (req) => {
    const m = await getStore();
    await m.acceptFriendRequest({ fromUid: req.from, toUid: uid });
  }, [uid, getStore]);

  const declineRequest = useCallback(async (req) => {
    const m = await getStore();
    await m.deleteFriendRequest({ fromUid: req.from, toUid: uid });
  }, [uid, getStore]);

  const cancelRequest = useCallback(async (req) => {
    const m = await getStore();
    await m.deleteFriendRequest({ fromUid: uid, toUid: req.to });
  }, [uid, getStore]);

  const removeFriend = useCallback(async (otherUid) => {
    const m = await getStore();
    await m.removeFriend({ myUid: uid, otherUid });
  }, [uid, getStore]);

  return {
    enabled: !!uid,
    loading,
    me,
    myCode: me?.friendCode || null,
    friends,
    incoming: incomingShown,
    outgoing: outgoingShown,
    lookupCode,
    sendRequestTo,
    acceptFrom,
    acceptRequest,
    declineRequest,
    cancelRequest,
    removeFriend,
  };
}
