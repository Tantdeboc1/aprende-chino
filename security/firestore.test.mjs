import { test, before, beforeEach, after } from 'node:test';
import fs from 'node:fs/promises';
import { initializeTestEnvironment, assertFails, assertSucceeds } from '@firebase/rules-unit-testing';
import { doc, getDoc, getDocs, collection, query, where, setDoc, deleteDoc, serverTimestamp, writeBatch, Timestamp } from 'firebase/firestore';

if (!/^127\.0\.0\.1:\d+$/.test(process.env.FIRESTORE_EMULATOR_HOST || '')) throw new Error('An isolated local emulator is required.');
let env;
const db = uid => uid ? env.authenticatedContext(uid).firestore() : env.unauthenticatedContext().firestore();
const profile = (uid, code) => ({ uid, displayName: uid, avatarId: null, photoURL: null, friendCode: code, totalXP: 100, weeklyXP: 20, level: 1, currentStreak: 1, updatedAt: serverTimestamp() });
const request = (from, to) => ({ from, to, fromName: from, toName: to, fromAvatarId: null, toAvatarId: null, fromPhotoURL: null, toPhotoURL: null, createdAt: serverTimestamp() });
const invitation = (store, from, to, count = 1, windowStart = serverTimestamp()) => {
  const b = writeBatch(store);
  b.set(doc(store, `socialLimits/${from}`), { count, windowStart, lastInviteAt: serverTimestamp(), lastRequestId: `${from}_${to}` });
  b.set(doc(store, `friendRequests/${from}_${to}`), request(from, to));
  return b;
};
before(async () => { env = await initializeTestEnvironment({ projectId: 'demo-hanyupath-security', firestore: { rules: await fs.readFile('firestore.rules', 'utf8') } }); });
beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async c => {
    const store = c.firestore();
    await Promise.all([
      setDoc(doc(store, 'users/alice'), { userName: 'Alice', updatedAt: serverTimestamp() }),
      ...[['alice','ABCDEF'],['bob','GHJKLM'],['stranger','NPQRST']].flatMap(([uid,code]) => [
        setDoc(doc(store, `publicProfiles/${uid}`), profile(uid,code)),
        setDoc(doc(store, `friendCodes/${code}`), { uid, createdAt: serverTimestamp() }),
        setDoc(doc(store, `socialIdentities/${uid}`), { uid, displayName: uid, avatarId: null, photoURL: null }),
      ]),
      setDoc(doc(store, 'friendships/alice_bob'), { members: ['alice', 'bob'] }),
    ]);
  });
});
after(async () => { await env.cleanup(); });

