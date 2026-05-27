// src/components/LessonSelector.jsx
import { useState } from "react";
import { useTranslation } from 'react-i18next';

const LESSON_STYLES = {
  1: { border: 'border-[#c8392f]', activeBg: 'bg-[#c8392f]', hoverBorder: 'hover:border-[#c8392f]', glow: 'shadow-[#c8392f]/30', text: 'text-[#c8392f]', titleColor: 'text-[#c8392f]', num: '一' },
  2: { border: 'border-[#b88a3e]', activeBg: 'bg-[#b88a3e]', hoverBorder: 'hover:border-[#b88a3e]', glow: 'shadow-[#b88a3e]/30', text: 'text-[#b88a3e]', titleColor: 'text-[#b88a3e]', num: '二' },
  3: { border: 'border-[#b88a3e]', activeBg: 'bg-[#b88a3e]', hoverBorder: 'hover:border-[#b88a3e]', glow: 'shadow-[#b88a3e]/30', text: 'text-[#b88a3e]', titleColor: 'text-[#b88a3e]', num: '三' },
  4: { border: 'border-[#2f6b4a]', activeBg: 'bg-[#2f6b4a]', hoverBorder: 'hover:border-[#2f6b4a]', glow: 'shadow-[#2f6b4a]/30', text: 'text-[#2f6b4a]', titleColor: 'text-[#5a8f72]', num: '四' },
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
    <div className="min-h-screen bg-[#f4ecdc] flex flex-col items-center justify-center p-4">

      {/* Cabecera */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-4"></div>

        {/* Input de nombre — solo si no hay nombre guardado */}
        {needsName ? (
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#1c1813] mb-2">{t('selector_welcome')}</h1>
            <p className="text-[#928a76] mb-4">{t('selector_name_prompt')}</p>
            <input
              type="text"
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canConfirm && handleConfirm()}
              placeholder={t('selector_name_placeholder')}
              autoFocus
              className="w-full max-w-xs mx-auto block px-4 py-3 rounded-xl bg-[#fbf5e6] border-2 border-[rgba(28,24,19,0.18)] focus:border-[#c8392f] focus:outline-none text-[#1c1813] text-center text-lg placeholder-[#928a76]"
            />
          </div>
        ) : (
          <h1 className="text-3xl font-bold text-[#1c1813] mb-2">
            {effectiveName ? t('selector_greeting_with_name', { name: effectiveName }) : t('selector_greeting_no_name')}
          </h1>
        )}

        {!needsName && (
          <p className="text-[#928a76]">
            {t('selector_choose_lesson')}
          </p>
        )}
        {needsName && nameInput.trim() && (
          <p className="text-[#928a76] mt-2">
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
                  : `bg-[#fbf5e6] ${s.border} ${s.hoverBorder} hover:scale-102`
                }
              `}
            >
              <span className={`text-4xl font-bold mb-1 ${isSelected ? 'text-[#fbf5e6]' : s.text}`}>
                {s.num}
              </span>
              <span className={`text-xs font-semibold uppercase tracking-widest mb-3 ${isSelected ? 'text-[#fbf5e6]/80' : 'text-[#928a76]'}`}>
                {t('selector_lesson', { num: l.lesson })}
              </span>
              <p className={`text-center text-xs leading-tight mb-3 ${isSelected ? 'text-[#fbf5e6]/90' : s.titleColor}`}>
                {l.titleEs}
              </p>
              <div className={`text-xs ${isSelected ? 'text-[#fbf5e6]/70' : 'text-[#928a76]'}`}>
                {t('selector_words_count', { count: main })}{supp > 0 && <span> {t('selector_extra_count', { count: supp })}</span>}
              </div>
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-white/30 rounded-full flex items-center justify-center">
                  <span className="text-[#fbf5e6] text-xs font-bold">✓</span>
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
            ? 'bg-[#bdb39a] border-[#928a76] text-[#1c1813]'
            : 'bg-[#fbf5e6] border-[rgba(28,24,19,0.10)] text-[#928a76] hover:border-[rgba(28,24,19,0.18)] hover:text-[#5b5446]'
          }
        `}
      >
        {selected === null ? '✓ ' : ''}{t('selector_all_lessons', { count: allCharacters.filter(c => !c.isSupplementary).length })}
      </button>

      {/* Confirmar */}
      <button
        onClick={handleConfirm}
        disabled={!canConfirm}
        className="px-10 py-4 bg-[#c8392f] hover:bg-[#8b1f1a] disabled:bg-[#f8f1de] disabled:text-[#928a76] disabled:cursor-not-allowed text-[#fbf5e6] font-bold text-lg rounded-xl shadow-lg shadow-[#c8392f]/30 transition-all duration-200 hover:scale-105 disabled:scale-100"
      >
        {selected !== null
          ? t('selector_confirm_lesson', { num: selected })
          : t('selector_confirm_all')
        }
      </button>

      <p className="text-[#928a76] text-xs mt-4 text-center max-w-sm">
        {t('selector_change_hint')}
      </p>
    </div>
  );
}
