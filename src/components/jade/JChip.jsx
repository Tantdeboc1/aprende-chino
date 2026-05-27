import { J } from '@/styles/tokens';

export default function JChip({ children, bg = J.jadeBg, fg = J.jadeDeep, style = {} }) {
  return (
    <span
      className="inline-flex items-center gap-1.5"
      style={{
        padding: '5px 11px',
        borderRadius: 99,
        background: bg,
        color: fg,
        fontSize: 11.5,
        fontWeight: 600,
        ...style,
      }}
    >
      {children}
    </span>
  );
}
