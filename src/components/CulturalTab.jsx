// src/components/CulturalTab.jsx
// Tab de notas culturales con tarjetas expandibles
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import culturalData from '@/data/culturalData.js';

export default function CulturalTab({ lessonNum, accent }) {
  const { t } = useTranslation();
  const [openId, setOpenId] = useState(null);

  const notes = culturalData[lessonNum] || [];

  if (notes.length === 0) {
    return (
      <div className="pt-4 text-center py-12">
        <p className="text-4xl mb-3">🌏</p>
        <p className="text-gray-400 text-sm">{t('culture_not_available')}</p>
      </div>
    );
  }

  return (
    <div className="pt-3 space-y-3">
      <p className="text-xs text-gray-500 px-1">
        {t('culture_intro_text')}
      </p>

      {notes.map(note => {
        const isOpen = openId === note.id;
        return (
          <div
            key={note.id}
            className={`rounded-xl border transition-all duration-200 overflow-hidden cursor-pointer ${
              isOpen
                ? `border-gray-600 bg-gray-800 ring-1 ring-gray-500`
                : 'border-gray-700 bg-gray-800 hover:border-gray-600'
            }`}
            onClick={() => setOpenId(isOpen ? null : note.id)}
          >
            {/* Cabecera siempre visible */}
            <div className="flex items-center gap-3 p-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl flex-shrink-0 ${accent?.icon || 'bg-gray-700'}`}>
                {note.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm leading-snug">{note.title}</p>
              </div>
              <svg
                className={`flex-shrink-0 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </div>

            {/* Contenido expandido */}
            {isOpen && (
              <div className="px-4 pb-4 pt-0 border-t border-gray-700">
                <p className="text-gray-300 text-sm leading-relaxed mt-3">
                  {note.content}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
