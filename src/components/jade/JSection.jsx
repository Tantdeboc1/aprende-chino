import { J } from '@/styles/tokens';

export default function JSection({ label, cn, right }) {
  return (
    <div
      className="flex items-baseline justify-between"
      style={{ marginTop: 22, marginBottom: 12 }}
    >
      <div className="flex items-baseline gap-2.5">
        <span style={{ fontSize: '1rem', fontWeight: 700, color: J.ink, letterSpacing: '-0.01em' }}>
          {label}
        </span>
        {cn && (
          <span
            className="font-cn-serif"
            style={{ fontSize: '0.875rem', color: J.mute, fontWeight: 400 }}
          >
            {cn}
          </span>
        )}
      </div>
      {right}
    </div>
  );
}
