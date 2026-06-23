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

type Tab = 'blog' | 'news';

// ─── Big left card ─────────────────────────────────────────────────────────────
const BigCard: React.FC<{ article: Article }> = ({ article }) => (
  <a
    href={article.url || undefined}
    target={article.url ? '_blank' : undefined}
    rel={article.url ? 'noopener noreferrer' : undefined}
    className="group relative block h-full min-h-[480px] overflow-hidden rounded-3xl cursor-pointer"
  >
    {/* Full-bleed image */}
    <img
      src={article.imageUrl}
      alt={article.title}
      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
    />

    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

    {/* Top-left badge */}
    <div className="absolute top-5 left-5">
      <span className={`${article.categoryColor} text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full`}>
        {article.category}
      </span>
    </div>

    {/* Explore button — mirrors the image's circular "View" button */}
    <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
        <ArrowUpRight size={18} className="text-black" />
      </div>
    </div>

    {/* Bottom text overlay */}
    <div className="absolute bottom-0 left-0 right-0 p-6">
      <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2">
        {article.type === 'news' ? 'News' : 'Blog'} &nbsp;·&nbsp; {article.date}
      </p>
      <h3 className="text-xl font-black uppercase leading-snug text-white mb-3 group-hover:text-yellow-400 transition-colors">
        {article.title}
      </h3>
      {article.description && (
        <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
          {article.description}
        </p>
      )}
      <div className="flex items-center gap-3 mt-3 text-[10px] font-bold uppercase tracking-wider text-white/40">
        <span className="flex items-center gap-1"><Clock size={11} />{article.readTime}</span>
      </div>
    </div>
  </a>
);

// ─── Small right card (image left, text right) ──────────────────────────────────
const SmallCard: React.FC<{ article: Article; isLast?: boolean }> = ({ article, isLast }) => (
  <a
    href={article.url || undefined}
    target={article.url ? '_blank' : undefined}
    rel={article.url ? 'noopener noreferrer' : undefined}
    className={`group flex gap-0 overflow-hidden rounded-2xl cursor-pointer border border-black/08 hover:border-black/20 hover:shadow-md transition-all bg-white ${!isLast ? 'mb-0' : ''}`}
  >
    {/* Left image */}
    <div className="relative w-2/5 flex-shrink-0 overflow-hidden">
      <img
        src={article.imageUrl}
        alt={article.title}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        style={{ minHeight: '160px' }}
      />
      {/* Subtle dark triangle/chevron on right edge — mirrors image arrow */}
      <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-r from-transparent to-white/10 pointer-events-none" />
    </div>

    {/* Right text */}
    <div className="flex flex-col justify-center px-5 py-5 flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className={`${article.categoryColor} text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full`}>
          {article.category}
        </span>
        <span className="text-[9px] font-bold uppercase tracking-widest text-black/25">
          {article.type === 'news' ? 'News' : 'Blog'}
        </span>
      </div>
      <h3 className="text-base font-black uppercase leading-snug mb-2 text-black group-hover:text-yellow-600 transition-colors line-clamp-3">
        {article.title}
      </h3>
      <div className="flex items-center gap-2 mt-auto text-[10px] font-bold uppercase tracking-wider text-black/30 flex-wrap">
        <span className="flex items-center gap-1"><Clock size={10} />{article.readTime}</span>
        <span className="w-0.5 h-0.5 rounded-full bg-black/20" />
        <span className="flex items-center gap-1"><Calendar size={10} />{article.date}</span>
      </div>
    </div>
  </a>
);

