// jr-practice.jsx — Tonos, Trazos, Traducir

// ── TONOS ─────────────────────────────────────────────────────
const JRTones = ({ go = () => {} }) => {
  const [selected, setSelected] = React.useState(null);
  const correct = 1;

  const tones = [
    { t: 1, n: 'Alto plano',    desc: 'Como una nota sostenida.', mark: 'ā' },
    { t: 2, n: 'Ascendente',    desc: 'Como una pregunta.',       mark: 'á' },
    { t: 3, n: 'Caída y sube',  desc: 'Inflexión profunda.',      mark: 'ǎ' },
    { t: 4, n: 'Descendente',   desc: 'Firme, hacia abajo.',      mark: 'à' },
  ];

  return (
    <JFrame>
      <JTopBar
        left={<JBack onClick={() => go('home')}/>}
        sub="Tonos · 4 / 12"
        right={<button style={{ background: 'transparent', border: 0, fontSize: 13,
                                  color: J.mute, fontWeight: 600, cursor: 'pointer',
                                  fontFamily: J.sans }}>Saltar</button>}
      />

      <div style={{ padding: '0 20px' }}>
        <div style={{ height: 8, borderRadius: 99, background: J.hair, overflow: 'hidden' }}>
          <div style={{ width: '33%', height: '100%',
                           background: `linear-gradient(90deg, ${J.jade}, ${J.red})`,
                           borderRadius: 99 }}/>
        </div>
      </div>

      <JScroll pad="22px 20px 22px">
        <div style={{ marginBottom: 6 }}>
          <JLabel>Escucha y elige</JLabel>
        </div>
        <h2 style={{
          margin: 0, fontWeight: 700, fontSize: 24, lineHeight: 1.2,
          letterSpacing: '-0.02em', color: J.ink,
        }}>
          ¿Qué tono escuchas?
        </h2>

        {/* Audio target — big play card */}
        <button style={{
          width: '100%', marginTop: 22, padding: '24px 20px',
          background: J.jade, color: J.paperHi,
          border: `1px solid ${J.jadeDeep}`, borderRadius: 22,
          cursor: 'pointer', fontFamily: J.sans,
          display: 'flex', alignItems: 'center', gap: 16,
          boxShadow: '0 8px 24px rgba(31,74,51,0.20)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, right: -20, width: 120, height: 120,
                          borderRadius: '50%', background: J.jadeDeep, opacity: 0.5 }}/>
          <div style={{ position: 'relative',
                          width: 56, height: 56, borderRadius: '50%',
                          background: J.butter, color: J.jadeDeep,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 22, fontWeight: 900, paddingLeft: 4 }}>▶</div>
          <div style={{ position: 'relative', textAlign: 'left', flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: J.butter, fontWeight: 700 }}>Suena</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: J.paperHi,
                            letterSpacing: '-0.02em', lineHeight: 1, marginTop: 4 }}>
              m{selected ? ['', 'ā', 'á', 'ǎ', 'à'][selected] : 'a'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)',
                            marginTop: 4, fontWeight: 500 }}>
              Tócame para volver a escuchar
            </div>
          </div>
        </button>

        <JSection label="Cuatro opciones" cn="四声"/>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tones.map(({ t, n, desc, mark }) => {
            const isSelected = selected === t;
            const isCorrect = t === correct;
            const state = isSelected ? (isCorrect ? 'ok' : 'no')
                         : (selected != null && isCorrect ? 'hint' : 'idle');
            const bg = state === 'ok' ? J.jadeBg
                     : state === 'no' ? J.redBg
                     : state === 'hint' ? J.sandBg : J.paperHi;
            const fg = state === 'ok' ? J.jadeDeep
                     : state === 'no' ? J.redDeep
                     : state === 'hint' ? J.sandDeep : J.ink;
            const accent = state === 'ok' ? J.jade
                         : state === 'no' ? J.red
                         : state === 'hint' ? J.sand : J.mute;
            return (
              <button key={t} onClick={() => setSelected(t)} style={{
                background: bg, color: fg, border: 0, borderRadius: 16,
                padding: '14px 16px', cursor: 'pointer', fontFamily: J.sans,
                textAlign: 'left',
                display: 'flex', alignItems: 'center', gap: 14,
                boxShadow: state === 'ok' ? '0 4px 12px -4px rgba(31,74,51,0.4)'
                          : 'none',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: 'rgba(255,255,255,0.55)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <JToneCurve tone={t} size={36} color={accent} sw={2.5}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 15, fontWeight: 700,
                                     letterSpacing: '-0.01em' }}>
                      m{mark}
                    </span>
                    <span style={{ fontSize: 13, color: J.mute, fontWeight: 500 }}>—</span>
                    <span style={{ fontSize: 13.5, fontWeight: 700 }}>{n}</span>
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 500,
                                 marginTop: 2, opacity: 0.7 }}>
                    {desc}
                  </div>
                </div>
                <span style={{ fontFamily: J.cnSerif, fontSize: 18,
                                color: accent, fontWeight: 600, flexShrink: 0 }}>
                  {['', '一', '二', '三', '四'][t]}
                </span>
              </button>
            );
          })}
        </div>

        {selected != null && (
          <div style={{ marginTop: 20 }}>
            <JBtn kind={selected === correct ? 'jade' : 'red'} full
                   onClick={() => { setSelected(null); }}>
              {selected === correct ? 'Bien hecho — siguiente' : 'Vamos otra vez'}
            </JBtn>
          </div>
        )}
      </JScroll>
    </JFrame>
  );
};

