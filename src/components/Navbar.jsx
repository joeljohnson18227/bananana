import { Link, NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';
import { MenuIcon } from './Icons.jsx';

function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Invisible hover trigger zone centered at the top of the viewport */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-3xl h-6 bg-transparent pointer-events-auto peer/trigger" />

      {/* Floating Navbar container */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-3xl pointer-events-none transition-all duration-300 ease-in-out transform -translate-y-24 opacity-0 peer-hover/trigger:translate-y-4 peer-hover/trigger:opacity-100 hover:translate-y-4 hover:opacity-100 peer-hover/trigger:pointer-events-auto hover:pointer-events-auto peer/nav">
        <header className="w-full bg-charcoal-900 rounded-full h-16 px-4 flex items-center justify-between border border-charcoal-900/50 shadow-md pointer-events-auto">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full p-2 text-warm-cream hover:bg-pitch-black lg:hidden cursor-pointer"
              onClick={onMenuClick}
              aria-label="Toggle menu"
            >
              <MenuIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <Link className="flex items-center gap-2" to="/">
              <div className="w-8 h-8 rounded-[8px] bg-ember-orange flex items-center justify-center font-black text-pitch-black text-xs font-oldschoolgrotesk tracking-tighter">
                B
              </div>
              <span className="font-oldschoolgrotesk font-black text-sm tracking-wider text-warm-cream uppercase hidden sm:inline">
                BANANANA
              </span>
            </Link>
          </div>

          <nav
            className="flex items-center gap-4 text-xs font-medium tracking-wider text-warm-cream font-aeonik"
            aria-label="Primary navigation"
          >
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs text-warm-cream/80 hidden md:block">
                  {user.name}
                </span>
                <button
                  className="rounded-full border border-acid-lime/40 text-acid-lime hover:bg-acid-lime hover:text-pitch-black px-4 py-1.5 text-xs font-bold transition-all uppercase cursor-pointer"
                  type="button"
                  onClick={logout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <NavLink
                  className={({ isActive }) =>
                    isActive ? 'text-acid-lime' : 'hover:text-acid-lime text-warm-cream/80 transition-colors uppercase text-[11px] font-semibold tracking-widest'
                  }
                  to="/login"
                >
                  Login
                </NavLink>
                <Link
                  className="rounded-full border border-acid-lime text-acid-lime hover:bg-acid-lime hover:text-pitch-black px-5 py-2 text-[11px] font-bold tracking-widest uppercase transition-all duration-300"
                  to="/register"
                >
                  Register ↗
                </Link>
              </div>
            )}
          </nav>
        </header>
      </div>

      {/* Tiny visual handle/cue centered at the top of the viewport */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-35 w-20 h-1.5 bg-acid-lime/75 rounded-b-full pointer-events-none transition-all duration-300 opacity-100 translate-y-0 peer-hover/trigger:opacity-0 peer-hover/trigger:-translate-y-2 peer-hover/nav:opacity-0 peer-hover/nav:-translate-y-2 animate-pulse" />
    </>
  );
}

export default Navbar;