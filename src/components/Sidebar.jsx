import { NavLink, useLocation } from 'react-router-dom';
import { XIcon, HomeIcon, UserIcon, ChartBarIcon, InboxIcon, CogIcon, ChevronLeftIcon, ChevronRightIcon } from './Icons.jsx';

const navigation = [
  { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon, roles: ['student'] },
  { name: 'My Complaints', href: '/student/complaints', icon: InboxIcon, roles: ['student'] },
  { name: 'Submit Complaint', href: '/student/submit', icon: ChartBarIcon, roles: ['student'] },
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, roles: ['admin'] },
  { name: 'All Complaints', href: '/admin/complaints', icon: InboxIcon, roles: ['admin'] },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, roles: ['admin'] },
  { name: 'Users', href: '/admin/users', icon: UserIcon, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: CogIcon, roles: ['student', 'admin'] },
];

function Sidebar({ isOpen, onClose, user, collapsed, onToggleCollapse, isMobile }) {
  const userRole = user?.role || 'student';
  const location = useLocation();

  const filteredNav = navigation.filter((item) => item.roles.includes(userRole));

  return (
    <>
      {isMobile && isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50"
          onClick={onClose}
          aria-label="Close sidebar"
        />
      )}
      <aside
        className={`
          z-50 transform bg-white border-r border-slate-200 transition-all duration-300 ease-in-out
          ${isMobile
            ? 'fixed inset-y-0 left-0 ' + (isOpen ? 'translate-x-0' : '-translate-x-full')
            : 'lg:fixed lg:top-[73px] lg:bottom-0 lg:left-0 lg:translate-x-0 ' + (collapsed ? 'w-20' : 'w-64')
          }
        `}
        aria-label="Sidebar"
        style={!isMobile ? { width: collapsed ? '5rem' : '16rem' } : undefined}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
            {!collapsed && !isMobile && (
              <NavLink
                to="/"
                className="text-xl font-bold text-slate-950"
                aria-label="CCMS Home"
              >
                CCMS
              </NavLink>
            )}
            <div className="flex items-center gap-2">
              {isMobile && (
                <button
                  type="button"
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                  onClick={onClose}
                  aria-label="Close sidebar"
                >
                  <XIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              )}
              {!isMobile && (
                <button
                  type="button"
                  className="rounded-md p-2 text-slate-500 hover:bg-slate-100"
                  onClick={onToggleCollapse}
                  aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                  {collapsed ? (
                    <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                  ) : (
                    <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                  )}
                </button>
              )}
            </div>
          </div>

          <nav className="flex-1 space-y-1 p-4 overflow-y-auto" aria-label="Main navigation">
            {filteredNav.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  onClick={onClose}
                  title={collapsed && !isMobile ? item.name : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                  {!collapsed && <span>{item.name}</span>}
                </NavLink>
              );
            })}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700 flex-shrink-0">
                <UserIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              {!collapsed && !isMobile && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user?.name || 'Guest User'}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">{userRole}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