// ── TRAZOS ────────────────────────────────────────────────────
const JRStrokes = ({ go = () => {} }) => {
  const [stroke, setStroke] = React.useState(3);
  const total = 7;
  const strokes = [
    'M 60 80 L 60 220',
    'M 30 100 L 30 200 L 80 200 L 80 100 Z',
    'M 130 70 Q 145 70 160 60',
    'M 145 90 L 145 180',
    'M 125 130 L 200 130',
    'M 175 70 L 240 230',
    'M 220 110 L 170 230',
  ];

  return (
    <JFrame>
      <JTopBar
        left={<JBack onClick={() => go('home')}/>}
        sub="Trazos · 听"
        right={<button style={{ background: 'transparent', border: 0, fontSize: 13,
                                  color: J.mute, fontWeight: 600, cursor: 'pointer',
                                  fontFamily: J.sans }} onClick={() => setStroke(0)}>
          Reiniciar
        </button>}
      />

      <JScroll pad="14px 20px 20px">
        {/* Header tiles */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
                       marginBottom: 16 }}>
          <JCard padding="14px 16px" style={{
            background: J.jadeBg, border: `1px solid ${J.jade}`,
          }}>
            <JLabel color={J.jadeDeep}>Carácter</JLabel>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
              <span style={{ fontFamily: J.cnSans, fontSize: 36, fontWeight: 700,
                              color: J.jadeDeep, lineHeight: 1 }}>听</span>
              <span style={{ fontSize: 13, color: J.jadeDeep, fontWeight: 700 }}>tīng</span>
            </div>
          </JCard>
          <JCard padding="14px 16px">
            <JLabel>Trazo</JLabel>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: J.red,
                              letterSpacing: '-0.03em', lineHeight: 1 }}>{stroke}</span>
              <span style={{ fontSize: 18, color: J.mute, fontWeight: 700 }}>/ {total}</span>
            </div>
          </JCard>
        </div>

        {/* Practice surface */}
        <div style={{
          background: J.paperHi, border: `1px solid ${J.hair}`, borderRadius: 22,
          padding: 12, aspectRatio: '1 / 1', position: 'relative',
        }}>
          <svg viewBox="0 0 280 280" width="100%" height="100%" style={{ display: 'block' }}>
            <defs>
              <pattern id="jr-grid" width="70" height="70" patternUnits="userSpaceOnUse">
                <path d="M 70 0 L 0 0 0 70" fill="none"
                       stroke="rgba(28,24,19,0.08)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="280" height="280" fill="url(#jr-grid)" rx="14"/>
            <line x1="140" y1="6" x2="140" y2="274" stroke="rgba(28,24,19,0.18)"
                   strokeWidth="0.6" strokeDasharray="4 4"/>
            <line x1="6" y1="140" x2="274" y2="140" stroke="rgba(28,24,19,0.18)"
                   strokeWidth="0.6" strokeDasharray="4 4"/>
            <text x="140" y="220" textAnchor="middle" fontSize="220"
                  fontFamily="Noto Sans SC, sans-serif" fontWeight="700"
                  fill="rgba(28,24,19,0.10)">听</text>
            {strokes.slice(0, stroke).map((d, i) => (
              <path key={i} d={d} stroke={J.ink} strokeWidth="6"
                    fill={i === 1 ? J.ink : 'none'}
                    strokeLinecap="round" strokeLinejoin="round"
                    opacity={i === stroke - 1 ? 1 : 0.7}/>
            ))}
            {stroke < total && (
              <path d={strokes[stroke]} stroke={J.red} strokeWidth="3.5"
                    fill="none" strokeDasharray="6 6" strokeLinecap="round" opacity="0.8"/>
            )}
          </svg>
        </div>

        {/* Sequence dots */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginTop: 20 }}>
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} style={{
              width: i < stroke ? 22 : 8, height: 8, borderRadius: 99,
              background: i < stroke ? J.red : J.hair,
              transition: 'width .25s',
            }}/>
          ))}
        </div>

        {/* Controls */}
        <div style={{ marginTop: 22, display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 8 }}>
          <button onClick={() => setStroke(Math.max(0, stroke - 1))} disabled={stroke === 0}
            style={{
              background: J.paperHi, color: stroke === 0 ? J.mute : J.ink,
              border: `1px solid ${J.hair}`, borderRadius: 99, padding: '14px 16px',
              fontSize: 14, fontWeight: 700, fontFamily: J.sans,
              cursor: stroke === 0 ? 'default' : 'pointer',
              opacity: stroke === 0 ? 0.5 : 1,
            }}>← Atrás</button>
          <JBtn kind={stroke === total ? 'red' : 'jade'} full
                 onClick={() => setStroke(Math.min(total, stroke + 1))}>
            {stroke === total ? 'Carácter completado' : 'Siguiente trazo →'}
          </JBtn>
        </div>

        <div style={{ marginTop: 16, fontSize: 12, color: J.mute,
                       textAlign: 'center', lineHeight: 1.5, fontWeight: 500 }}>
          Arriba a abajo, izquierda a derecha. Orden tradicional · 笔顺.
        </div>
      </JScroll>
    </JFrame>
  );
};

