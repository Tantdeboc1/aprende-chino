// src/components/ui/Header.jsx
import { Menu, BookOpen } from "lucide-react";

export default function Header({ 
  onSidebarToggle,
  onDictionaryClick,
}) {
  return (
    <header className="bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50 border-b border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        
        <button
          onClick={onSidebarToggle}
          className="p-2 hover:bg-gray-700 rounded-lg transition"
          title="Menú de navegación"
        >
          <Menu className="w-5 h-5 text-gray-300" />
        </button>

        <div className="flex items-center gap-2">
          <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">学</span>
          </div>
          <span className="text-lg font-bold text-white">Aprende Chino</span>
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