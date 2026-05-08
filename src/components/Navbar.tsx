import React, { useEffect, useRef, useState } from 'react';
import { Menu, Globe, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import ByteLabLogo from './ByteLabLogo';
import { auth, signOut } from '../firebase';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  showLogo?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ showLogo = true }) => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [menuOpen]);

  const initial =
    user?.displayName?.trim()?.charAt(0)?.toUpperCase() ??
    user?.email?.charAt(0)?.toUpperCase() ??
    '?';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
      <div className="flex items-center space-x-8">
        <div className="flex space-x-6 text-xs font-bold uppercase tracking-widest hidden md:flex">
          <Link to="/" className="hover:text-yellow-400 transition-colors">Home</Link>
          <a href="#" className="hover:text-yellow-400 transition-colors">Shop</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Events</a>
        </div>
      </div>

      <div
        className="absolute left-1/2 -translate-x-1/2 transition-opacity duration-500"
        style={{ opacity: showLogo ? 1 : 0 }}
      >
        <ByteLabLogo size="sm" darkBg />
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <button type="button" className="flex items-center space-x-1 text-xs font-bold uppercase">
          <Globe size={14} />
          <span>EN</span>
          <span className="text-[10px] ml-1 opacity-50">▼</span>
        </button>
        <button type="button" className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full flex items-center space-x-2 transition-all">
          <Menu size={18} />
          <span className="text-xs font-bold uppercase hidden sm:inline">Menu</span>
        </button>
        {user && (
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex rounded-full ring-2 ring-white/20 hover:ring-yellow-400/80 transition-all overflow-hidden"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              title={user.email ?? 'Account'}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-9 h-9 object-cover" />
              ) : (
                <span className="w-9 h-9 bg-yellow-400 text-black text-sm font-black flex items-center justify-center">
                  {initial}
                </span>
              )}
            </button>
            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full mt-2 w-48 py-1 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-xl z-[60]"
              >
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">Signed in</p>
                  <p className="text-xs text-white/90 truncate">{user.email}</p>
                </div>
                <button
                  type="button"
                  role="menuitem"
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wide text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                  onClick={async () => {
                    setMenuOpen(false);
                    await signOut(auth);
                  }}
                >
                  <LogOut size={14} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
