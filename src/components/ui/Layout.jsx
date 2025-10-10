// src/components/ui/Layout.jsx
import { useState } from "react";
import Header from "./Header.jsx";
import Sidebar from "./Sidebar.jsx";

export default function Layout({ 
  children, 
  onDictionaryClick,
  onNavigate
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Header 
        onSidebarToggle={() => setSidebarOpen(true)}
        onDictionaryClick={onDictionaryClick}
      />
      
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onNavigate={onNavigate}
      />

      <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 pt-12">
        {children}
      </div>
    </>
  );
}