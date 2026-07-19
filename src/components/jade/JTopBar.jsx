export default function JTopBar({ left, right, sub }) {
  return (
    <div
      className="flex items-center justify-between gap-2"
      style={{ padding: '14px 20px 8px' }}
    >
      <div className="flex items-center gap-2.5 min-w-0">{left}</div>
      {sub && (
        <div
          className="flex-1 text-center"
          style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5b5446', letterSpacing: '0.04em' }}
        >
          {sub}
        </div>
      )}
      <div className="flex items-center gap-2.5">{right}</div>
    </div>
  );
}
