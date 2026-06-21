import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import Navbar from '../components/Navbar.jsx';
import Sidebar from '../components/Sidebar.jsx';

function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const contentPadding = isMobile ? '' : sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        isMobile={isMobile}
      />
      <div className={`transition-all duration-300 ${contentPadding}`}>
        <main className="pt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;