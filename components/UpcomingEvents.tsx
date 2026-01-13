
import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const UpcomingEvents: React.FC = () => {
  return (
    <section className="py-20 bg-[#f8f8f8]">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-black uppercase text-center mb-16">Upcoming Events</h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Hero Featured */}
          <div className="lg:col-span-6 relative h-[600px] rounded-[40px] overflow-hidden group">
            <img
              src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&q=80&w=1000"
              alt="Space"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-10 w-full">
              <div className="flex items-center space-x-4 mb-4 text-[10px] font-bold uppercase text-white/70">
                <span className="bg-indigo-600 text-white px-2 py-1 rounded">Technology</span>
                <span>8 min read</span>
                <span>20 Jan, 2025</span>
              </div>
              <h3 className="text-3xl md:text-4xl font-black uppercase text-white leading-tight mb-4">
                Updates on space exploration and discoveries
              </h3>
            </div>
          </div>

          {/* Right Column Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 gap-8">
            {/* Top row with image and text info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative h-48 rounded-[30px] overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=600" alt="Style" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white text-3xl font-black uppercase tracking-widest">Life+Style</span>
                </div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase mb-2">
                  <span className="text-indigo-600">Lifestyle</span>
                  <span className="text-gray-400">• 10 Jan, 2025</span>
                </div>
                <h4 className="text-xl font-black uppercase leading-tight mb-4">
                  The ultimate guide to creating a standout portfolio in 2024
                </h4>
                <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest group">
                  <span>Read Now</span>
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowUpRight size={12} />
                  </div>
                </button>
              </div>
            </div>

            {/* Second row with image and text info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative h-48 rounded-[30px] overflow-hidden bg-pink-500 flex items-center justify-center group cursor-pointer">
                <img src="https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=600" alt="Gaming" className="w-full h-full object-cover mix-blend-overlay group-hover:scale-110 transition-transform" />
                <div className="absolute text-white font-black text-4xl uppercase opacity-20">Gaming</div>
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase mb-2">
                  <span className="text-indigo-600">Gaming</span>
                  <span className="text-gray-400">• 15 Jan, 2025</span>
                </div>
                <h4 className="text-xl font-black uppercase leading-tight mb-4">
                  Game reviews, updates, and community highlights
                </h4>
                <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest group">
                  <span>Read Now</span>
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowUpRight size={12} />
                  </div>
                </button>
              </div>
            </div>

            {/* Third row with image and text info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative h-48 rounded-[30px] overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=600" alt="Nature" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center space-x-2 text-[10px] font-black uppercase mb-2">
                  <span className="text-indigo-600">Nature</span>
                  <span className="text-gray-400">• 18 Jan, 2025</span>
                </div>
                <h4 className="text-xl font-black uppercase leading-tight mb-4">
                  Sustainability and climate change topics
                </h4>
                <button className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest group">
                  <span>Read Now</span>
                  <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ArrowUpRight size={12} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UpcomingEvents;
