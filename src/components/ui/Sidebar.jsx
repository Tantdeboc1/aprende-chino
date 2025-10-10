// src/components/ui/Sidebar.jsx
import { X, Home, GraduationCap, Calendar, BookOpen, Info } from "lucide-react";
import { useEffect, useRef } from "react";

export default function Sidebar({ isOpen, onClose, onNavigate }) {
  const sidebarRef = useRef(null);

  const menuItems = [
    { icon: Home, label: "Inicio", screen: "menu" },
    { icon: GraduationCap, label: "Aprender", screen: "learn" },
    { icon: Calendar, label: "Desafío Diario", screen: "daily" },
    { icon: BookOpen, label: "Diccionario", screen: "dictionary" },
    { icon: Info, label: "Información", screen: "info" },
  ];

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        ref={sidebarRef}
        className="fixed top-0 left-0 h-full w-64 bg-gray-800 shadow-xl z-50 border-r border-gray-700"
      >
        <div className="p-4 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">学</span>
              </div>
              <span className="text-lg font-bold text-white">Navegación</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded transition"
            >
              <X className="w-5 h-5 text-gray-300" />
            </button>
          </div>
        </div>

        <nav className="p-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.screen}
                onClick={() => {
                  onNavigate(item.screen);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-700 rounded-lg transition border border-transparent hover:border-gray-600 text-gray-200"
              >
                <Icon className="w-5 h-5 text-red-400" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </>
  );
}