import { J } from '@/styles/tokens';

export default function JCard({ children, style = {}, onClick, padding = '16px 18px' }) {
  return (
    <div
      onClick={onClick}
      className={onClick ? 'j-press-card' : undefined}
      style={{
        background: J.paperHi,
        border: `1px solid ${J.hair}`,
        borderRadius: 18,
        // Sombra en capas (token, sensible al tema) — da profundidad cálida
        // y consistente a todas las tarjetas. Pulido cohesivo.
        boxShadow: J.shadowSm,
        padding,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
