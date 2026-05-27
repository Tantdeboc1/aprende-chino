// jr-flash.jsx — Flashcard

const JRFlash = ({ go = () => {} }) => {
  const [revealed, setRevealed] = React.useState(true);
  const [played, setPlayed] = React.useState(false);

  return (
    <JFrame>
      <JTopBar
        left={<JBack onClick={() => go('home')}/>}
        sub="Repaso · 3 / 12"
        right={<button style={{ background: 'transparent', border: 0, fontSize: 13,
                                  color: J.mute, fontWeight: 600, cursor: 'pointer',
                                  fontFamily: J.sans }}>Saltar</button>}
      />

      <div style={{ padding: '0 20px' }}>
        <div style={{ height: 8, borderRadius: 99, background: J.hair, overflow: 'hidden' }}>
          <div style={{ width: '25%', height: '100%',
                           background: `linear-gradient(90deg, ${J.jade}, ${J.red})`,
                           borderRadius: 99 }}/>
        </div>
      </div>

      <div style={{ flex: 1, padding: '20px 20px 16px',
                     display: 'flex', flexDirection: 'column' }}>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                       alignItems: 'center', justifyContent: 'center' }}>

          <div style={{
            width: 332, padding: '32px 24px 26px',
            background: J.paperHi,
            border: `1px solid ${J.hair}`,
            borderRadius: 28, textAlign: 'center',
            boxShadow: '0 8px 24px rgba(28,24,19,0.06)',
            position: 'relative',
          }}>
            {/* Tone chip — top-left */}
            <div style={{ position: 'absolute', top: 14, left: 14 }}>
              <JChip bg={J.jadeBg} fg={J.jadeDeep}>tono 1</JChip>
            </div>
            {/* Master's seal — top-right */}
            <div style={{ position: 'absolute', top: 12, right: 12 }}>
              <JSeal char="3" size={28} rotate={-4}/>
            </div>

            <div style={{
              fontFamily: J.cnSans, fontSize: 180, lineHeight: 0.85,
              fontWeight: 700, color: J.ink,
              letterSpacing: '-0.04em',
              marginTop: 14,
            }}>听</div>

            {/* Audio button — type-only, no icon */}
            <button onClick={() => setPlayed(true)} style={{
              marginTop: 6, padding: '8px 16px', borderRadius: 99,
              background: played ? J.jadeBg : 'transparent',
              border: `1px solid ${played ? J.jade : J.hair}`,
              color: played ? J.jadeDeep : J.inkSoft,
              fontSize: 12.5, fontWeight: 700, fontFamily: J.sans,
              cursor: 'pointer', letterSpacing: '0.04em',
            }}>
              {played ? '◉  Reproduciendo' : '▷  Escuchar'}
            </button>

            {revealed && (
              <div style={{ marginTop: 16, animation: 'fadeIn .3s ease' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: J.jade,
                                letterSpacing: '-0.02em' }}>tīng</div>
                <JLabel color={J.mute}>alto plano</JLabel>
                <div style={{ fontSize: 18, color: J.ink, fontWeight: 600, marginTop: 14 }}>
                  escuchar, oír
                </div>
                <div style={{
                  marginTop: 16, paddingTop: 14, borderTop: `1px solid ${J.hair}`,
                  fontSize: 14, color: J.inkSoft,
                }}>
                  <div style={{ fontFamily: J.cnSans, fontSize: 17, color: J.ink,
                                  marginBottom: 6, fontWeight: 600 }}>
                    我喜欢<span style={{ color: J.red }}>听</span>音乐
                  </div>
                  Me gusta escuchar música.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Difficulty */}
        {revealed ? (
          <div>
            <div style={{ textAlign: 'center', fontSize: 12, color: J.mute,
                           fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                           marginBottom: 10 }}>
              ¿Qué tal?
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
              <JRDiff label="Otra vez" sub="< 1 min" bg={J.sandBg} fg={J.sandDeep}
                       onClick={() => setRevealed(false)}/>
              <JRDiff label="Bien" sub="3 días" bg={J.jadeBg} fg={J.jadeDeep}
                       onClick={() => setRevealed(false)}/>
              <JRDiff label="Dominado" sub="1 sem." bg={J.red} fg={J.paperHi}
                       hero onClick={() => setRevealed(false)}/>
            </div>
          </div>
        ) : (
          <JBtn kind="primary" full onClick={() => setRevealed(true)}>
            Revelar respuesta
          </JBtn>
        )}
      </div>
    </JFrame>
  );
};

const JRDiff = ({ label, sub, bg, fg, hero, onClick }) => (
  <button onClick={onClick} style={{
    background: bg, color: fg, border: 0, borderRadius: 16,
    padding: '14px 8px', cursor: 'pointer', fontFamily: J.sans,
    display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center',
    boxShadow: hero ? '0 4px 12px -4px rgba(200,57,47,0.5)' : 'none',
  }}>
    <span style={{ fontSize: 14, fontWeight: 700 }}>{label}</span>
    <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.75 }}>{sub}</span>
  </button>
);

Object.assign(window, { JRFlash });
