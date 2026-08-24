// Moderación ligera de nombres visibles. No pretende sustituir una
// moderación de servidor, pero evita insultos comunes y sus variantes más
// sencillas (espacios, tildes, mayúsculas y algunos cambios leet).

const FORBIDDEN_NAME_PARTS = [
  'putamadre', 'puta', 'puto', 'mierda', 'mierd', 'joder', 'coño',
  'cabron', 'gilipollas', 'zorra', 'maricon', 'subnormal',
  'fuck', 'shit', 'bitch', 'cunt', 'dickhead', 'asshole', 'whore',
  '傻逼', '傻屄', '操你', '妈的', '他妈',
];

function compactName(value) {
  return String(value ?? '')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[01345789]/g, (char) => ({ 0: 'o', 1: 'i', 3: 'e', 4: 'a', 5: 's', 7: 't', 8: 'b', 9: 'g' })[char])
    .replace(/[^a-z0-9\u3400-\u9fff]+/g, '');
}

export function isNameAllowed(value) {
  const compact = compactName(value);
  return !!compact && !FORBIDDEN_NAME_PARTS.some((part) => compact.includes(part));
}

export function sanitizeUserName(value, fallback = 'Estudiante') {
  const trimmed = String(value ?? '').trim().slice(0, 100);
  return isNameAllowed(trimmed) ? trimmed : fallback;
}

export function getNameModerationKey(value) {
  return isNameAllowed(value) ? null : 'name_not_allowed';
}
