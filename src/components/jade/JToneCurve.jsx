import { J } from '@/styles/tokens';

const PATHS = {
  1: 'M 4 12 L 36 12',
  2: 'M 4 22 L 36 6',
  3: 'M 4 10 Q 20 28 36 10',
  4: 'M 4 6 L 36 22',
};

export default function JToneCurve({ tone, size = 40, color = J.ink, sw = 2.5 }) {
  return (
    <svg
      width={size}
      height={size * 0.7}
      viewBox="0 0 40 28"
      fill="none"
      stroke={color}
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={PATHS[tone]} />
    </svg>
  );
}
