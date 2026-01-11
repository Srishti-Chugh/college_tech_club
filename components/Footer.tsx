
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white py-12 border-t border-gray-100">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-2 mb-6 md:mb-0">
          <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
            <span className="text-black font-black text-sm">G</span>
          </div>
          <span className="font-black text-lg tracking-tighter">GLOBALY</span>
        </div>
        
        <div className="flex space-x-8 text-[10px] font-black uppercase tracking-widest text-gray-500">
          <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-black transition-colors">Careers</a>
          <a href="#" className="hover:text-black transition-colors">Advertising</a>
        </div>

        <div className="mt-6 md:mt-0 text-[10px] font-black uppercase tracking-widest text-gray-400">
          © 2025 GLOBALY MAGAZINE. ALL RIGHTS RESERVED.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
