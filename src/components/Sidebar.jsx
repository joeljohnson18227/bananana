import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { MenuIcon, XIcon, HomeIcon, UserIcon, ShieldCheckIcon, ChartBarIcon, InboxIcon, CogIcon } from './Icons.jsx';

const navigation = [
  { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon, roles: ['student', 'admin'] },
  { name: 'My Complaints', href: '/student/complaints', icon: InboxIcon, roles: ['student'] },
  { name: 'Submit Complaint', href: '/student/submit', icon: ChartBarIcon, roles: ['student'] },
  { name: 'All Complaints', href: '/admin/complaints', icon: InboxIcon, roles: ['admin'] },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, roles: ['admin'] },
  { name: 'Users', href: '/admin/users', icon: UserIcon, roles: ['admin'] },
  { name: 'Component Test', href: '/admin/test-components', icon: ShieldCheckIcon, roles: ['admin'] },
  { name: 'Settings', href: '/settings', icon: CogIcon, roles: ['student', 'admin'] },
];

function Sidebar({ isOpen, onClose, user }) {
  const location = useLocation();
  const userRole = user?.role || 'student';

  const filteredNav = navigation.filter((item) => item.roles.includes(userRole));

  return (
    <>
      <button
        type="button"
        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        onClick={onClose}
        aria-label="Close sidebar"
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
            <NavLink
              to="/"
              className="text-xl font-bold text-slate-950"
              aria-label="CCMS Home"
            >
              CCMS
            </NavLink>
            <button
              type="button"
              className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
              onClick={onClose}
              aria-label="Close sidebar"
            >
              <XIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          <nav className="flex-1 space-y-1 p-4 overflow-y-auto" aria-label="Main navigation">
            {filteredNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
                onClick={onClose}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                <UserIcon className="h-5 w-5" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {user?.name || 'Guest User'}
                </p>
                <p className="text-xs text-slate-500 capitalize">{userRole}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;