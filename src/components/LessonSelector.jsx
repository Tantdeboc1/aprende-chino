// src/components/LessonSelector.jsx
import { useState } from "react";
import { useTranslation } from 'react-i18next';

const LESSON_STYLES = {
  1: { border: 'border-red-600', activeBg: 'bg-red-600', hoverBorder: 'hover:border-red-500', glow: 'shadow-red-900/50', text: 'text-red-400', titleColor: 'text-red-300', num: '一' },
  2: { border: 'border-orange-600', activeBg: 'bg-orange-600', hoverBorder: 'hover:border-orange-500', glow: 'shadow-orange-900/50', text: 'text-orange-400', titleColor: 'text-orange-300', num: '二' },
  3: { border: 'border-yellow-500', activeBg: 'bg-yellow-500', hoverBorder: 'hover:border-yellow-400', glow: 'shadow-yellow-900/50', text: 'text-yellow-400', titleColor: 'text-yellow-300', num: '三' },
  4: { border: 'border-green-600', activeBg: 'bg-green-600', hoverBorder: 'hover:border-green-500', glow: 'shadow-green-900/50', text: 'text-green-400', titleColor: 'text-green-300', num: '四' },
};

export default function LessonSelector({
  userName,
  onSetUserName,
  lessonsData = [],
  allCharacters = [],
  onSelect,
}) {
  const { t } = useTranslation();
  const [selected, setSelected] = useState(null);
  const [nameInput, setNameInput] = useState('');

  const needsName = !userName;
  const effectiveName = userName || nameInput.trim();

  const countByLesson = (lessonNum) =>
    allCharacters.filter(c => c.lesson === lessonNum && !c.isSupplementary).length;
  const suppCount = (lessonNum) =>
    allCharacters.filter(c => c.lesson === lessonNum && c.isSupplementary).length;

  const handleConfirm = () => {
    if (needsName && !nameInput.trim()) return;
    if (needsName) onSetUserName(nameInput.trim());
    onSelect(selected, needsName ? nameInput.trim() : null);
  };

  const canConfirm = (!needsName || nameInput.trim().length > 0);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">

      {/* Cabecera */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-4">📚</div>

        {/* Input de nombre — solo si no hay nombre guardado */}
        {needsName ? (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">{t('selector_welcome')}</h1>
            <p className="text-gray-400 mb-4">{t('selector_name_prompt')}</p>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canConfirm && handleConfirm()}
              placeholder={t('selector_name_placeholder')}
              autoFocus
              className="w-full max-w-xs mx-auto block px-4 py-3 rounded-xl bg-gray-800 border-2 border-gray-600 focus:border-red-500 focus:outline-none text-white text-center text-lg placeholder-gray-500"
            />
          </div>
        ) : (
          <h1 className="text-3xl font-bold text-white mb-2">
            {effectiveName ? t('selector_greeting_with_name', { name: effectiveName }) : t('selector_greeting_no_name')}
          </h1>
        )}

        {!needsName && (
          <p className="text-gray-400">
            {t('selector_choose_lesson')}
          </p>
        )}
        {needsName && nameInput.trim() && (
          <p className="text-gray-400 mt-2">
            {t('selector_name_preview', { name: nameInput.trim() })}
          </p>
        )}
      </div>

      {/* Tarjetas de lección */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-3xl mb-6">
        {lessonsData.map(l => {
          const s = LESSON_STYLES[l.lesson] || LESSON_STYLES[1];
          const isSelected = selected === l.lesson;
          const main = countByLesson(l.lesson);
          const supp = suppCount(l.lesson);

          return (
            <button
              key={l.lesson}
              onClick={() => setSelected(isSelected ? null : l.lesson)}
              className={`
                relative flex flex-col items-center justify-center p-5 rounded-2xl border-2 transition-all duration-200
                ${isSelected
                  ? `${s.activeBg} border-transparent shadow-lg ${s.glow} scale-105`
                  : `bg-gray-800 ${s.border} ${s.hoverBorder} hover:scale-102`
                }
              `}
            >
              <span className={`text-4xl font-bold mb-1 ${isSelected ? 'text-white' : s.text}`}>
                {s.num}
              </span>
              <span className={`text-xs font-semibold uppercase tracking-widest mb-3 ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                {t('selector_lesson', { num: l.lesson })}
              </span>
              <p className={`text-center text-xs leading-tight mb-3 ${isSelected ? 'text-white/90' : s.titleColor}`}>
                {l.titleEs}
              </p>
              <div className={`text-xs ${isSelected ? 'text-white/70' : 'text-gray-500'}`}>
                {t('selector_words_count', { count: main })}{supp > 0 && <span> {t('selector_extra_count', { count: supp })}</span>}
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Todas las lecciones */}
      <button
        onClick={() => setSelected(null)}
        className={`
          w-full max-w-3xl py-3 px-6 rounded-xl border-2 text-sm font-semibold transition-all mb-8
          ${selected === null
            ? 'bg-gray-600 border-gray-400 text-white'
            : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300'
          }
        `}
      >
        {selected === null ? '✓ ' : ''}{t('selector_all_lessons', { count: allCharacters.filter(c => !c.isSupplementary).length })}
      </button>

      {/* Confirmar */}
      <button
        onClick={handleConfirm}
        disabled={!canConfirm}
        className="px-10 py-4 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed text-white font-bold text-lg rounded-xl shadow-lg shadow-red-900/50 transition-all duration-200 hover:scale-105 disabled:scale-100"
      >
        {selected !== null
          ? t('selector_confirm_lesson', { num: selected })
          : t('selector_confirm_all')
        }
      </button>

      <p className="text-gray-600 text-xs mt-4 text-center max-w-sm">
        {t('selector_change_hint')}
      </p>
    </div>
  );
}
