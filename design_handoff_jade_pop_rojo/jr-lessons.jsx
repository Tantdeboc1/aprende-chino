// jr-lessons.jsx — Lecciones lista + detalle de lección

// ── LIST ──────────────────────────────────────────────────────
const JRLessons = ({ go = () => {} }) => {
  const lessons = [
    { n: '01', t: '¿Cómo has estado últimamente?', tag: 'Saludos',   pct: 58, chars: 24, state: 'progress' },
    { n: '02', t: 'Mi familia y yo',                tag: 'Familia',   pct: 11, chars: 18, state: 'progress' },
    { n: '03', t: '¿Cuánto cuesta?',                tag: 'Números',   pct: 0,  chars: 22, state: 'open' },
    { n: '04', t: 'En el restaurante',              tag: 'Comida',    pct: 0,  chars: 28, state: 'locked' },
    { n: '05', t: 'Direcciones y lugares',          tag: 'Ciudad',    pct: 0,  chars: 26, state: 'locked' },
    { n: '06', t: 'Tiempo y clima',                 tag: 'Cotidiano', pct: 0,  chars: 20, state: 'locked' },
  ];
  return (
    <JFrame>
      <JTopBar
        left={<JMark/>}
        right={<JStreak n={4} label="días"/>}
      />

      <JScroll>
        <div style={{ marginTop: 8, marginBottom: 14 }}>
          <h1 style={{
            margin: 0, fontWeight: 700, fontSize: 28, lineHeight: 1.1,
            letterSpacing: '-0.025em', color: J.ink,
          }}>
            Lecciones<span style={{ color: J.red }}>.</span>
          </h1>
          <div style={{ marginTop: 6, fontSize: 13.5, color: J.inkSoft, fontWeight: 500 }}>
            HSK 1 · <b style={{ color: J.jade }}>dos en curso</b>, diez por delante.
          </div>
        </div>

        {/* Fundamentos — full-width pill card, sand bg */}
        <button onClick={() => go('lesson')} style={{
          width: '100%', background: J.sandBg, color: J.sandDeep,
          border: 0, borderRadius: 18, padding: '16px 18px', textAlign: 'left',
          cursor: 'pointer', fontFamily: J.sans,
          display: 'flex', alignItems: 'center', gap: 14, marginBottom: 18,
        }}>
          <JSeal char="基" size={36} rotate={-4} bg={J.sand}/>
          <div style={{ flex: 1 }}>
            <JLabel color={J.sandDeep}>Fundamentos · 基础</JLabel>
            <div style={{ fontSize: 15, fontWeight: 700, color: J.ink,
                          letterSpacing: '-0.01em', marginTop: 2 }}>
              Radicales, tonos y pinyin
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 700 }}>00 →</span>
        </button>

        <JSection label="HSK 1" cn="课程"/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lessons.map(l => (
            <JRLessonRow key={l.n} {...l} onClick={() => go('lesson')}/>
          ))}
        </div>

        <div style={{ marginTop: 22, fontSize: 12, color: J.mute,
                       textAlign: 'center', fontWeight: 500 }}>
          Las bloqueadas se abrirán al completar las anteriores.
        </div>
        <div style={{ height: 8 }}/>
      </JScroll>

      <JNav active="learn" onNav={go}/>
    </JFrame>
  );
};

const JRLessonRow = ({ n, t, tag, pct, chars, state, onClick }) => {
  const locked = state === 'locked';
  const active = state === 'progress';
  return (
    <button onClick={locked ? undefined : onClick} style={{
      width: '100%', background: J.paperHi,
      border: `1px solid ${J.hair}`, borderRadius: 16,
      padding: '14px 16px', textAlign: 'left',
      cursor: locked ? 'default' : 'pointer',
      opacity: locked ? 0.55 : 1, fontFamily: J.sans,
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: active ? J.red : (locked ? J.hair : J.jadeBg),
        color: active ? J.paperHi : (locked ? J.mute : J.jadeDeep),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 17, fontWeight: 800, letterSpacing: '-0.02em',
        boxShadow: active ? '0 1px 0 rgba(139,31,26,0.4)' : 'none',
        flexShrink: 0,
      }}>{n}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14.5, fontWeight: 700, color: J.ink,
                       letterSpacing: '-0.01em', overflow: 'hidden',
                       textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'baseline',
                       fontSize: 11.5, color: J.mute, fontWeight: 600 }}>
          <span>{tag}</span>
          <span style={{ color: J.mute2 }}>·</span>
          <span>{chars} caracteres</span>
          {active && (
            <>
              <span style={{ color: J.mute2 }}>·</span>
              <span style={{ color: J.jade, fontWeight: 700 }}>{pct}%</span>
            </>
          )}
          {locked && (
            <>
              <span style={{ color: J.mute2 }}>·</span>
              <span>bloqueada</span>
            </>
          )}
        </div>
        {active && (
          <div style={{ marginTop: 8, height: 4, background: J.hair,
                         borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%',
                           background: `linear-gradient(90deg, ${J.jade}, ${J.red})`,
                           borderRadius: 99 }}/>
          </div>
        )}
      </div>
    </button>
  );
};

