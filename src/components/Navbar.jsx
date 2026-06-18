import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { MenuIcon } from './Icons.jsx';

function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="rounded-md p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
            onClick={onMenuClick}
            aria-label="Toggle menu"
            aria-expanded="false"
          >
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <Link className="text-xl font-bold text-slate-950" to="/">
            CCMS
          </Link>
        </div>

        <nav
          className="flex items-center gap-4 text-sm font-medium text-slate-600"
          aria-label="Primary navigation"
        >
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 hidden sm:block">
                {user.name}
              </span>
              <button
                className="text-blue-700 hover:text-blue-900"
                type="button"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <NavLink
                className={({ isActive }) =>
                  isActive ? 'text-blue-700' : 'hover:text-slate-950'
                }
                to="/login"
              >
                Login
              </NavLink>
              <Link
                className="rounded-md bg-blue-700 px-3 py-2 text-white hover:bg-blue-800"
                to="/register"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;