// ─── Blog list item ───────────────────────────────────────────────────────────
const BlogListItem: React.FC<{ article: Article; idx: number; total: number }> = ({ article, idx, total }) => (
  <a
    href={article.url || undefined}
    target={article.url ? '_blank' : undefined}
    rel={article.url ? 'noopener noreferrer' : undefined}
    className={`group flex gap-4 py-6 ${idx < total - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 -mx-3 px-3 rounded-lg transition-colors`}
  >
    {/* Thumbnail */}
    {article.imageUrl && (
      <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
    )}

    {/* Text */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-2">
        <span className={`${article.categoryColor} text-black text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full`}>
          {article.category}
        </span>
        <span className="text-[11px] text-gray-400">{article.date}</span>
      </div>
      <h3 className="text-lg font-black uppercase leading-snug mb-1.5 group-hover:text-indigo-600 transition-colors line-clamp-2">
        {article.title}
      </h3>
      {article.description && (
        <p className="text-sm text-gray-400 leading-relaxed mb-2 line-clamp-1">
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
        <span className="flex items-center gap-1"><Clock size={11} />{article.readTime}</span>
      </div>
    </div>
  </a>
);

// ─── Blog card in "All" tab (unchanged) ───────────────────────────────────────
const BlogCard: React.FC<{ article: Article }> = ({ article }) => (
  <a
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
      <span className="flex items-center gap-1 ml-auto"><Clock size={11} />{article.readTime}</span>
    </div>
  </a>
);

// ─── Main component ───────────────────────────────────────────────────────────
const FeaturedBlogs: React.FC = () => {
  const [blogs, setBlogs] = useState<Article[]>([]);
  const [news, setNews] = useState<Article[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>('news');

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
  const filtered = allArticles.filter(a => a.type === activeTab).slice(0, 4);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'news', label: 'Weekly News', icon: <Newspaper size={12} /> },
    { key: 'blog', label: 'Blogs', icon: <BookOpen size={12} /> },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">

        {/* ── Section header ── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12">
          <div>
            <h2 className="text-5xl md:text-7xl font-black uppercase leading-tight">
              LATEST<br />READS
            </h2>
          </div>
          <div className="mt-6 md:mt-0 flex flex-col items-end gap-4">
            {/* Tab pills */}
            <div className="flex items-center gap-1 bg-black/5 rounded-full p-1">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-full transition-all ${activeTab === tab.key
                    ? 'bg-black text-white'
                    : 'text-black/50 hover:text-black'
                    }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
            {/* Explore button */}
            <Link
              to="/explore"
              className="group flex items-center space-x-2 border border-black/20 rounded-full pl-6 pr-2 py-2 hover:bg-black hover:text-white transition-all"
            >
              <span className="text-xs font-bold uppercase">Explore</span>
              <div className="bg-black text-white p-2 rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                <ArrowUpRight size={16} />
              </div>
            </Link>
          </div>
        </div>

        {/* ── Content area ── */}
        {filtered.length === 0 ? (
          <p className="text-black/30 text-center italic py-12 font-medium">
            No articles yet — check back soon.
          </p>

        ) : activeTab === 'blog' ? (
          /* Blog-only tab — text list */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-0">
            {filtered.map((article, idx) => (
              <BlogListItem key={article.id} article={article} idx={idx} total={filtered.length} />
            ))}
          </div>

        ) : (
          /* News tab — 4-card asymmetric grid: big left + top-right large + 2 bottom-right small */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 items-stretch" style={{ minHeight: '520px' }}>

            {/* ── LEFT: one tall full-bleed card spanning full height ── */}
            {filtered[0] && <BigCard article={filtered[0]} />}

            {/* ── RIGHT: top large card + two small cards side-by-side ── */}
            <div className="flex flex-col gap-3">

              {/* Top-right: medium full-bleed card */}
              {filtered[1] && (
                <a
                  href={filtered[1].url || undefined}
                  target={filtered[1].url ? '_blank' : undefined}
                  rel={filtered[1].url ? 'noopener noreferrer' : undefined}
                  className="group relative block overflow-hidden rounded-2xl cursor-pointer flex-1"
                  style={{ minHeight: '220px' }}
                >
                  <img
                    src={filtered[1].imageUrl}
                    alt={filtered[1].title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className={`${filtered[1].categoryColor} text-black text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full`}>
                      {filtered[1].category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-base font-black uppercase leading-snug text-white group-hover:text-yellow-400 transition-colors">
                      {filtered[1].title}
                    </h3>
                    <p className="text-[10px] text-white/40 mt-1 font-bold uppercase tracking-wider">{filtered[1].date}</p>
                  </div>
                </a>
              )}

              {/* Bottom-right: two small cards side by side */}
              <div className="grid grid-cols-2 gap-3 flex-1">
                {[filtered[2], filtered[3]].map((article, idx) => article && (
                  <a
                    key={article.id}
                    href={article.url || undefined}
                    target={article.url ? '_blank' : undefined}
                    rel={article.url ? 'noopener noreferrer' : undefined}
                    className="group relative block overflow-hidden rounded-2xl cursor-pointer"
                    style={{ minHeight: '180px' }}
                  >
                    <img
                      src={article.imageUrl}
                      alt={article.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`${article.categoryColor} text-black text-[8px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full`}>
                        {article.category}
                      </span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-sm font-black uppercase leading-snug text-white group-hover:text-yellow-400 transition-colors line-clamp-3">
                        {article.title}
                      </h3>
                    </div>
                  </a>
                ))}

                {/* Fill empty slots with Explore CTA */}
                {Array.from({ length: Math.max(0, 2 - [filtered[2], filtered[3]].filter(Boolean).length) }).map((_, i) => (
                  <Link
                    key={`cta-${i}`}
                    to="/explore"
                    className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-black/10 hover:border-black/30 transition-colors text-center p-4"
                  >
                    <span className="text-sm font-black uppercase tracking-tight text-black/20 group-hover:text-black transition-colors">
                      More →
                    </span>
                  </Link>
                ))}
              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};

export default FeaturedBlogs;