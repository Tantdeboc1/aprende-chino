import { J } from '@/styles/tokens';

const TABS = [
  { id: 'home',    cn: '首页', label: 'Hoy' },
  { id: 'learn',   cn: '课程', label: 'Lecciones' },
  { id: 'dict',    cn: '字典', label: 'Dicc.' },
  { id: 'profile', cn: '个人', label: 'Tu' },
];

export default function JNav({ active = 'home', onNav = () => {} }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-4 gap-1.5"
      style={{
        padding: '10px 16px 18px',
        background: J.paper,
        borderTop: `1px solid ${J.hair}`,
      }}
    >
      {TABS.map(tab => {
        const on = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onNav(tab.id)}
            className="flex flex-col items-center gap-0.5"
            style={{
              background: on ? J.ink : 'transparent',
              color: on ? J.paperHi : J.inkSoft,
              border: 0,
              borderRadius: 18,
              padding: '10px 6px',
              cursor: 'pointer',
            }}
          >
            <span
              className="font-cn"
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: on ? J.red : J.ink,
                lineHeight: 1,
              }}
            >
              {tab.cn}
            </span>
            <span
              style={{
                fontSize: 10.5,
                fontWeight: on ? 700 : 500,
                letterSpacing: '0.2em',
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
