const destinations = new Set(['home', 'lesson-detail', 'intro-detail', 'profile', 'minigames', 'dictionary', 'review']);
export function exerciseReturnScreen(origin) {
  return destinations.has(origin) ? origin : 'home';
}
