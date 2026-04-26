// src/components/ui/Layout.jsx
import BottomNav from './BottomNav.jsx';

export default function Layout({ children, activeScreen, onNavigate }) {
  return (
    <>
      <div className="min-h-screen bg-gray-900 text-white">
        {children}
      </div>
      <BottomNav activeScreen={activeScreen} onNavigate={onNavigate} />
    </>
  );
}
