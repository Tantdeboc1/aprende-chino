import { ArrowLeft } from 'lucide-react';
import { J } from '@/styles/tokens';

export default function FundamentalsMenu({ backLabel, onBack, title, pinyin, subtitle, items, children }) {
  return <main className="min-h-screen pb-24" style={{ background: J.paper }}>
    <div className="mx-auto max-w-3xl px-5 pt-5">
      <button onClick={onBack} className="mb-5 flex items-center gap-2 text-sm font-semibold" style={{ color: J.inkSoft, background: J.paperHi, borderRadius: 14, padding: '8px 12px' }}>
        <ArrowLeft size={17} /> {backLabel}
      </button>
      <div className="mb-6 rounded-[22px] p-5" style={{ background: J.jade, color: J.onAccent }}>
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: J.butter }}>入门 · 基础</p>
        <h1 className="mt-2 text-[1.75rem] font-bold leading-tight">{title}<span style={{ color: J.butter }}>.</span></h1>
        <p className="mt-1 text-sm opacity-90">{pinyin} · {subtitle}</p>
      </div>
      <div className="space-y-2.5">
        {items.map(({ key, cn, label, description, onClick, bg = J.sandBg, fg = J.sandDeep }) => <button key={key} onClick={onClick} className="flex w-full items-center gap-3.5 text-left" style={{ background: J.paperHi, border: `1px solid ${J.hair}`, borderRadius: 18, padding: '14px 16px' }}>
          <span className="flex h-11 w-11 shrink-0 items-center justify-center font-cn text-xl font-bold" style={{ background: bg, color: fg, borderRadius: 12 }}>{cn}</span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-bold" style={{ color: J.ink }}>{label}</span><span className="mt-0.5 block text-xs" style={{ color: J.inkSoft }}>{description}</span></span>
          <span className="font-bold" style={{ color: J.mute }}>→</span>
        </button>)}
      </div>
      {children}
    </div>
  </main>;
}
