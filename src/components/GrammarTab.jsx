// src/components/GrammarTab.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

function PatternCard({ pattern, accent }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl bg-gray-800 border border-gray-700 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <div className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg ${accent.icon} flex items-center justify-center`}>
          <span className="text-white text-xs font-bold">结</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-white font-bold text-base leading-tight">{pattern.pattern}</span>
            <svg
              className={`text-gray-500 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            >
              <path d="M6 9l6 6 6-6"/>
            </svg>
          </div>
          <p className={`text-sm mt-0.5 ${accent.text}`}>{pattern.pinyin}</p>
          <p className="text-gray-300 text-sm mt-0.5 italic">"{pattern.translation}"</p>
        </div>
      </button>

      {open && (
        <div className="px-4 pb-4 border-t border-gray-700 pt-3 space-y-3">
          <p className="text-gray-300 text-sm leading-relaxed">{pattern.explanation}</p>
          {pattern.examples?.length > 0 && (
            <div className="space-y-2">
              {pattern.examples.map((ex, i) => (
                <div key={i} className="bg-gray-700/50 rounded-lg p-3">
                  <p className="text-white text-base font-medium">{ex.zh}</p>
                  <p className={`text-xs mt-0.5 ${accent.text}`}>{ex.pinyin}</p>
                  <p className="text-gray-400 text-xs mt-0.5 italic">{ex.es}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StructureCard({ structure, accent }) {
  return (
    <div className="rounded-xl bg-gray-800 border border-gray-700 p-4">
      <h4 className="text-white font-semibold text-sm mb-2">{structure.title}</h4>
      {/* Formula box */}
      <div className={`rounded-lg border ${accent.border} bg-gray-900/60 px-3 py-2 mb-3`}>
        <p className={`text-sm font-mono font-bold tracking-wide ${accent.light}`}>{structure.formula}</p>
      </div>
      <div className="bg-gray-700/40 rounded-lg p-3 mb-2">
        <p className="text-white text-base">{structure.example}</p>
        <p className={`text-xs mt-0.5 ${accent.text}`}>{structure.examplePinyin}</p>
        <p className="text-gray-400 text-xs mt-0.5 italic">{structure.exampleEs}</p>
      </div>
      {structure.note && (
        <p className="text-gray-400 text-xs leading-relaxed">{structure.note}</p>
      )}
    </div>
  );
}

export default function GrammarTab({ grammarData, accent }) {
  const { t } = useTranslation();

  if (!grammarData) {
    return (
      <div className="pt-4 text-center text-gray-500 text-sm">
        {t('grammar_not_available', 'Grammar content not available yet.')}
      </div>
    );
  }

  return (
    <div className="pt-2 space-y-6 pb-4">

      {/* Intro */}
      {grammarData.intro && (
        <div className={`rounded-xl bg-gray-800 border-l-4 ${accent.border} border border-gray-700 p-4`}>
          <p className="text-gray-300 text-sm leading-relaxed">{grammarData.intro}</p>
        </div>
      )}

      {/* Patrones gramaticales */}
      {grammarData.patterns?.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">
            {t('grammar_section_patterns', 'Key Patterns')}
          </p>
          <div className="space-y-2">
            {grammarData.patterns.map(p => (
              <PatternCard key={p.id} pattern={p} accent={accent} />
            ))}
          </div>
        </div>
      )}

      {/* Estructuras clave */}
      {grammarData.structures?.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 px-1">
            {t('grammar_section_structures', 'Sentence Structures')}
          </p>
          <div className="space-y-3">
            {grammarData.structures.map(s => (
              <StructureCard key={s.id} structure={s} accent={accent} />
            ))}
          </div>
        </div>
      )}

      {/* Tip */}
      {grammarData.tip && (
        <div className="rounded-xl bg-yellow-900/20 border border-yellow-700/40 p-4">
          <p className="text-yellow-300 text-sm leading-relaxed">{grammarData.tip}</p>
        </div>
      )}

    </div>
  );
}