// ── LESSON DETAIL ────────────────────────────────────────────
const JRLessonDetail = ({ go = () => {} }) => {
  const characters = [
    { c: '你', p: 'nǐ',    m: 'tú',         done: true },
    { c: '好', p: 'hǎo',   m: 'bueno',      done: true },
    { c: '吗', p: 'ma',    m: 'partícula',  done: true },
    { c: '最', p: 'zuì',   m: 'el más',     done: true },
    { c: '近', p: 'jìn',   m: 'cerca',      done: false, next: true },
    { c: '怎', p: 'zěn',   m: 'cómo',       done: false },
    { c: '么', p: 'me',    m: 'partícula',  done: false },
    { c: '样', p: 'yàng',  m: 'forma',      done: false },
    { c: '很', p: 'hěn',   m: 'muy',        done: false },
    { c: '不', p: 'bù',    m: 'no',         done: false },
    { c: '太', p: 'tài',   m: 'demasiado',  done: false },
  ];
  const done = characters.filter(c => c.done).length;
  const total = 24;
  const pct = Math.round((14 / 24) * 100);

  return (
    <JFrame>
      <JTopBar
        left={<JBack onClick={() => go('learn')} label="Lecciones"/>}
        right={<JStreak n={4} label="días"/>}
      />

      <JScroll>
        {/* Hero */}
        <JCard padding="22px 22px 20px" style={{
          background: J.jade, color: J.paperHi, border: `1px solid ${J.jadeDeep}`,
          marginTop: 6, position: 'relative', overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(31,74,51,0.20)',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120,
                         borderRadius: '50%', background: J.jadeDeep, opacity: 0.5 }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6 }}>
              <span style={{ fontSize: 11, letterSpacing: '0.14em',
                              textTransform: 'uppercase',
                              color: J.butter, fontWeight: 700 }}>HSK 1 · Lección</span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)',
                              fontWeight: 600 }}>14 / 24</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 44, fontWeight: 800, color: J.butter,
                              letterSpacing: '-0.03em', lineHeight: 1 }}>01</span>
              <span style={{ fontFamily: J.cnSans, fontSize: 28, fontWeight: 700,
                              color: J.paperHi, lineHeight: 1 }}>课</span>
            </div>
            <h1 style={{
              margin: '8px 0 0', fontSize: 22, fontWeight: 700, lineHeight: 1.2,
              letterSpacing: '-0.015em', color: J.paperHi,
            }}>
              ¿Cómo has estado<br/>últimamente?
            </h1>
            <div style={{ marginTop: 6, fontSize: 13, color: 'rgba(255,255,255,0.78)' }}>
              Saludos y respuestas básicas con 很 / 不太.
            </div>

            <div style={{ marginTop: 16, height: 8, borderRadius: 99,
                            background: 'rgba(0,0,0,0.25)', overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%',
                              background: `linear-gradient(90deg, ${J.butter}, ${J.red})`,
                              borderRadius: 99 }}/>
            </div>
            <div style={{ marginTop: 6, display: 'flex', justifyContent: 'space-between',
                            fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.8)' }}>
              <span>{pct}% completado</span>
              <span>10 caracteres por aprender</span>
            </div>
          </div>
        </JCard>

        {/* Continuar — primary CTA */}
        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <JBtn kind="jade" full onClick={() => go('flashcard')}>
            Continuar lección
          </JBtn>
        </div>

        {/* Caracteres */}
        <JSection label="Caracteres" cn="字" right={
          <JChip bg={J.redBg} fg={J.redDeep}>{done} de {total}</JChip>
        }/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {characters.map(c => (
            <JRCharTile key={c.c} {...c} onClick={() => go('flashcard')}/>
          ))}
        </div>

        {/* Grammar nibble */}
        <JSection label="Gramática" cn="语法"/>
        <JCard padding="14px 16px">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <JSeal char="语" size={32} rotate={-4} bg={J.jade}/>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: J.ink,
                              letterSpacing: '-0.01em' }}>
                Adverbios de grado: <span className="cnSerif"
                  style={{ fontFamily: J.cnSerif, color: J.jade }}>很 / 不太</span>
              </div>
              <div style={{ fontSize: 12, color: J.inkSoft, marginTop: 2, fontWeight: 500 }}>
                Cómo intensificar o suavizar respuestas.
              </div>
            </div>
            <span style={{ fontSize: 13, color: J.mute, fontWeight: 700 }}>→</span>
          </div>
        </JCard>
        <div style={{ height: 18 }}/>
      </JScroll>
    </JFrame>
  );
};

const JRCharTile = ({ c, p, m, done, next, onClick }) => (
  <button onClick={onClick} style={{
    background: done ? J.jadeBg : (next ? J.redBg : J.paperHi),
    border: `1px solid ${done ? 'transparent' : (next ? 'rgba(200,57,47,0.25)' : J.hair)}`,
    borderRadius: 14, padding: '10px 8px 8px',
    cursor: 'pointer', fontFamily: J.sans,
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
    position: 'relative',
  }}>
    <span style={{
      fontFamily: J.cnSans, fontSize: 28, fontWeight: 700, lineHeight: 1,
      color: done ? J.jadeDeep : (next ? J.redDeep : J.ink),
    }}>{c}</span>
    <span style={{ fontSize: 10.5, color: done ? J.jadeDeep : (next ? J.redDeep : J.mute),
                    fontWeight: 700, marginTop: 2 }}>{p}</span>
    {done && (
      <span style={{ position: 'absolute', top: 4, right: 6,
                      width: 12, height: 12, borderRadius: '50%',
                      background: J.jade,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: J.paperHi, fontSize: 8, fontWeight: 900 }}>✓</span>
    )}
    {next && (
      <span style={{ position: 'absolute', top: 4, right: 6,
                      fontFamily: J.cnSerif, fontSize: 10, color: J.red,
                      fontWeight: 700, background: J.paperHi, padding: '1px 5px',
                      borderRadius: 99 }}>hoy</span>
    )}
  </button>
);

Object.assign(window, { JRLessons, JRLessonDetail });
