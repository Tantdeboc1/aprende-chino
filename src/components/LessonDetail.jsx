import { VIDEO_CATALOG, LESSON_VIDEOS } from '@/data/lessonVideos.js';
import ReadingAid from '@/components/ui/ReadingAid.jsx';
import { motionReduced } from '@/utils/learningPrefs.js';
import { useLocalSnapshot } from '@/hooks/useLocalSnapshot.js';
import WordExamples from '@/components/ui/WordExamples.jsx';
// src/components/LessonDetail.jsx
import { useState, useMemo, useEffect, useRef, Suspense } from 'react';
import { lazyWithRetry } from '@/utils/lazyWithRetry.js';
import { trackEvent } from '@/utils/analytics.js';
import { useWindowSize } from '@/hooks/useWindowSize.js';
import { useTranslation } from 'react-i18next';
import { loc } from '@/utils/loc.js';
import { locationComparison, topicWorkshop } from '@/data/topicWorkshop.js';
import { defaultLessonTab, introductionStories, introductionWorkshops, lessonActivities, lessonIntroductions } from '@/data/lessonIntroductions.js';
import LessonIntroduction from '@/components/LessonIntroduction.jsx';
import LessonStoryPreview from '@/components/LessonStoryPreview.jsx';
import { J } from '@/styles/tokens';
import { getLessonStats, toggleWordMastered } from '@/utils/progress.js';
import { toggleWordDifficult, isWordDifficult, isLeech, getNextReviewInfo } from '@/utils/srs.js';

