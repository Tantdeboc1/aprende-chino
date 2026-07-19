// src/components/LessonDetail.jsx
import { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { useMedia } from 'react-use';
import { useWindowSize } from '@/hooks/useWindowSize.js';
import { useTranslation } from 'react-i18next';
import { J } from '@/styles/tokens';
import { getLessonStats, toggleWordMastered } from '@/utils/progress.js';
import { toggleWordDifficult, isWordDifficult, isLeech, getNextReviewInfo } from '@/utils/srs.js';

// Cargas perezosas: estos componentes/módulos arrastran bastante peso (datos
// multi-idioma, librería de partículas) y solo se necesitan al abrir su tab
// o al alcanzar el 100% de la lección. Salen del chunk principal de LessonDetail.
const GrammarTab   = lazy(() => import('./GrammarTab.jsx'));
const CulturalTab  = lazy(() => import('./CulturalTab.jsx'));
const Confetti     = lazy(() => import('react-confetti'));

/* CJK exercise icons — reemplazan emojis */
const EXERCISE_DEFS = [
  { key: 'learn',    cn: '学', labelKey: 'exercise_study',    descKey: 'exercise_study_desc',    bg: J.jadeBg, fg: J.jadeDeep },
  { key: 'quiz',     cn: '考', labelKey: 'exercise_quiz',     descKey: 'exercise_quiz_desc',     bg: J.redBg,  fg: J.redDeep  },
  { key: 'matching', cn: '连', labelKey: 'exercise_matching', descKey: 'exercise_matching_desc', bg: J.sandBg, fg: J.sandDeep },
  { key: 'writing',  cn: '写', labelKey: 'exercise_writing',  descKey: 'exercise_writing_desc',  bg: J.jadeBg, fg: J.jadeDeep },
];

function StatusIcon({ status }) {
  if (status === 'mastered') return <span style={{ color: J.red, fontSize: 16 }}>★</span>;
  if (status === 'seen')     return <span style={{ color: J.sand, fontSize: 16 }}>◑</span>;
  return <span style={{ color: J.mute2, fontSize: 16 }}>○</span>;
}

export default function LessonDetail({
  lessonNum,
  lessonData,
  characters,
  progress,
  onProgressChange,
  goBack,
  onStartExercise,
  speakChinese,
  defaultTab = 'vocab',
  onTabChange,
}) {
  const [tab, setTab] = useState(defaultTab);
  const { width, height } = useWindowSize();
  // Accesibilidad: respeta "reducir movimiento" — sin confetti animado.
  const reduceMotion = useMedia('(prefers-reduced-motion: reduce)', false);

  const handleTabChange = (id) => {
    setTab(id);
    onTabChange?.(id);
  };
  const { t } = useTranslation();
  const [showSupp, setShowSupp] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);

  const mainWords = useMemo(() => characters.filter(c => c.lesson === lessonNum && !c.isSupplementary), [characters, lessonNum]);
  const suppWords  = useMemo(() => characters.filter(c => c.lesson === lessonNum && c.isSupplementary),  [characters, lessonNum]);
  const shownWords = showSupp ? [...mainWords, ...suppWords] : mainWords;

  const stats = useMemo(() => getLessonStats(progress, lessonNum, characters), [progress, lessonNum, characters]);
  const seenPct     = stats.total > 0 ? Math.round((stats.seen    / stats.total) * 100) : 0;
  const masteredPct = stats.total > 0 ? Math.round((stats.mastered / stats.total) * 100) : 0;

  // Confetti al llegar al 100%
  const [showConfetti, setShowConfetti] = useState(false);
  const prevMasteredPct = useRef(masteredPct);
  useEffect(() => {
    if (masteredPct === 100 && prevMasteredPct.current < 100) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 4000);
      prevMasteredPct.current = masteredPct;
      return () => clearTimeout(timer);
    }
    prevMasteredPct.current = masteredPct;
  }, [masteredPct]);

  const getStatus = (char) => {
    const w = progress?.[`lesson_${lessonNum}`]?.[char];
    if (!w) return 'unseen';
    if (w.mastered) return 'mastered';
    if (w.seen) return 'seen';
    return 'unseen';
  };

  const handleToggle = (char, status) => {
    const updated = toggleWordMastered(progress, lessonNum, char, status !== 'mastered');
    onProgressChange(updated);
  };

  const handleToggleDifficult = (char) => {
    const updated = toggleWordDifficult(progress, char);
    onProgressChange(updated);
  };

  return (
    <div className="min-h-screen pb-24" style={{ background: J.paper }}>
      {showConfetti && !reduceMotion && (
        <Suspense fallback={null}>
          <Confetti
            width={width} height={height} recycle={false} numberOfPieces={250} gravity={0.25}
            colors={[J.jade, J.red, J.butter, J.sand, '#86efac']}
            style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999, pointerEvents: 'none' }}
          />
        </Suspense>
      )}

      {/* Header */}
      <div style={{
        background: J.jade, color: J.onAccent,
        borderLeft: `4px solid ${J.jadeDeep}`,
        padding: '40px 16px 16px',
      }}>
        <button onClick={goBack} className="flex items-center gap-1.5 text-sm mb-3" style={{
          color: 'rgba(255,255,255,0.88)', background: 'none', border: 0, cursor: 'pointer', fontWeight: 600,
        }}>
          <span>←</span> {t('lesson_back_home')}
        </button>

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: J.butter, marginBottom: 2 }}>
              {t('exam_lesson_label', { num: lessonNum })}
            </p>
            <h1 className="text-xl font-bold leading-snug" style={{ color: J.onAccent }}>
              {lessonData?.titleEs || ''}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.75)' }}>{lessonData?.titleZh || ''}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-3xl font-bold" style={{ color: J.butter }}>{masteredPct}%</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>{t('lesson_mastered_pct')}</p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-3 space-y-1">
          <div className="flex justify-between text-xs mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <span>{stats.mastered} {t('lesson_mastered_label')} · {stats.seen - stats.mastered} {t('lesson_seen_label')} · {stats.unseen} {t('lesson_unseen_label')}</span>
            <span>{stats.total} {t('lesson_words_label')}</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{
              width: `${seenPct}%`,
              background: `linear-gradient(90deg, ${J.butter}, ${seenPct > 65 ? J.red : J.butter})`,
            }} />
          </div>
          <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.25)' }}>
            <div className="h-full rounded-full transition-all duration-500" style={{
              width: `${masteredPct}%`, background: J.red,
            }} />
          </div>
          <div className="flex gap-4 text-xs pt-0.5">
            <span style={{ color: J.butter }}>&#9642; {t('lesson_seen_label')}</span>
            <span style={{ color: J.red }}>&#9642; {t('lesson_mastered_label')}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pt-4 pb-2 overflow-x-auto">
        {[
          { id: 'vocab',     label: `${t('lesson_tab_vocab')} (${stats.total})` },
          { id: 'exercises', label: t('lesson_tab_practice') },
          { id: 'grammar',   label: t('lesson_tab_grammar') },
          { id: 'culture',   label: t('lesson_tab_culture') },
        ].map(tabItem => {
          const on = tab === tabItem.id;
          return (
            <button
              key={tabItem.id}
              onClick={() => handleTabChange(tabItem.id)}
              className="whitespace-nowrap"
              style={{
                padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 700,
                cursor: 'pointer', border: 0,
                background: on ? J.ink : J.paperHi,
                color: on ? J.paperHi : J.inkSoft,
              }}
            >
              {tabItem.label}
            </button>
          );
        })}
      </div>

      <div className="px-4 pb-6">

        {/* Tab Vocabulario */}
        {tab === 'vocab' && (
          <div>
            {suppWords.length > 0 && (
              <button
                onClick={() => setShowSupp(!showSupp)}
                style={{
                  marginBottom: 12, padding: '6px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700,
                  cursor: 'pointer',
                  border: `1px solid ${showSupp ? J.jade : J.hair}`,
                  background: showSupp ? J.jadeBg : J.paperHi,
                  color: showSupp ? J.jadeDeep : J.mute,
                }}
              >
                {t('lesson_extra_vocab')} ({suppWords.length})
              </button>
            )}

            <div className="space-y-2">
              {shownWords.map(word => {
                const status = getStatus(word.char);
                const isOpen = selectedCard === word.char;
                const isDiff = isWordDifficult(progress, word.char);
                const leech = isLeech(progress, word.char);
                const review = getNextReviewInfo(progress, word.char);
                return (
                  <div
                    key={word.char}
                    onClick={() => setSelectedCard(isOpen ? null : word.char)}
                    className="cursor-pointer transition-all"
                    style={{
                      borderRadius: 16, overflow: 'hidden',
                      border: `1px solid ${isDiff ? J.sand : (status === 'mastered' ? J.jadeBg : J.hair)}`,
                      background: J.paperHi,
                      boxShadow: isOpen ? `0 0 0 1px ${J.hairS}` : 'none',
                    }}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <button
                        onClick={e => { e.stopPropagation(); handleToggle(word.char, status); }}
                        className="w-7 h-7 flex items-center justify-center rounded-full flex-shrink-0"
                        style={{ background: 'transparent', border: 0, cursor: 'pointer' }}
                      >
                        <StatusIcon status={status} />
                      </button>

                      <span className="text-2xl font-cn font-medium w-9 text-center flex-shrink-0" style={{ color: J.ink }}>{word.char}</span>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm" style={{ color: J.jade, fontWeight: 700 }}>{word.pinyin}</span>
                          {word.type && (
                            <span style={{
                              fontSize: 11, padding: '2px 6px', borderRadius: 6, fontWeight: 600,
                              background: J.sandBg, color: J.sandDeep,
                            }}>
                              {word.type}
                            </span>
                          )}
                          {word.isSupplementary && (
                            <span style={{
                              fontSize: 11, padding: '2px 6px', borderRadius: 6, fontWeight: 600,
                              background: J.jadeBg, color: J.jadeDeep,
                            }}>extra</span>
                          )}
                          {/* Badge SRS: cuándo toca repasar (o "dominada" si interval ≥ 21d). */}
                          {review.kind === 'mastered' && (
                            <span style={{
                              fontSize: 11, padding: '2px 6px', borderRadius: 6, fontWeight: 600,
                              background: J.jadeBg, color: J.jadeDeep,
                            }} title={t('srs_badge_mastered_title', 'Dominada — repaso en >3 semanas')}>
                              ✓ {t('srs_badge_mastered', 'dominada')}
                            </span>
                          )}
                          {review.kind === 'due' && (
                            <span style={{
                              fontSize: 11, padding: '2px 6px', borderRadius: 6, fontWeight: 600,
                              background: J.redBg, color: J.redDeep,
                            }} title={t('srs_badge_due_title', 'Toca repasarla hoy')}>
                              🕐 {t('srs_badge_due', 'hoy')}
                            </span>
                          )}
                          {review.kind === 'soon' && (
                            <span style={{
                              fontSize: 11, padding: '2px 6px', borderRadius: 6, fontWeight: 600,
                              background: J.sandBg2 || J.sandBg, color: J.sandDeep,
                            }} title={t('srs_badge_soon_title', 'Próxima revisión en {{n}} días', { n: review.days })}>
                              🕐 {review.days === 1
                                ? t('srs_badge_tomorrow', 'mañana')
                                : t('srs_badge_in_days', 'en {{n}}d', { n: review.days })}
                            </span>
                          )}
                          {/* Leech: te ha costado mucho. */}
                          {leech && (
                            <span style={{
                              fontSize: 11, padding: '2px 6px', borderRadius: 6, fontWeight: 600,
                              background: J.redBg, color: J.redDeep,
                            }} title={t('srs_badge_leech_title', 'La has fallado varias veces seguidas — dale repaso')}>
                              🐛 {t('srs_badge_leech', 'rebelde')}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium mt-0.5 truncate" style={{ color: J.ink }}>{word.meaning}</p>
                      </div>

                      <button
                        onClick={e => { e.stopPropagation(); handleToggleDifficult(word.char); }}
                        title={isDiff ? t('vocab_unmark_difficult') : t('vocab_mark_difficult')}
                        className="w-8 h-8 flex items-center justify-center rounded-full text-sm flex-shrink-0"
                        style={{
                          background: isDiff ? J.sandBg : 'transparent', border: 0, cursor: 'pointer',
                          color: isDiff ? J.sand : J.mute2, fontWeight: 700,
                        }}
                      >
                        !
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); speakChinese && speakChinese({ hanzi: word.char, pinyin: word.pinyin }); }}
                        className="font-cn w-8 h-8 flex items-center justify-center rounded-full text-sm flex-shrink-0"
                        style={{ background: J.jadeBg, color: J.jadeDeep, border: 0, cursor: 'pointer', fontWeight: 700 }}
                      >
                        声
                      </button>
                    </div>

                    {isOpen && word.examples && word.examples.length > 0 && (
                      <div className="px-3 pb-3 pt-2" style={{ borderTop: `1px solid ${J.hair}` }}>
                        <p className="text-xs mb-1.5" style={{ color: J.mute }}>Ejemplos:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {word.examples.map((ex, i) => (
                            <span key={i} className="text-sm px-2.5 py-1 rounded-lg" style={{ background: J.paper, color: J.ink }}>{ex}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Gramatica */}
        {tab === 'grammar' && (
          <Suspense fallback={<div className="pt-6 text-center text-sm" style={{ color: J.mute }}>…</div>}>
            <GrammarTab
              lessonNum={lessonNum}
              accent={{
                border: `border-jade`,
                text: J.jade,
                light: J.jadeMid,
                icon: J.jadeBg,
              }}
            />
          </Suspense>
        )}

        {/* Tab Cultura */}
        {tab === 'culture' && (
          <Suspense fallback={<div className="pt-6 text-center text-sm" style={{ color: J.mute }}>…</div>}>
            <CulturalTab
              lessonNum={lessonNum}
              accent={{
                icon: J.jadeBg,
                ring: `border-jade`,
              }}
            />
          </Suspense>
        )}

        {/* Tab Practicar */}
        {tab === 'exercises' && (
          <div className="space-y-3 pt-1">
            <button
              onClick={() => onStartExercise('exam')}
              className="w-full flex items-center gap-4 p-4 rounded-xl text-left"
              style={{
                background: J.paperHi, border: `2px solid ${J.red}`, cursor: 'pointer',
              }}
            >
              <div className="font-cn w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: J.redBg, color: J.redDeep, fontWeight: 700 }}>
                试
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm" style={{ color: J.ink }}>{t('exercise_exam')}</h3>
                <p className="text-xs mt-0.5" style={{ color: J.inkSoft }}>{t('exercise_exam_desc')}</p>
              </div>
              <span style={{ color: J.mute, fontWeight: 700 }}>→</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              {EXERCISE_DEFS.map(ex => (
                <button
                  key={ex.key}
                  onClick={() => onStartExercise(ex.key)}
                  className="flex flex-col items-start p-3 sm:p-4 rounded-xl text-left"
                  style={{
                    background: J.paperHi, border: `1px solid ${J.hair}`, cursor: 'pointer',
                  }}
                >
                  <div className="font-cn w-9 h-9 rounded-lg flex items-center justify-center text-lg mb-2"
                    style={{ background: ex.bg, color: ex.fg, fontWeight: 700 }}>
                    {ex.cn}
                  </div>
                  <h3 className="font-semibold text-sm mb-0.5" style={{ color: J.ink }}>{t(ex.labelKey)}</h3>
                  <p className="text-xs leading-tight" style={{ color: J.mute }}>{t(ex.descKey)}</p>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
