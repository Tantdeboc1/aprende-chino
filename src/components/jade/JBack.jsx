import { J } from '@/styles/tokens';

export default function JBack({ onClick, label = 'Cerrar' }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: J.paperHi,
        border: 0,
        borderRadius: 14,
        padding: '6px 12px',
        fontSize: 13,
        color: J.inkSoft,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      ← {label}
    </button>
  );
}
