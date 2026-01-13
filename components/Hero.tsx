
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-[90vh] bg-black text-white pt-24 overflow-hidden flex flex-col justify-center items-center">
      {/* Background Decorative Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" viewBox="0 0 1000 1000">
        <path d="M-100 500 C 200 100, 800 900, 1100 500" stroke="white" fill="transparent" strokeWidth="1" />
        <path d="M-100 300 C 300 800, 700 200, 1100 700" stroke="white" fill="transparent" strokeWidth="1" />
      </svg>

      <div className="container mx-auto px-6 relative z-10 flex flex-col items-center">
        {/* Main Background Text */}
        <h1 className="text-[15vw] md:text-[12vw] font-black leading-none uppercase select-none outline-text absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-80 whitespace-nowrap">
          EXPLORE NOW
        </h1>

        {/* Stacked Cards */}
        <div className="relative w-72 h-96 md:w-80 md:h-[450px]">
          {/* Back Cards */}
          <div className="absolute inset-0 bg-yellow-400 rounded-2xl rotate-[-8deg] translate-x-4 translate-y-2 opacity-80 shadow-2xl"></div>
          <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-2xl rotate-[5deg] -translate-x-4 -translate-y-2 border border-white/20 shadow-2xl"></div>
          
          {/* Main Card */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group cursor-pointer">
            <img 
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800" 
              alt="Fashion Hero" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            {/* Explore Button on Image */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
              <button className="bg-white text-black px-6 py-3 rounded-full flex items-center space-x-3 shadow-lg hover:pr-8 transition-all duration-300">
                <span className="text-sm font-bold uppercase">Explore</span>
                <div className="bg-indigo-600 rounded-full p-1.5 text-white">
                  <ArrowUpRight size={18} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Metadata */}
        <div className="w-full mt-12 flex flex-col md:flex-row justify-between items-end md:items-center px-4 max-w-6xl">
          <div className="text-left max-w-xs mb-6 md:mb-0">
            <p className="text-gray-400 text-sm leading-relaxed">
              Check out a bunch of fun and uplifting <span className="text-yellow-400 font-bold">STORIES</span> that'll inspire you, keep you in the loop, and definitely make you smile!
            </p>
          </div>
          <div className="text-right text-xs font-bold tracking-widest text-gray-400 uppercase leading-loose">
            <p>FASHION /</p>
            <p className="text-yellow-400">2025 /</p>
            <p>TRENDING /</p>
            <p>POPULAR</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
