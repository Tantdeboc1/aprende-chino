import { J } from '@/styles/tokens';

export default function JMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="font-cn flex items-center justify-center"
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: J.jade,
          color: J.butter,
          fontSize: 18,
          fontWeight: 700,
        }}
      >
        学
      </div>
      <span style={{ fontWeight: 600, fontSize: 15, letterSpacing: '-0.01em', color: J.ink }}>
        Aprende Chino
      </span>
    </div>
  );
}