// ── TRADUCIR ──────────────────────────────────────────────────
const JRTranslate = ({ go = () => {} }) => {
  const pool = ['听', '喜欢', '我', '音乐', '吃', '不'];
  const [picked, setPicked] = React.useState(['我', '喜欢']);
  const pinyinMap = { '我':'wǒ', '喜欢':'xǐhuān', '听':'tīng',
                       '音乐':'yīnyuè', '吃':'chī', '不':'bù' };

  return (
    <JFrame>
      <JTopBar
        left={<JBack onClick={() => go('home')}/>}
        sub="Traducir · 2 / 9"
        right={<button style={{ background: 'transparent', border: 0, fontSize: 13,
                                  color: J.mute, fontWeight: 600, cursor: 'pointer',
                                  fontFamily: J.sans }}>Pista</button>}
      />

      <div style={{ padding: '0 20px' }}>
        <div style={{ height: 8, borderRadius: 99, background: J.hair, overflow: 'hidden' }}>
          <div style={{ width: '22%', height: '100%',
                           background: `linear-gradient(90deg, ${J.jade}, ${J.red})`,
                           borderRadius: 99 }}/>
        </div>
      </div>

      <JScroll pad="20px 20px 20px">
        <div style={{ marginBottom: 6 }}>
          <JLabel>Traduce al chino</JLabel>
        </div>
        <div style={{
          padding: '16px 18px',
          background: J.paperHi, border: `1px solid ${J.hair}`, borderRadius: 18,
          fontSize: 19, fontWeight: 600, color: J.ink, lineHeight: 1.35,
          letterSpacing: '-0.01em',
        }}>
          "Me gusta escuchar música."
        </div>

        {/* Build area */}
        <div style={{
          marginTop: 18, minHeight: 96, padding: '14px 14px',
          background: J.sandBg2,
          border: `2px dashed ${J.hairS}`, borderRadius: 18,
          display: 'flex', flexWrap: 'wrap', gap: 8, alignContent: 'flex-start',
        }}>
          {picked.map((w, i) => (
            <button key={i} onClick={() => setPicked(picked.filter((_, j) => j !== i))} style={{
              background: J.ink, color: J.paperHi,
              border: 0, padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
              fontFamily: J.cnSans, fontSize: 20, fontWeight: 700, lineHeight: 1,
              display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center',
              boxShadow: '0 1px 0 rgba(0,0,0,0.2)',
            }}>
              {w}
              <span style={{ fontFamily: J.sans, fontSize: 10, color: J.butter,
                              fontWeight: 600 }}>{pinyinMap[w]}</span>
            </button>
          ))}
          {picked.length === 0 && (
            <span style={{ fontSize: 13, color: J.mute, fontWeight: 600,
                            alignSelf: 'center' }}>
              Toca palabras abajo para construir la frase.
            </span>
          )}
        </div>

        {/* Pinyin readout */}
        <div style={{ marginTop: 12, fontSize: 14, color: J.jade,
                       fontWeight: 700, letterSpacing: '0.01em',
                       minHeight: 22, textAlign: 'center' }}>
          {picked.length > 0 ? picked.map(w => pinyinMap[w]).join(' · ') : '·  ·  ·'}
        </div>

        <JSection label="Palabras" cn="词"/>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {pool.filter(w => !picked.includes(w)).map(w => (
            <button key={w} onClick={() => setPicked([...picked, w])} style={{
              background: J.paperHi, border: `1px solid ${J.hair}`,
              padding: '10px 14px', borderRadius: 12, cursor: 'pointer',
              fontFamily: J.cnSans, fontSize: 20, fontWeight: 700,
              color: J.ink,
              display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center',
            }}>
              {w}
              <span style={{ fontFamily: J.sans, fontSize: 10, color: J.mute,
                              fontWeight: 600 }}>{pinyinMap[w]}</span>
            </button>
          ))}
        </div>

        <div style={{ marginTop: 22 }}>
          <JBtn kind="jade" full>Comprobar</JBtn>
        </div>
      </JScroll>
    </JFrame>
  );
};

Object.assign(window, { JRTones, JRStrokes, JRTranslate });
