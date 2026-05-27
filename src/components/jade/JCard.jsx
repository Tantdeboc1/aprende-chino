import { J } from '@/styles/tokens';

export default function JCard({ children, style = {}, onClick, padding = '16px 18px' }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: J.paperHi,
        border: `1px solid ${J.hair}`,
        borderRadius: 18,
        padding,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
