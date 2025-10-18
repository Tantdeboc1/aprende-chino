// src/components/ui/Header.jsx
import { Menu, BookOpen } from "lucide-react";

export default function Header({
  onSidebarToggle,
  onDictionaryClick,
  onHomeClick, // ← NUEVA PROP
}) {
  return (
    <header className="bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50 border-b border-gray-700 rounded-b-2xl">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">

        <button
          onClick={onSidebarToggle}
          className="p-2 hover:bg-gray-700 rounded-lg transition"
          title="Menú de navegación"
        >
          <Menu className="w-5 h-5 text-gray-300" />
        </button>

        {/* Texto "Aprende Chino" - Clickable pero no parece botón */}
        <div
          onClick={onHomeClick}
          className="flex items-center gap-2 group cursor-pointer"
          title="Volver al inicio"
        >
          <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
            <span className="text-white font-bold text-lg">学</span>
          </div>
          <span className="text-lg font-bold text-white group-hover:text-gray-200 transition-colors">
            Aprende Chino
          </span>
        </div>

        <button
          onClick={onDictionaryClick}
          className="px-3 py-1 hover:bg-gray-700 rounded-lg transition text-gray-300 font-medium"
        >
          Diccionario
        </button>
      </div>
    </header>
  );
}
