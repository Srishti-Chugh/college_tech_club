
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const SubscriptionBanner: React.FC = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <div className="bg-[#ffff99] rounded-[50px] p-10 md:p-20 relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
          {/* Decorative Squiggly Line */}
          <svg className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full opacity-20" viewBox="0 0 800 200" fill="none">
            <path d="M50 100 C 150 0, 250 200, 350 100 S 550 0, 750 100" stroke="black" strokeWidth="2" strokeDasharray="5 5" />
          </svg>

          <div className="relative z-10 md:w-1/2 mb-10 md:mb-0">
            <h2 className="text-4xl md:text-6xl font-black uppercase leading-tight text-black mb-10">
              Get access to exclusive content - subscribe now!
            </h2>
            <div className="flex flex-col space-y-6">
              <button className="bg-black text-white w-fit px-8 py-4 rounded-full flex items-center space-x-3 hover:scale-105 transition-transform group">
                <span className="text-sm font-bold uppercase">Try Now</span>
                <div className="bg-[#ffff99] rounded-full p-1.5 text-black">
                  <ArrowUpRight size={18} />
                </div>
              </button>

              <div className="border-t border-black/10 pt-6">
                <span className="text-[10px] font-black uppercase block mb-1">01 Exclusive access to premium content</span>
                <p className="text-xs text-black/60 max-w-sm">
                  As a valued subscriber, you'll unlock a world of exclusive content, deep dives, and early access to our most compelling stories.
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 md:w-1/3">
            <div className="relative">
              {/* Backing circle/shape */}
              <div className="absolute inset-0 bg-black/5 rounded-full blur-3xl scale-125"></div>
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600"
                alt="Portrait"
                className="relative z-10 w-full h-auto rounded-full object-cover grayscale-0"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SubscriptionBanner;
