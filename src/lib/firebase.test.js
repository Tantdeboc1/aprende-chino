import { afterEach, beforeEach, expect, it, vi } from 'vitest';

const sdk = vi.hoisted(() => ({ initialize: vi.fn(() => ({})), provider: vi.fn() }));
vi.mock('firebase/app', () => ({ initializeApp: () => ({}) }));
vi.mock('firebase/auth', () => ({ getAuth: () => ({}), GoogleAuthProvider: class {} }));
vi.mock('firebase/app-check', () => ({
  initializeAppCheck: sdk.initialize,
  ReCaptchaEnterpriseProvider: class { constructor(key) { sdk.provider(key); } },
}));

beforeEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
  vi.stubEnv('DEV', false);
  vi.stubEnv('VITE_RECAPTCHA_SITE_KEY', undefined);
  delete self.FIREBASE_APPCHECK_DEBUG_TOKEN;
});
afterEach(() => { vi.unstubAllEnvs(); delete self.FIREBASE_APPCHECK_DEBUG_TOKEN; });

it('uses the registered public key and Enterprise provider without a production debug token', async () => {
  const firebase = await import('./firebase.js');
  await firebase.appCheckReady;
  expect(sdk.provider).toHaveBeenCalledWith('6LfqaWQtAAAAAEHHy0qLC4HTlLTzYt4IF7LXLcTT');
  expect(sdk.initialize).toHaveBeenCalledWith(firebase.firebaseApp, expect.objectContaining({ isTokenAutoRefreshEnabled: true }));
  expect(self.FIREBASE_APPCHECK_DEBUG_TOKEN).toBeUndefined();
});

it('allows an explicit empty development key to disable initialization', async () => {
  vi.stubEnv('DEV', true);
  vi.stubEnv('VITE_RECAPTCHA_SITE_KEY', '');
  const firebase = await import('./firebase.js');
  expect(await firebase.appCheckReady).toBeNull();
  expect(sdk.initialize).not.toHaveBeenCalled();
});
