import { J } from '@/styles/tokens';

const STYLES = {
  primary: { bg: J.ink, fg: J.paperHi, shadow: '0 4px 12px -4px rgba(28,24,19,0.4)' },
  jade:    { bg: J.jade, fg: J.paperHi, shadow: '0 4px 12px -4px rgba(31,74,51,0.4)' },
  red:     { bg: J.red, fg: J.paperHi, shadow: '0 4px 12px -4px rgba(200,57,47,0.5)' },
  ghost:   { bg: J.paperHi, fg: J.ink, shadow: 'none', border: `1px solid ${J.hair}` },
  butter:  { bg: J.butter, fg: J.jadeDeep, shadow: 'none' },
};

export default function JBtn({ children, kind = 'primary', onClick, full, style = {}, disabled }) {
  const s = STYLES[kind] || STYLES.primary;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center justify-center gap-2"
      style={{
        background: s.bg,
        color: s.fg,
        border: s.border || 0,
        cursor: disabled ? 'default' : 'pointer',
        padding: '14px 22px',
        borderRadius: 99,
        fontSize: 15,
        fontWeight: 700,
        letterSpacing: '-0.005em',
        boxShadow: s.shadow,
        width: full ? '100%' : 'auto',
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}
