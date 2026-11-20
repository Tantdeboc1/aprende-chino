const base = 'min-h-11 rounded-xl px-4 py-3 font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--jade)]';

export function PracticeCard({ title, children }) {
  return <section className="rounded-xl border border-[var(--hair)] bg-[var(--paper-hi)] p-4 space-y-3 text-[var(--ink)]">
    <h3 className="font-bold">{title}</h3>
    {children}
  </section>;
}

export function PracticeOption({ state = 'idle', dark = false, className = '', children, ...props }) {
  const colors = {
    idle: dark ? 'border-white/20 bg-white/5 text-white hover:bg-white/15' : 'border-[var(--hair)] bg-[var(--paper-hi2)] text-[var(--ink)] hover:bg-[var(--mute2)]',
    correct: 'border-[var(--jade)] bg-[var(--jade)] text-[var(--on-accent)]',
    incorrect: 'border-[var(--red)] bg-[var(--red)] text-[var(--on-accent)]',
    muted: dark ? 'border-white/10 bg-white/5 text-white/60' : 'border-[var(--hair)] bg-[var(--paper-hi2)] text-[var(--ink-soft)]',
  };
  return <button type="button" {...props} className={`${base} border ${colors[state]} ${className}`}>
    {children}{state === 'correct' ? ' ✓' : state === 'incorrect' ? ' ✗' : ''}
  </button>;
}

export function PracticeNext({ children, className = '', ...props }) {
  return <button type="button" {...props} className={`${base} w-full bg-[var(--jade)] text-[var(--on-accent)] hover:bg-[var(--jade-deep)] ${className}`}>{children}</button>;
}

export function PracticeProgress({ question, total, completed }) {
  return <div className="space-y-1 text-xs text-[var(--ink-soft)]">
    <div aria-live="polite">{question}/{total}</div>
    <div className="h-1.5 rounded-full bg-[var(--hair)] overflow-hidden" aria-hidden="true">
      <div className="h-full rounded-full bg-[var(--jade)] transition-[width]" style={{ width: `${total ? completed / total * 100 : 0}%` }} />
    </div>
  </div>;
}

export function PracticeFeedback({ correct, children }) {
  return <div role="status" aria-live="polite">
    {correct !== null && <div className={`rounded-xl border p-3 text-sm text-[var(--ink)] ${correct ? 'border-[var(--jade)] bg-[var(--jade-bg)]' : 'border-[var(--red)] bg-[var(--red-bg)]'}`}>{children}</div>}
  </div>;
}
