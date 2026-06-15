import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-5 px-4 py-4 sm:px-6">
        <Link className="text-xl font-bold text-slate-950" to="/">
          CCMS
        </Link>

        <nav
          className="flex items-center gap-4 text-sm font-medium text-slate-600"
          aria-label="Primary navigation"
        >
          <NavLink
            className={({ isActive }) =>
              isActive ? 'text-blue-700' : 'hover:text-slate-950'
            }
            to="/student/dashboard"
          >
            Student
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? 'text-blue-700' : 'hover:text-slate-950'
            }
            to="/admin/dashboard"
          >
            Admin
          </NavLink>
          {user ? (
            <button
              className="text-blue-700 hover:text-blue-900"
              type="button"
              onClick={logout}
            >
              Logout
            </button>
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
