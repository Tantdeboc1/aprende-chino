// jr-home.jsx — Home

const JRHome = ({ go = () => {} }) => (
  <JFrame>
    <JTopBar
      left={<JMark/>}
      right={<JStreak n={4} label="días"/>}
    />

    <JScroll>
      {/* Greeting */}
      <div style={{ marginTop: 8, marginBottom: 18 }}>
        <h1 style={{
          margin: 0, fontWeight: 700, fontSize: 28, lineHeight: 1.1,
          letterSpacing: '-0.025em', color: J.ink,
        }}>
          Buenas tardes,<br/>
          <span style={{ color: J.jade }}>Jesús</span>
          <span style={{ color: J.red }}>.</span>
        </h1>
        <div style={{ marginTop: 8, fontSize: 14, color: J.inkSoft, fontWeight: 500 }}>
          Hoy <b style={{ color: J.jade }}>12 min</b> y cierras el día.
        </div>
      </div>

      {/* Carácter del día — jade con sello rojo */}
      <div onClick={() => go('flashcard')} style={{
        background: J.jade, color: J.paperHi,
        borderRadius: 22, padding: '20px 20px 18px',
        marginBottom: 16, position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(31,74,51,0.25)',
        cursor: 'pointer',
      }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140,
                       borderRadius: '50%', background: J.jadeDeep, opacity: 0.5 }}/>
        <div style={{ position: 'absolute', bottom: -30, right: 60, width: 80, height: 80,
                       borderRadius: '50%', background: J.butter, opacity: 0.18 }}/>

        <div style={{ position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                            color: J.butter, fontWeight: 700 }}>Carácter de hoy · 今日</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>1 / 7</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 8 }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                fontFamily: J.cnSans, fontSize: 120, lineHeight: 0.95,
                fontWeight: 700, color: J.paperHi, letterSpacing: '-0.02em',
              }}>听</div>
              <div style={{ position: 'absolute', bottom: 14, right: -6 }}>
                <JSeal char="聽" size={26} rotate={-6}/>
              </div>
            </div>
            <div style={{ paddingBottom: 14, flex: 1 }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: J.butter,
                              letterSpacing: '-0.02em' }}>tīng</div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.82)',
                              marginTop: 2, fontWeight: 500 }}>
                escuchar, oír
              </div>
            </div>
          </div>

          <div style={{
            marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.18)',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)' }}>
              口 boca + 斤 hacha · 7 trazos
            </div>
            <span style={{
              background: J.butter, color: J.jadeDeep,
              fontWeight: 700, fontSize: 12.5, padding: '7px 14px', borderRadius: 99,
            }}>Aprender →</span>
          </div>
        </div>
      </div>

      {/* Practice grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 4 }}>
        <JRPracticeCard cn="音" rom="yīn" title="Tonos"    n={118}
          bg={J.redBg} fg={J.redDeep} accentColor={J.red}
          onClick={() => go('tones')}/>
        <JRPracticeCard cn="笔" rom="bǐ"  title="Trazos"   n={42}
          bg={J.jadeBg} fg={J.jadeDeep} accentColor={J.jade}
          onClick={() => go('strokes')}/>
        <JRPracticeCard cn="译" rom="yì"  title="Traducir" n={9}
          bg={J.sandBg} fg={J.sandDeep} accentColor={J.sand}
          onClick={() => go('translate')}/>
        <JRPracticeCard cn="复" rom="fù"  title="Repaso"   n={14} accent
          onClick={() => go('flashcard')}/>
      </div>

      {/* Continuar lesson */}
      <JSection label="Continuar" cn="繼續"/>
      <JCard onClick={() => go('lesson')} padding="16px 18px">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                       marginBottom: 6 }}>
          <JLabel color={J.jade}>En curso · 進行中</JLabel>
          <span style={{ fontSize: 12, fontWeight: 700, color: J.jade }}>58%</span>
        </div>
        <div style={{ fontSize: 16, fontWeight: 700, color: J.ink, letterSpacing: '-0.01em' }}>
          Lección 01 · Saludos
        </div>
        <div style={{ fontSize: 12.5, color: J.inkSoft, marginTop: 2, fontWeight: 500 }}>
          ¿Cómo has estado últimamente? · 14 de 24
        </div>
        <div style={{ marginTop: 12, height: 8, borderRadius: 99,
                       background: J.hair, overflow: 'hidden' }}>
          <div style={{ width: '58%', height: '100%',
                          background: `linear-gradient(90deg, ${J.jade}, ${J.red})`,
                          borderRadius: 99 }}/>
        </div>
      </JCard>

      {/* Today stats */}
      <JSection label="Hoy" cn="今天"/>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        <JStat n="3"   l="dominadas" color={J.red}/>
        <JStat n="12'" l="estudio"/>
        <JStat n="60%" l="meta"/>
      </div>
    </JScroll>

    <JNav active="home" onNav={go}/>
  </JFrame>
);

const JRPracticeCard = ({ cn, rom, title, n, bg, fg, accentColor, accent, onClick }) => (
  <button onClick={onClick} style={{
    background: accent ? J.ink : bg,
    color: accent ? J.paperHi : fg,
    border: 0, borderRadius: 18, padding: '14px 14px 14px',
    textAlign: 'left', cursor: 'pointer', fontFamily: J.sans,
    display: 'flex', flexDirection: 'column', gap: 14,
    position: 'relative', overflow: 'hidden',
  }}>
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
      <span style={{ fontFamily: J.cnSans, fontSize: 30, fontWeight: 700, lineHeight: 1,
                       color: accent ? J.butter : fg }}>{cn}</span>
      <span style={{ fontSize: 12, fontWeight: 600, opacity: 0.7 }}>{rom}</span>
    </div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
      <span style={{ fontSize: 14, fontWeight: 700 }}>{title}</span>
      <span style={{ fontSize: 13, fontWeight: 700, opacity: 0.85,
                       color: accent ? J.red : (accentColor || fg) }}>{n}</span>
    </div>
  </button>
);

Object.assign(window, { JRHome, JRPracticeCard });
