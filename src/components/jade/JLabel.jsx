import { J } from '@/styles/tokens';

export default function JLabel({ children, color = J.mute, size = 11 }) {
  return (
    <span
      style={{
        fontSize: size,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color,
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  );
}
