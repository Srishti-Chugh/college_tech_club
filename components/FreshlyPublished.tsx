
import React from 'react';
import { ArrowUpRight, Clock, Calendar } from 'lucide-react';
import { Article } from '../types';

const ARTICLES: Article[] = [
  {
    id: '1',
    title: 'DESTINATIONS, TIPS, AND TRAVEL STORIES.',
    category: 'Travel',
    categoryColor: 'bg-yellow-200',
    readTime: '8 min read',
    date: '20 Jan, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '2',
    title: 'ALBUM RELEASES, ARTIST INTERVIEWS, AND PLAYLISTS',
    category: 'Music',
    categoryColor: 'bg-pink-200',
    readTime: '8 min read',
    date: '20 Jan, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '3',
    title: 'PRESIDENT TRUMP AND THE FIRST LADY IN INDIA',
    category: 'Politics',
    categoryColor: 'bg-indigo-200',
    readTime: '8 min read',
    date: '20 Jan, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1580130775562-0ef92da028de?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: '4',
    title: 'COVERAGE OF EVENTS, ATHLETES, AND ANALYSIS',
    category: 'Sports',
    categoryColor: 'bg-green-200',
    readTime: '8 min read',
    date: '20 Jan, 2025',
    imageUrl: 'https://images.unsplash.com/photo-1461896756985-212257850904?auto=format&fit=crop&q=80&w=600',
  },
];

const FreshlyPublished: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-tight">
              FRESHLY<br />PUBLISHED
            </h2>
          </div>
          <div className="mt-6 md:mt-0 max-w-xs text-right">
            <p className="text-sm font-medium mb-4">For readers focused on staying at the forefront of progress</p>
            <button className="group flex items-center space-x-2 border border-black/20 rounded-full pl-6 pr-2 py-2 hover:bg-black hover:text-white transition-all">
              <span className="text-xs font-bold uppercase">View All Articles</span>
              <div className="bg-black text-white p-2 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                <ArrowUpRight size={16} />
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {ARTICLES.map((article) => (
            <div key={article.id} className="group cursor-pointer">
              <div className="relative h-96 mb-6 overflow-hidden rounded-3xl">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-lg font-black uppercase mb-4 leading-snug group-hover:text-indigo-600 transition-colors">
                {article.title}
              </h3>
              <div className="flex items-center flex-wrap gap-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <span className={`${article.categoryColor} text-black px-2 py-1 rounded`}>{article.category}</span>
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={12} />
                  <span>{article.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FreshlyPublished;
