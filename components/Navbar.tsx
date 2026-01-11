
import React from 'react';
import { Menu, Globe } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm text-white px-6 py-4 flex items-center justify-between border-b border-white/10">
      <div className="flex items-center space-x-8">
        <div className="flex space-x-6 text-xs font-bold uppercase tracking-widest hidden md:flex">
          <a href="#" className="hover:text-yellow-400 transition-colors">Home</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Shop</a>
          <a href="#" className="hover:text-yellow-400 transition-colors">Events</a>
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2">
        <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
          <span className="text-black font-black text-xl">G</span>
        </div>
        <span className="font-black text-xl tracking-tighter">GLOBALY</span>
      </div>

      <div className="flex items-center space-x-6">
        <button className="flex items-center space-x-1 text-xs font-bold uppercase">
          <Globe size={14} />
          <span>EN</span>
          <span className="text-[10px] ml-1 opacity-50">▼</span>
        </button>
        <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full flex items-center space-x-2 transition-all">
          <Menu size={18} />
          <span className="text-xs font-bold uppercase">Menu</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
