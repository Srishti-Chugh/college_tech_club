
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '../types';

const CATEGORIES: Category[] = [
  { id: '1', name: 'Competitive Programming', imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=500' },
  { id: '2', name: 'Machine Learning', imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c64b52d2?auto=format&fit=crop&q=80&w=500' },
  { id: '3', name: 'Development', imageUrl: 'https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&q=80&w=500' },
  { id: '4', name: 'Research', imageUrl: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=500' },
];

const OurTracks: React.FC = () => {
  return (
    <section id="tracks" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-4xl font-black uppercase">Our Tracks</h2>
          <div className="flex items-center space-x-3">
            <button className="w-10 h-10 border border-black/10 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-black/80 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat) => (
            <div key={cat.id} className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-xl">
              <img
                src={cat.imageUrl}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-xl font-black uppercase tracking-wider">{cat.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurTracks;