test('anonymous access is denied and private progress belongs only to its owner', async () => {
  for (const path of ['users/alice','publicProfiles/alice','socialIdentities/alice','friendCodes/ABCDEF']) await assertFails(getDoc(doc(db(),path)));
  await assertSucceeds(getDoc(doc(db('alice'),'users/alice')));
  await assertSucceeds(setDoc(doc(db('alice'),'users/alice'), { progress: {}, updatedAt: serverTimestamp() }));
  await assertFails(getDoc(doc(db('bob'),'users/alice')));
  await assertFails(setDoc(doc(db('bob'),'users/alice'), { updatedAt: serverTimestamp() }));
  await assertFails(setDoc(doc(db('alice'),'users/alice'), { admin: true, updatedAt: serverTimestamp() }));
  await assertFails(setDoc(doc(db('alice'),'users/alice'), { updatedAt: 0 }));
  await assertFails(getDocs(collection(db('alice'),'users')));
});
test('discovery exposes minimal identity, not stranger scores or collection listings', async () => {
  await assertSucceeds(getDoc(doc(db('stranger'),'socialIdentities/alice')));
  await assertSucceeds(getDoc(doc(db('stranger'),'friendCodes/ABCDEF')));
  await assertFails(getDoc(doc(db('stranger'),'publicProfiles/alice')));
  for (const name of ['socialIdentities','publicProfiles','friendCodes']) await assertFails(getDocs(collection(db('alice'),name)));
  await assertFails(setDoc(doc(db('alice'),'socialIdentities/alice'), { uid:'alice', displayName:'A', avatarId:null, photoURL:null, totalXP:99 }));
  await assertFails(setDoc(doc(db('bob'),'socialIdentities/alice'), { uid:'alice', displayName:'B', avatarId:null, photoURL:null }));
});
test('friends can read informal XP and removing friendship revokes access', async () => {
  await assertSucceeds(getDoc(doc(db('bob'),'publicProfiles/alice')));
  await assertSucceeds(deleteDoc(doc(db('bob'),'friendships/alice_bob')));
  await assertFails(getDoc(doc(db('bob'),'publicProfiles/alice')));
});
test('profile schema enforces ownership, image source, bounded XP and stable code', async () => {
  await assertSucceeds(setDoc(doc(db('alice'),'publicProfiles/alice'), profile('alice','ABCDEF')));
  await assertFails(setDoc(doc(db('bob'),'publicProfiles/alice'), profile('alice','ABCDEF')));
  await assertFails(setDoc(doc(db('alice'),'publicProfiles/alice'), { ...profile('alice','ABCDEF'), totalXP:10000001 }));
  await assertFails(setDoc(doc(db('alice'),'publicProfiles/alice'), { ...profile('alice','ABCDEF'), photoURL:'https://evil.example/track' }));
  await assertFails(setDoc(doc(db('alice'),'publicProfiles/alice'), profile('alice','GHJKLM')));
  await assertFails(setDoc(doc(db('alice'),'verifiedScores/alice'), { verified:true,totalXP:99 }));
});
test('one code is reserved atomically with its profile; extra or stolen codes are denied', async () => {
  const store = db('new-user');
  await assertFails(setDoc(doc(store,'friendCodes/UVWXYZ'), { uid:'new-user',createdAt:serverTimestamp() }));
  const b = writeBatch(store);
  b.set(doc(store,'friendCodes/UVWXYZ'), { uid:'new-user',createdAt:serverTimestamp() });
  b.set(doc(store,'publicProfiles/new-user'), profile('new-user','UVWXYZ'));
  await assertSucceeds(b.commit());
  const extra = writeBatch(store);
  extra.set(doc(store,'friendCodes/AAAAAA'), { uid:'new-user',createdAt:serverTimestamp() });
  extra.set(doc(store,'publicProfiles/new-user'), profile('new-user','AAAAAA'));
  await assertFails(extra.commit());
  await assertFails(deleteDoc(doc(store,'publicProfiles/new-user')));
  await assertFails(setDoc(doc(db('alice'),'friendCodes/GHJKLM'), { uid:'alice',createdAt:serverTimestamp() }));
  await assertSucceeds(deleteDoc(doc(store,'friendCodes/UVWXYZ')));
  await assertSucceeds(deleteDoc(doc(store,'publicProfiles/new-user')));
});
test('invitations require an atomic quota and cannot impersonate another sender', async () => {
  const store = db('alice');
  await assertFails(setDoc(doc(store,'friendRequests/alice_stranger'), request('alice','stranger')));
  await assertFails(invitation(store,'bob','stranger').commit());
  await assertSucceeds(invitation(store,'alice','stranger').commit());
  await assertSucceeds(getDoc(doc(db('stranger'),'publicProfiles/alice')));
  await assertFails(getDoc(doc(db('alice'),'publicProfiles/stranger')));
  await assertSucceeds(getDocs(query(collection(db('stranger'),'friendRequests'),where('to','==','stranger'))));
  await assertFails(getDocs(collection(db('bob'),'friendRequests')));
});
test('quota cannot be reset, deleted, reused for several invitations or bypassed by direct writes', async () => {
  const store = db('alice');
  const multi = invitation(store,'alice','stranger');
  multi.set(doc(store,'friendRequests/alice_bob'), request('alice','bob'));
  await assertFails(multi.commit());
  await assertSucceeds(invitation(store,'alice','stranger').commit());
  await assertFails(invitation(store,'alice','bob',2).commit());
  await assertFails(deleteDoc(doc(store,'socialLimits/alice')));
  await assertFails(setDoc(doc(store,'socialLimits/alice'),{ count:1,windowStart:serverTimestamp(),lastInviteAt:serverTimestamp(),lastRequestId:'alice_bob' }));
});
test('rolling daily limit rejects invitation 21 and permits a fresh day', async () => {
  const start = Timestamp.fromMillis(Date.now()-60000);
  await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(),'socialLimits/alice'),{ count:20,windowStart:start,lastInviteAt:start,lastRequestId:'alice_old' }));
  await assertFails(invitation(db('alice'),'alice','stranger',21,start).commit());
  await assertFails(invitation(db('alice'),'alice','stranger',1).commit());
  const yesterday = Timestamp.fromMillis(Date.now()-90000000);
  await env.withSecurityRulesDisabled(c => setDoc(doc(c.firestore(),'socialLimits/alice'),{ count:20,windowStart:yesterday,lastInviteAt:yesterday,lastRequestId:'alice_old' }));
  await assertSucceeds(invitation(db('alice'),'alice','stranger').commit());
});
test('only the receiver may accept a real invitation; outsiders cannot create or remove friendships', async () => {
  await assertSucceeds(invitation(db('alice'),'alice','stranger').commit());
  const value = { members:['alice','stranger'],createdAt:serverTimestamp() };
  await assertFails(setDoc(doc(db('alice'),'friendships/alice_stranger'),value));
  await assertFails(setDoc(doc(db('bob'),'friendships/alice_stranger'),value));
  const receiver = db('stranger');
  const b = writeBatch(receiver);
  b.set(doc(receiver,'friendships/alice_stranger'),value);
  b.delete(doc(receiver,'friendRequests/alice_stranger'));
  await assertSucceeds(b.commit());
  await assertFails(deleteDoc(doc(db('bob'),'friendships/alice_stranger')));
  await assertSucceeds(getDoc(doc(db('stranger'),'publicProfiles/alice')));
});