// Cargas perezosas: estos componentes/módulos arrastran bastante peso (datos
// multi-idioma, librería de partículas) y solo se necesitan al abrir su tab
// o al alcanzar el 100% de la lección. Salen del chunk principal de LessonDetail.
const StudyTab = lazyWithRetry(() => import('./learn/Characters/Progressive.jsx'));
const LocationStudy = lazyWithRetry(() => import('./LocationStudy.jsx'));
const locationIntro = {
  tab: { es: 'Introducción', en: 'Introduction', fr: 'Introduction', de: 'Einführung', it: 'Introduzione', pt: 'Introdução' },
  title: { es: '¿Qué vas a aprender?', en: 'What will you learn?', fr: 'Que vas-tu apprendre ?', de: 'Was lernst du?', it: 'Che cosa imparerai?', pt: 'O que vais aprender?' },
  overview: {
    es: 'Este tema trata de cómo hablamos de los lugares en chino. Aprenderás nombres de sitios del barrio y palabras para situarlos. Por ejemplo, con «al lado» o «a la izquierda» puedes dar una ubicación tomando otro lugar como referencia.',
    en: 'This unit is about talking about places in Chinese. You’ll learn the names of places in a neighborhood and words for saying where they are. For example, “next to” and “to the left of” describe a location relative to another place.',
    fr: 'Dans cette unité, tu apprends à parler des lieux en chinois. Tu découvriras des noms de lieux du quartier et des mots pour les situer. Par exemple, « à côté de » et « à gauche de » permettent de situer un lieu par rapport à un autre.',
    de: 'In dieser Lektion lernst du, wie man auf Chinesisch über Orte spricht. Du lernst die Namen von Orten im Viertel und Wörter, um ihre Lage zu beschreiben. Mit „neben“ oder „links von“ kannst du etwa einen Ort im Verhältnis zu einem anderen beschreiben.',
    it: 'In questa unità impari a parlare dei luoghi in cinese. Vedrai i nomi dei luoghi del quartiere e le parole per indicare dove si trovano. Per esempio, «accanto a» e «a sinistra di» permettono di situare un luogo rispetto a un altro.',
    pt: 'Nesta unidade, aprendes a falar sobre lugares em chinês. Vais conhecer nomes de locais do bairro e palavras para os situar. Por exemplo, «ao lado de» e «à esquerda de» permitem indicar onde fica um lugar em relação a outro.',
  },
  connection: {
    es: 'En la viñeta, 在 sitúa el banco tomando el supermercado como referencia. En la misma historia aparece 有 para decir que hay un banco a la entrada de la escuela. Con el plano practicarás también cómo usar 是 para identificar un edificio.',
    en: 'In the panel, 在 tells you where the bank is relative to the supermarket. The story also uses 有 to say there’s a bank at the school entrance. With the map, you’ll also practice identifying a building with 是.',
    fr: 'Dans la vignette, 在 situe la banque par rapport au supermarché. Dans la même histoire, 有 indique qu’il y a une banque à l’entrée de l’école. Avec le plan, tu t’entraîneras aussi à identifier un bâtiment avec 是.',
    de: 'Im Bild zeigt 在, wo die Bank im Verhältnis zum Supermarkt liegt. In derselben Geschichte sagt 有, dass es am Schuleingang eine Bank gibt. Mit dem Plan übst du auch, ein Gebäude mit 是 zu benennen.',
    it: 'Nella vignetta, 在 indica dove si trova la banca rispetto al supermercato. Nella stessa storia, 有 indica che c’è una banca all’ingresso della scuola. Con la mappa ti eserciterai anche a identificare un edificio con 是.',
    pt: 'Na vinheta, 在 situa o banco em relação ao supermercado. Na mesma história, 有 indica que há um banco à entrada da escola. Com o mapa, também vais praticar como identificar um edifício com 是.',
  },
  goals: [
    { es: 'Decir dónde está un lugar con 在.', en: 'Say where a place is using 在.', fr: 'Dire où se trouve un lieu avec 在.', de: 'Mit 在 sagen, wo ein Ort ist.', it: 'Dire dove si trova un luogo con 在.', pt: 'Dizer onde fica um lugar com 在.' },
    { es: 'Contar qué hay cerca con 有.', en: 'Say what is nearby using 有.', fr: 'Dire ce qu’il y a à proximité avec 有.', de: 'Mit 有 sagen, was in der Nähe ist.', it: 'Dire che cosa c’è nelle vicinanze con 有.', pt: 'Dizer o que há por perto com 有.' },
    { es: 'Identificar un edificio con 是.', en: 'Identify a building using 是.', fr: 'Identifier un bâtiment avec 是.', de: 'Mit 是 ein Gebäude identifizieren.', it: 'Identificare un edificio con 是.', pt: 'Identificar um edifício com 是.' },
  ],
  order: {
    es: 'Fíjate en el orden: 饭馆旁边 se lee «restaurante + al lado». Con 在 empiezas por el supermercado. Con 有 o 是 empiezas por el lugar.',
    en: 'Notice the order: 饭馆旁边 reads “restaurant + next to.” With 在, start with the supermarket. With 有 or 是, start with the location.',
    fr: 'Observe l’ordre : 饭馆旁边 se lit « restaurant + à côté ». Avec 在, commence par le supermarché. Avec 有 ou 是, commence par le lieu.',
    de: 'Achte auf die Reihenfolge: 饭馆旁边 heißt wörtlich „Restaurant + daneben“. Mit 在 beginnst du mit dem Supermarkt. Mit 有 oder 是 beginnst du mit dem Ort.',
    it: 'Nota l’ordine: 饭馆旁边 si legge «ristorante + accanto». Con 在 inizi dal supermercato. Con 有 o 是 inizi dal luogo.',
    pt: 'Repara na ordem: 饭馆旁边 lê-se «restaurante + ao lado». Com 在, começas pelo supermercado. Com 有 ou 是, começas pelo lugar.',
  },
  path: {
    es: 'Prueba el plano. Si te falta una palabra, consulta Vocabulario. Si dudas entre dos estructuras, abre Gramática. En Practicar podrás comprobar si sabes aplicarlas en otras situaciones.',
    en: 'Try the map. Look up words in Vocabulary and compare structures in Grammar. In Practice, check whether you can use them in other situations.',
    fr: 'Essaie le plan. Consulte le vocabulaire pour chercher un mot et la grammaire pour comparer les structures. Entraîne-toi ensuite dans d’autres situations.',
    de: 'Probiere den Plan aus. Wörter findest du im Wortschatz, Satzmuster in der Grammatik. Beim Üben kannst du die Muster auf andere Situationen übertragen.',
    it: 'Prova la mappa. Cerca le parole nel vocabolario e confronta le strutture nella grammatica. Negli esercizi potrai usarle in altre situazioni.',
    pt: 'Experimenta o mapa. Consulta o vocabulário para procurar palavras e a gramática para comparar estruturas. Nos exercícios podes aplicá-las a outras situações.',
  },
  vocabStudy: { es: 'Repasar vocabulario con fichas', en: 'Review vocabulary with flashcards', fr: 'Réviser le vocabulaire avec des cartes', de: 'Wortschatz mit Karten üben', it: 'Ripassa il vocabolario con le schede', pt: 'Rever vocabulário com cartões' },
  generalPath: {
    es: 'Si te falta una palabra, consulta Vocabulario. En Gramática puedes ver más ejemplos. Después, en Practicar, comprueba si sabes usar lo aprendido.',
    en: 'Look up words in Vocabulary and find more examples in Grammar. Then use Practice to check what you’ve learned.',
    fr: 'Cherche les mots dans Vocabulaire et d’autres exemples dans Grammaire. Ensuite, vérifie tes acquis dans les exercices.',
    de: 'Schlage Wörter im Wortschatz nach und finde weitere Beispiele in der Grammatik. Überprüfe danach beim Üben, was du gelernt hast.',
    it: 'Cerca le parole in Vocabolario e altri esempi in Grammatica. Poi verifica negli esercizi ciò che hai imparato.',
    pt: 'Procura palavras no Vocabulário e mais exemplos na Gramática. Depois, verifica o que aprendeste nos exercícios.',
  },
};
const GrammarTab   = lazyWithRetry(() => import('./GrammarTab.jsx'));
const TopicPractice = lazyWithRetry(() => import('./TopicPractice.jsx'));
const CulturalTab  = lazyWithRetry(() => import('./CulturalTab.jsx'));
const Confetti     = lazyWithRetry(() => import('react-confetti'));

