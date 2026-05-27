import { J } from '@/styles/tokens';

export default function JSeal({ char, size = 24, rotate = -5, bg = J.red, fg = J.paperHi }) {
  return (
    <div
      className="font-cn-serif inline-flex items-center justify-center flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: size * 0.52,
        fontWeight: 700,
        transform: `rotate(${rotate}deg)`,
        borderRadius: 2,
        boxShadow: bg === J.red
          ? '0 1px 0 rgba(139,31,26,0.4)'
          : '0 1px 0 rgba(0,0,0,0.15)',
      }}
    >
      {char}
    </div>
  );
}
