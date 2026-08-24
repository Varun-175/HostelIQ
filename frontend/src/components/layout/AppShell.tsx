import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  return (
    <div className="app-canvas flex h-screen overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden animate-fade-in" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) lg:static lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex flex-1 flex-col overflow-hidden relative">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="relative flex-1 overflow-y-auto overflow-x-hidden p-6 sm:p-8 lg:p-10 scroll-smooth">
          {/* Subtle grid background pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(148,163,184,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,.08)_1px,transparent_1px)] [background-size:24px_24px] [mask-image:linear-gradient(to_bottom,white_20%,transparent_90%)]" />
          
          <div className="relative mx-auto max-w-[1440px] animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
