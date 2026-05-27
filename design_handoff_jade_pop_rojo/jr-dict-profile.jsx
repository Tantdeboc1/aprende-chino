// jr-dict-profile.jsx — Diccionario + Perfil

// ── DICCIONARIO ───────────────────────────────────────────────
const JRDict = ({ go = () => {} }) => {
  const [filter, setFilter] = React.useState('Todos');
  const filters = ['Todos', 'HSK 1', 'HSK 2', 'Radicales', 'Guardados'];

  const recent = [
    { c: '听', p: 'tīng',  t: 1, m: 'escuchar' },
    { c: '说', p: 'shuō',  t: 1, m: 'hablar' },
    { c: '读', p: 'dú',    t: 2, m: 'leer' },
    { c: '写', p: 'xiě',   t: 3, m: 'escribir' },
  ];
  const saved = [
    { c: '你好', p: 'nǐ hǎo',  m: 'hola' },
    { c: '谢谢', p: 'xièxiè',  m: 'gracias' },
    { c: '再见', p: 'zàijiàn', m: 'adiós' },
  ];

  return (
    <JFrame>
      <JTopBar left={<JMark/>} right={<JStreak n={4} label="días"/>}/>

      <JScroll>
        <div style={{ marginTop: 8, marginBottom: 14 }}>
          <h1 style={{
            margin: 0, fontWeight: 700, fontSize: 28, lineHeight: 1.1,
            letterSpacing: '-0.025em', color: J.ink,
          }}>
            Diccionario<span style={{ color: J.red }}>.</span>
          </h1>
        </div>

        {/* Search bar */}
        <div style={{
          padding: '14px 18px',
          background: J.paperHi, border: `1px solid ${J.hair}`, borderRadius: 18,
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14,
        }}>
          <span style={{ fontFamily: J.cnSans, fontSize: 22, color: J.jade,
                          fontWeight: 700, lineHeight: 1 }}>找</span>
          <div style={{ flex: 1, fontSize: 14, color: J.mute, fontWeight: 500 }}>
            Buscar carácter, pinyin o significado…
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 22, overflowX: 'auto',
                       paddingBottom: 4 }}>
          {filters.map(f => {
            const on = filter === f;
            return (
              <button key={f} onClick={() => setFilter(f)} style={{
                background: on ? J.ink : J.paperHi, color: on ? J.paperHi : J.inkSoft,
                border: `1px solid ${on ? J.ink : J.hair}`,
                padding: '7px 14px', borderRadius: 99, cursor: 'pointer',
                fontSize: 12.5, fontWeight: 700, fontFamily: J.sans,
                flexShrink: 0, letterSpacing: '-0.005em',
              }}>{f}</button>
            );
          })}
        </div>

        <JSection label="Recientes" cn="最近"/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recent.map(r => (
            <JCard key={r.c} padding="14px 16px">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 14,
                  background: J.jadeBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: J.cnSans, fontSize: 32, fontWeight: 700,
                  color: J.jadeDeep, flexShrink: 0,
                }}>{r.c}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                    <span style={{ fontSize: 17, fontWeight: 800, color: J.jade,
                                    letterSpacing: '-0.01em' }}>{r.p}</span>
                    <JChip bg={J.sandBg} fg={J.sandDeep} style={{ fontSize: 10.5,
                            padding: '3px 9px' }}>
                      tono {r.t}
                    </JChip>
                  </div>
                  <div style={{ fontSize: 14, color: J.ink, marginTop: 4, fontWeight: 500 }}>
                    {r.m}
                  </div>
                </div>
                <span style={{ fontSize: 14, color: J.mute, fontWeight: 700 }}>→</span>
              </div>
            </JCard>
          ))}
        </div>

        <JSection label="Guardados" cn="收藏" right={
          <JChip bg={J.redBg} fg={J.redDeep}>{saved.length}</JChip>
        }/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {saved.map(s => (
            <JCard key={s.c} padding="12px 14px">
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{
                  fontFamily: J.cnSans, fontSize: 26, fontWeight: 700,
                  color: J.ink, lineHeight: 1, minWidth: 78,
                }}>{s.c}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: J.jade,
                                  letterSpacing: '-0.01em' }}>{s.p}</div>
                  <div style={{ fontSize: 12.5, color: J.inkSoft, marginTop: 2,
                                  fontWeight: 500 }}>{s.m}</div>
                </div>
                <JSeal char="收" size={20} rotate={-4} bg={J.red}/>
              </div>
            </JCard>
          ))}
        </div>

        <div style={{ height: 8 }}/>
      </JScroll>

      <JNav active="dict" onNav={go}/>
    </JFrame>
  );
};