const VIDEO_TEXT = {
  es: ['Vídeos', 'Vídeos de la lección', 'Ver vídeo', 'Ver en YouTube', 'Necesitas conexión a internet para ver los vídeos.'],
  en: ['Videos', 'Lesson videos', 'Watch video', 'Watch on YouTube', 'An internet connection is needed to watch videos.'],
  fr: ['Vidéos', 'Vidéos de la leçon', 'Voir la vidéo', 'Voir sur YouTube', 'Une connexion Internet est nécessaire.'],
  de: ['Videos', 'Videos zur Lektion', 'Video ansehen', 'Auf YouTube ansehen', 'Für Videos ist eine Internetverbindung erforderlich.'],
  it: ['Video', 'Video della lezione', 'Guarda il video', 'Guarda su YouTube', 'È necessaria una connessione Internet.'],
  pt: ['Vídeos', 'Vídeos da lição', 'Ver vídeo', 'Ver no YouTube', 'É necessária uma ligação à internet.'],
};
const VIDEO_LANGUAGES = ['es', 'en', 'fr', 'de', 'it', 'pt'];
const VIDEO_LANGUAGE_LABELS = {
  es: ['Texto en español', 'Texto en inglés'],
  en: ['Spanish text', 'English text'],
  fr: ['Texte en espagnol', 'Texte en anglais'],
  de: ['Spanischer Text', 'Englischer Text'],
  it: ['Testo in spagnolo', 'Testo in inglese'],
  pt: ['Texto em espanhol', 'Texto em inglês'],
};
const VIDEO_FORMATS = {
  es: ['Lección completa', 'Vídeo corto'], en: ['Full lesson', 'Short video'],
  fr: ['Leçon complète', 'Vidéo courte'], de: ['Vollständige Lektion', 'Kurzes Video'],
  it: ['Lezione completa', 'Video breve'], pt: ['Lição completa', 'Vídeo curto'],
};

