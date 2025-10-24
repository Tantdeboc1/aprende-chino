import { useState } from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout({
  children,
  onDictionaryClick,
  onNavigate,
  onHomeClick,
  onLearnWithSection,
  onDailyWithSection,
  onWritingClick // NUEVO PROP
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Header
        onSidebarToggle={toggleSidebar}
        onDictionaryClick={onDictionaryClick}
        onHomeClick={onHomeClick}
      />

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={onNavigate}
        onLearnWithSection={onLearnWithSection}
        onDailyWithSection={onDailyWithSection}
        onWritingClick={onWritingClick} // NUEVO PROP PASADO AL SIDEBAR
      />

      <div className="min-h-screen bg-gray-900 text-white pt-16">
        {children}
      </div>
    </>
  );
}
