import React, { useEffect, useState } from 'react';
import { ArrowUpRight, Clock, Calendar, Newspaper, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Article {
  id: string;
  title: string;
  type: 'blog' | 'news';
  category: string;
  categoryColor: string;
  readTime: string;
  date: string;
  imageUrl?: string;
  url?: string;
  author?: string;
  description?: string;
}

type Tab = 'all' | 'blog' | 'news';

const FeaturedBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Article[]>([]);
  const [news, setNews] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('all');

  useEffect(() => {
    fetch('/blogs.json')
      .then(r => r.json())
      .then((data: Article[]) => setBlogs(data))
      .catch(() => setBlogs([]));

    fetch('/news.json')
      .then(r => r.json())
      .then((data: Article[]) => setNews(data))
      .catch(() => setNews([]));
  }, []);

  const allArticles = [...news, ...blogs];
  const filtered = activeTab === 'all'
    ? allArticles.slice(0, 4)
    : allArticles.filter(a => a.type === activeTab).slice(0, 4);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'all', label: 'All', icon: null },
    { key: 'news', label: 'Weekly News', icon: <Newspaper size={12} /> },
    { key: 'blog', label: 'Blogs', icon: <BookOpen size={12} /> },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-tight">
              LATEST<br />READS
            </h2>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col items-end gap-4">
            <div className="flex items-center gap-1 bg-black/5 rounded-full p-1">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${
                    activeTab === tab.key
                      ? 'bg-black text-white'
                      : 'text-black/50 hover:text-black'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            <Link to="/explore" className="group flex items-center space-x-2 border border-black/20 rounded-full pl-6 pr-2 py-2 hover:bg-black hover:text-white transition-all">
              <span className="text-xs font-bold uppercase">Explore</span>
              <div className="bg-black text-white p-2 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                <ArrowUpRight size={16} />
              </div>
            </Link>
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-black/30 text-center italic py-12 font-medium">
            No articles yet — check back soon.
          </p>
        ) : activeTab === 'blog' ? (
          /* ── Blog list — text only, no images ── */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0">
            {filtered.map((article, idx) => (
              <a
                key={article.id}
                href={article.url || undefined}
                target={article.url ? '_blank' : undefined}
                rel={article.url ? 'noopener noreferrer' : undefined}
                className={`group block py-6 ${
                  idx < filtered.length - 1 ? 'border-b border-gray-100' : ''
                } hover:bg-gray-50 -mx-3 px-3 rounded-lg transition-colors`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className={`${article.categoryColor} text-black text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full`}>
                    {article.category}
                  </span>
                  <span className="text-[11px] text-gray-400">{article.date}</span>
                </div>
                <h3 className="text-lg font-black uppercase leading-snug mb-1.5 group-hover:text-indigo-600 transition-colors">
                  {article.title}
                </h3>
                {article.description && (
                  <p className="text-sm text-gray-400 leading-relaxed mb-3 line-clamp-2">
                    {article.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  {article.author && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500">
                        {article.author.charAt(0)}
                      </span>
                      {article.author}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {article.readTime}
                  </span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          /* ── News cards (or mixed "All") — with images ── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filtered.map((article) =>
              article.type === 'blog' ? (
                /* Blog item in "All" tab — text only */
                <a
                  key={article.id}
                  href={article.url || undefined}
                  target={article.url ? '_blank' : undefined}
                  rel={article.url ? 'noopener noreferrer' : undefined}
                  className="group cursor-pointer block rounded-2xl border border-gray-100 p-6 hover:border-gray-300 hover:shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`${article.categoryColor} text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded`}>
                        {article.category}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-gray-300 bg-gray-50 px-2 py-0.5 rounded">Blog</span>
                    </div>
                    <h3 className="text-lg font-black uppercase mb-3 leading-snug group-hover:text-indigo-600 transition-colors">
                      {article.title}
                    </h3>
                    {article.description && (
                      <p className="text-sm text-gray-400 leading-relaxed mb-4 line-clamp-3">
                        {article.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 mt-auto pt-4 border-t border-gray-100">
                    {article.author && (
                      <span className="flex items-center gap-1.5 normal-case font-medium">
                        <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500">
                          {article.author.charAt(0)}
                        </span>
                        {article.author}
                      </span>
                    )}
                    <span className="flex items-center gap-1 ml-auto">
                      <Clock size={11} />
                      {article.readTime}
                    </span>
                  </div>
                </a>
              ) : (
                /* News item — image card */
                <a
                  key={article.id}
                  href={article.url || undefined}
                  target={article.url ? '_blank' : undefined}
                  rel={article.url ? 'noopener noreferrer' : undefined}
                  className="group cursor-pointer block"
                >
                  <div className="relative h-96 mb-6 overflow-hidden rounded-3xl">
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-red-500 text-white">
                        News
                      </span>
                    </div>
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
                </a>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBlogs;
