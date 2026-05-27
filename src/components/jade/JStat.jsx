import { J } from '@/styles/tokens';

export default function JStat({ n, l, color }) {
  return (
    <div
      style={{
        background: J.paperHi,
        border: `1px solid ${J.hair}`,
        borderRadius: 14,
        padding: 12,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, color: color || J.ink, letterSpacing: '-0.02em' }}>
        {n}
      </div>
      <div style={{ fontSize: 11, color: J.mute, marginTop: 4, fontWeight: 600, letterSpacing: '0.04em' }}>
        {l}
      </div>
    </div>
  );
}