// ── PERFIL ────────────────────────────────────────────────────
const JRProfile = ({ go = () => {} }) => {
  // 30-day pattern: more recent days denser
  const days = Array.from({ length: 30 }).map((_, i) => {
    if (i >= 26) return 'on';
    if (i >= 20) return 'mid';
    if (i % 3 === 0) return 'on';
    if (i % 5 === 0) return 'mid';
    return 'off';
  });

  return (
    <JFrame>
      <JTopBar
        left={<JMark/>}
        right={<button style={{ background: 'transparent', border: 0, fontSize: 13,
                                 color: J.inkSoft, fontWeight: 600, cursor: 'pointer',
                                 fontFamily: J.sans }}>Ajustes</button>}
      />

      <JScroll>
        {/* Name */}
        <div style={{ marginTop: 8, marginBottom: 18 }}>
          <h1 style={{
            margin: 0, fontWeight: 700, fontSize: 28, lineHeight: 1.1,
            letterSpacing: '-0.025em', color: J.ink,
          }}>
            Jesús<span style={{ color: J.red }}>.</span>
          </h1>
          <div style={{ marginTop: 6, fontSize: 13.5, color: J.inkSoft, fontWeight: 500 }}>
            Aprendiendo chino desde hace <b style={{ color: J.jade }}>18 días</b>.
          </div>
        </div>

        {/* Streak hero */}
        <div style={{
          background: J.red, color: J.paperHi, borderRadius: 22,
          padding: '20px 22px 18px', position: 'relative', overflow: 'hidden',
          marginBottom: 18,
          boxShadow: '0 8px 24px rgba(200,57,47,0.30)',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140,
                          borderRadius: '50%', background: J.redDeep, opacity: 0.5 }}/>

          <div style={{ position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between',
                            alignItems: 'flex-start' }}>
              <div>
                <JLabel color={J.butter}>Racha actual · 连续</JLabel>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
                  <span style={{ fontSize: 64, fontWeight: 800, color: J.butter,
                                  letterSpacing: '-0.04em', lineHeight: 0.9 }}>4</span>
                  <span style={{ fontSize: 14, fontWeight: 700,
                                  color: 'rgba(255,255,255,0.85)' }}>días</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{
                  fontSize: 10.5, letterSpacing: '0.16em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)', fontWeight: 700,
                }}>Récord</span>
                <div style={{ fontSize: 24, fontWeight: 800, color: J.paperHi,
                                marginTop: 6, letterSpacing: '-0.02em' }}>12</div>
              </div>
            </div>

            {/* 30-day grid */}
            <div style={{ marginTop: 18,
                            display: 'grid', gridTemplateColumns: 'repeat(15, 1fr)', gap: 4 }}>
              {days.map((d, i) => (
                <div key={i} style={{
                  aspectRatio: '1 / 1', borderRadius: 4,
                  background: d === 'on'  ? J.butter
                            : d === 'mid' ? 'rgba(240,200,98,0.45)'
                            : 'rgba(255,255,255,0.12)',
                }}/>
              ))}
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: 'rgba(255,255,255,0.65)',
                            fontWeight: 600, letterSpacing: '0.04em' }}>
              Últimos 30 días
            </div>
          </div>
        </div>

        {/* Progreso */}
        <JSection label="Progreso" cn="进步"/>
        <JCard padding="0">
          <JRProfileRow l="Caracteres aprendidos"  v="127"     tag="HSK 1" first/>
          <JRProfileRow l="Estudio acumulado"      v="3h 42m"  tag="ritmo medio"/>
          <JRProfileRow l="Precisión media"        v="89%"     tag="bien" accent="jade"/>
          <JRProfileRow l="Caracteres dominados"   v="42"      tag="récord" accent="red" last/>
        </JCard>

        {/* Ajustes */}
        <JSection label="Ajustes" cn="设置"/>
        <JCard padding="0">
          <JRProfileRow l="Recordatorio diario"  v="20:00"           first/>
          <JRProfileRow l="Mostrar pinyin"       v="Siempre"/>
          <JRProfileRow l="Caracteres"           v="Simplificados"/>
          <JRProfileRow l="Sonido"               v="Activado"/>
          <JRProfileRow l="Tema"                 v="Jade · Cinabrio" last/>
        </JCard>

        <div style={{ height: 16 }}/>
      </JScroll>

      <JNav active="profile" onNav={go}/>
    </JFrame>
  );
};

const JRProfileRow = ({ l, v, tag, accent, first, last }) => (
  <div style={{
    display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
    padding: '14px 18px',
    borderTop: first ? 0 : `1px solid ${J.hair}`,
    gap: 12,
  }}>
    <span style={{ fontSize: 14, color: J.ink, fontWeight: 500 }}>{l}</span>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      {tag && (
        <span style={{ fontSize: 11, color: J.mute, fontWeight: 600,
                        letterSpacing: '0.02em' }}>{tag}</span>
      )}
      <span style={{
        fontSize: 14, fontWeight: 800,
        letterSpacing: '-0.01em',
        color: accent === 'red' ? J.red
             : accent === 'jade' ? J.jade
             : J.ink,
      }}>{v}</span>
    </div>
  </div>
);

Object.assign(window, { JRDict, JRProfile });
