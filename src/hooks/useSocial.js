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

  // Oculta invitaciones con gente que ya es amiga (puede quedar alguna suelta
  // tras invitaciones cruzadas): ni se aceptan ni se reenvían, solo confunden.
  const friendUidSet = useMemo(() => new Set(otherUids), [otherUids]);
  const incomingShown = useMemo(
    () => incoming.filter((r) => !friendUidSet.has(r.from)),
    [incoming, friendUidSet],
  );
  const outgoingShown = useMemo(
    () => outgoing.filter((r) => !friendUidSet.has(r.to)),
    [outgoing, friendUidSet],
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
    return { uid: toUid, profile };
  }, [uid, friendUidSet, getStore]);

  // Fase 2: envía la invitación al destino ya resuelto/confirmado.
  const sendRequestTo = useCallback(async (target) => {
    const m = await getStore();
    const mine = me || await m.fetchPublicProfile(uid);
    await m.sendFriendRequest({
      fromUid: uid, toUid: target.uid,
      fromPublic: mine, toPublic: target.profile,
    });
  }, [uid, me, getStore]);

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
    acceptRequest,
    declineRequest,
    cancelRequest,
    removeFriend,
  };
}