/* CJK exercise icons — reemplazan emojis */
const EXERCISE_DEFS = [
  { key: 'quiz',     cn: '考', labelKey: 'exercise_quiz',     descKey: 'exercise_quiz_desc',     bg: J.redBg,  fg: J.redDeep  },
  { key: 'matching', cn: '连', labelKey: 'exercise_matching', descKey: 'exercise_matching_desc', bg: J.sandBg, fg: J.sandDeep },
  { key: 'writing',  cn: '写', labelKey: 'exercise_writing',  descKey: 'exercise_writing_desc',  bg: J.jadeBg, fg: J.jadeDeep },
];

function StatusIcon({ status }) {
  if (status === 'mastered') return <span style={{ color: J.red, fontSize: '1rem' }}>★</span>;
  if (status === 'seen')     return <span style={{ color: J.sand, fontSize: '1rem' }}>◑</span>;
  return <span style={{ color: J.mute2, fontSize: '1rem' }}>○</span>;
}

export default function LessonDetail({
  lessonNum,
  lessonData,
  characters,
  progress,
  onProgressChange,
  goBack,
  onStartExercise,
  onOpenStory,
  speakChinese,
  defaultTab,
  onTabChange,
  onTrackSeen,
  initialState,
  onStateChange,
}) {
  const hasIntro = defaultLessonTab(lessonNum) === 'intro';
  const isLocation = Number(lessonNum) === 6;
  const introduction = isLocation ? locationIntro : lessonIntroductions[lessonNum];
  const introWorkshop = introductionWorkshops[lessonNum];
  const storyPreview = introductionStories[lessonNum];
  const activity = lessonActivities[lessonNum];
  const [tab, setTab] = useState(defaultTab && (defaultTab !== 'intro' || hasIntro) ? defaultTab : (hasIntro ? 'intro' : 'study'));
  const { width, height } = useWindowSize();
  // Accesibilidad: respeta "reducir movimiento" — sin confetti animado.
  const reduceMotion = useLocalSnapshot(motionReduced);

  const handleTabChange = (id) => {
    setTab(id);
    onTabChange?.(id);
  };
  const { t, i18n } = useTranslation();
  const videoText = VIDEO_TEXT[i18n.resolvedLanguage?.split('-')[0]] || VIDEO_TEXT.en;
  const videoLanguage = Math.max(0, VIDEO_LANGUAGES.indexOf(i18n.resolvedLanguage?.split('-')[0] || 'en'));
  const videoFormats = VIDEO_FORMATS[VIDEO_LANGUAGES[videoLanguage]];
  const videoLanguageLabels = VIDEO_LANGUAGE_LABELS[VIDEO_LANGUAGES[videoLanguage]];
  const lessonVideos = LESSON_VIDEOS[lessonNum] || [];
  const [activeVideo, setActiveVideo] = useState(null);
  const [showSupp, setShowSupp] = useState(initialState?.showSupp || false);
  const [showLegend, setShowLegend] = useState(initialState?.showLegend || false);
  const [selectedCard, setSelectedCard] = useState(initialState?.selectedCard || null);
  useEffect(() => {
    onStateChange?.(lessonNum, { showSupp, showLegend, selectedCard });
  }, [lessonNum, showSupp, showLegend, selectedCard, onStateChange]);

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
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: J.butter, marginBottom: 2 }}>
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
          ...(hasIntro ? [{ id: 'intro', label: loc(locationIntro.tab, i18n.language) }] : []),
          ...(!hasIntro ? [{ id: 'study', label: t('exercise_study') }] : []),
          { id: 'vocab',     label: `${t('lesson_tab_vocab')} (${stats.total})` },
          { id: 'grammar',   label: t('lesson_tab_grammar') },
          { id: 'exercises', label: t('lesson_tab_practice') },
          ...(lessonVideos.length ? [{ id: 'videos', label: videoText[0] }] : []),
          { id: 'culture',   label: t('lesson_tab_culture') },
        ].map(tabItem => {
          const on = tab === tabItem.id || (hasIntro && tab === 'study' && tabItem.id === 'vocab');
          return (
            <button
              key={tabItem.id}
              onClick={() => handleTabChange(tabItem.id)}
              className="whitespace-nowrap"
              style={{
                padding: '8px 16px', borderRadius: 99, fontSize: '0.8125rem', fontWeight: 700,
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

        {tab === 'videos' && lessonVideos.length > 0 && (
          <section aria-label={videoText[1]} className="pt-3 space-y-3">
            <h2 className="text-lg font-bold" style={{ color: J.ink }}>{videoText[1]}</h2>
            <p className="text-sm" style={{ color: J.inkSoft }}>{videoText[4]}</p>
            {lessonVideos.map((id) => {
              const video = VIDEO_CATALOG[id];
              const mediaLanguage = videoLanguage !== 0 && video.en ? 'en' : 'es';
              const { id: youtubeId, title } = video[mediaLanguage];
              return (
              <div key={id} className="rounded-xl p-4" style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
                <span className="inline-block rounded-full px-2.5 py-1 mb-2 text-xs font-bold" style={{ background: video.long ? J.jadeBg : J.sandBg, color: video.long ? J.jadeDeep : J.sandDeep }}>
                  {videoFormats[video.long ? 0 : 1]}
                </span>
                <h3 lang={mediaLanguage} className="font-bold" style={{ color: J.ink }}>{title}</h3>
                <p className="text-xs" style={{ color: J.inkSoft }}>{videoLanguageLabels[mediaLanguage === 'es' ? 0 : 1]}</p>
                {activeVideo === id ? (
                  <div className="mt-3">
                    <iframe title={title} src={`https://www.youtube-nocookie.com/embed/${youtubeId}`} style={{ width: '100%', aspectRatio: video.long ? '16 / 9' : '9 / 16', maxHeight: 560, border: 0 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                    <a href={`https://www.youtube.com/watch?v=${youtubeId}`} target="_blank" rel="noopener noreferrer" className="text-sm underline" style={{ color: J.jadeDeep }}>{videoText[3]}</a>
                  </div>
                ) : (
                  <button onClick={() => { setActiveVideo(id); trackEvent('video_play', { lesson: lessonNum, videoId: youtubeId, language: i18n.resolvedLanguage }); }} className="mt-3 rounded-full px-4 py-2 font-bold text-sm" style={{ background: J.jade, color: J.onAccent }}>{videoText[2]}</button>
                )}
              </div>
            ); })}
          </section>
        )}

        {/* Tab Vocabulario */}
        {tab === 'vocab' && (
          <div>
            {hasIntro && <button type="button" className="mb-3 block min-h-11 rounded-xl border border-[var(--hair)] px-4 py-2 font-semibold"
              onClick={() => handleTabChange('study')}>{loc(locationIntro.vocabStudy, i18n.language)}</button>}
            {/* Leyenda de símbolos. Los círculos (○ ◑ ★) no se explicaban en
                ninguna parte y las etiquetas SRS solo tenían un title=, que
                con el dedo no se puede leer. */}
            <button
              onClick={() => setShowLegend(!showLegend)}
              aria-expanded={showLegend}
              style={{
                marginBottom: 12, padding: '0 14px', minHeight: 44, borderRadius: 99,
                fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
                border: `1px solid ${showLegend ? J.sand : J.hair}`,
                background: showLegend ? J.sandBg : J.paperHi,
                color: showLegend ? J.sandDeep : J.mute,
              }}
            >
              {t('lesson_legend_toggle', '¿Qué significan los símbolos?')}
            </button>

            {showLegend && (
              <div className="rounded-xl p-3 mb-3 space-y-2"
                style={{ background: J.paperHi, border: `1px solid ${J.hair}` }}>
                {[
                  { s: <span style={{ color: J.mute2 }}>○</span>,  k: 'lesson_legend_unseen',   d: 'Aún no la has visto' },
                  { s: <span style={{ color: J.sand }}>◑</span>,   k: 'lesson_legend_seen',     d: 'Ya la has visto, aún no dominada' },
                  { s: <span style={{ color: J.red }}>★</span>,    k: 'lesson_legend_mastered', d: 'Dominada: la aciertas de forma constante' },
                ].map(row => (
                  <div key={row.k} className="flex items-center gap-3">
                    <span className="w-6 text-center flex-shrink-0" style={{ fontSize: '1rem' }}>{row.s}</span>
                    <p className="text-xs" style={{ color: J.inkSoft }}>{t(row.k, row.d)}</p>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${J.hair}`, paddingTop: 8 }}>
                  {[
                    { b: `✓ ${t('srs_badge_mastered', 'dominada')}`, k: 'srs_badge_mastered_title', d: 'Dominada — repaso en >3 semanas' },
                    { b: `🕐 ${t('srs_badge_due', 'hoy')}`,          k: 'srs_badge_due_title',      d: 'Toca repasarla hoy' },
                    { b: `🕐 ${t('srs_badge_tomorrow', 'mañana')}`,  k: 'lesson_legend_soon',       d: 'Su próximo repaso ya está programado' },
                    { b: `🐛 ${t('srs_badge_leech', 'rebelde')}`,    k: 'srs_badge_leech_title',    d: 'La has fallado varias veces seguidas — dale repaso' },
                  ].map(row => (
                    <div key={row.k} className="flex items-center gap-3 mt-2">
                      <span className="flex-shrink-0" style={{
                        fontSize: '0.6875rem', padding: '2px 6px', borderRadius: 6,
                        fontWeight: 600, background: J.paper, color: J.inkSoft,
                        border: `1px solid ${J.hair}`, whiteSpace: 'nowrap',
                      }}>{row.b}</span>
                      <p className="text-xs" style={{ color: J.inkSoft }}>{t(row.k, row.d)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {suppWords.length > 0 && (
              <button
                onClick={() => setShowSupp(!showSupp)}
                style={{
                  marginBottom: 12, padding: '0 14px', minHeight: 44, borderRadius: 99,
                  fontSize: '0.75rem', fontWeight: 700,
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
                          <ReadingAid kind="pinyin" className="text-sm" style={{ color: J.jade, fontWeight: 700 }}>{word.pinyin}</ReadingAid>
                          {word.type && (
                            <span style={{
                              fontSize: '0.6875rem', padding: '2px 6px', borderRadius: 6, fontWeight: 600,
                              background: J.sandBg, color: J.sandDeep,
                            }}>
                              {word.type}
                            </span>
                          )}
                          {word.isSupplementary && (
                            <span style={{
                              fontSize: '0.6875rem', padding: '2px 6px', borderRadius: 6, fontWeight: 600,
                              background: J.jadeBg, color: J.jadeDeep,
                            }}>extra</span>
                          )}
                          {/* Badge SRS: cuándo toca repasar (o "dominada" si interval ≥ 21d). */}
                          {review.kind === 'mastered' && (
                            <span style={{
                              fontSize: '0.6875rem', padding: '2px 6px', borderRadius: 6, fontWeight: 600,
                              background: J.jadeBg, color: J.jadeDeep,
                            }} title={t('srs_badge_mastered_title', 'Dominada — repaso en >3 semanas')}>
                              ✓ {t('srs_badge_mastered', 'dominada')}
                            </span>
                          )}
                          {review.kind === 'due' && (
                            <span style={{
                              fontSize: '0.6875rem', padding: '2px 6px', borderRadius: 6, fontWeight: 600,
                              background: J.redBg, color: J.redDeep,
                            }} title={t('srs_badge_due_title', 'Toca repasarla hoy')}>
                              🕐 {t('srs_badge_due', 'hoy')}
                            </span>
                          )}
                          {review.kind === 'soon' && (
                            <span style={{
                              fontSize: '0.6875rem', padding: '2px 6px', borderRadius: 6, fontWeight: 600,
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
                              fontSize: '0.6875rem', padding: '2px 6px', borderRadius: 6, fontWeight: 600,
                              background: J.redBg, color: J.redDeep,
                            }} title={t('srs_badge_leech_title', 'La has fallado varias veces seguidas — dale repaso')}>
                              🐛 {t('srs_badge_leech', 'rebelde')}
                            </span>
                          )}
                        </div>
                        <ReadingAid kind="translation" className="block text-sm font-medium mt-0.5 truncate" style={{ color: J.ink }}>{word.meaning}</ReadingAid>
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
                        onClick={e => { e.stopPropagation(); speakChinese && speakChinese({ hanzi: word.char, pinyin: word.pinyin, pinyinNumeric: word.pinyinNumeric }); }}
                        className="font-cn w-8 h-8 flex items-center justify-center rounded-full text-sm flex-shrink-0"
                        style={{ background: J.jadeBg, color: J.jadeDeep, border: 0, cursor: 'pointer', fontWeight: 700 }}
                      >
                        声
                      </button>
                    </div>

                    {isOpen && <WordExamples word={word} />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {tab === 'intro' && hasIntro && (
          <LessonIntroduction
            language={i18n.language}
            opening={<LessonStoryPreview language={i18n.language} preview={storyPreview} onOpenStory={onOpenStory} />}
            title={locationIntro.title}
            overview={introduction.overview}
            connection={isLocation ? locationIntro.connection : storyPreview.connection}
            goals={introduction.goals}
            vocabulary={isLocation ? locationComparison.vocabulary : undefined}
            examples={isLocation
              ? locationComparison.examples.map(({ question, parts, pinyin, translation, pattern }) => ({
                heading: question, hanzi: parts.join('') + '。', parts, pinyin, translation, explanation: pattern,
              }))
              : introWorkshop.examples.map(([hanzi, pinyin, translation], i) => ({
                heading: introduction.goals[i], hanzi, pinyin, translation, explanation: topicWorkshop[lessonNum][i].rule,
              }))}
            takeaway={isLocation ? locationIntro.order : undefined}
            path={isLocation ? locationIntro.path : locationIntro.generalPath}
            vocabularyLabel={t('lesson_tab_vocab')}
            onVocabulary={() => handleTabChange('vocab')}
          >
            {isLocation
              ? <LocationStudy title={loc(activity.title, i18n.language)} startLabel={loc(activity.start, i18n.language)} />
              : <TopicPractice lesson={lessonNum} guided title={loc(activity.title, i18n.language)}
                  description={loc(activity.intro, i18n.language)} startLabel={loc(activity.start, i18n.language)} />}
          </LessonIntroduction>
        )}

        {tab === 'study' && (
          <Suspense fallback={<div className="pt-6 text-center text-sm" style={{ color: J.mute }}>…</div>}>
            <StudyTab embedded characters={mainWords} speakChinese={speakChinese} onTrackSeen={onTrackSeen} goBack={() => handleTabChange('vocab')} />
          </Suspense>
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
            <Suspense fallback={null}>
              <TopicPractice key={lessonNum} lesson={lessonNum} />
            </Suspense>
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
