import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Newspaper,
  BookOpen,
  ExternalLink,
  Clock,
  Zap,
  Globe,
  TrendingUp,
  Filter,
} from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  summary?: string;
  source?: string;
  date: string;
  imageUrl: string;
  category: string;
  featured?: boolean;
  url?: string;
}

interface BlogEntry {
  id: string;
  title: string;
  author?: string;
  category: string;
  categoryColor: string;
  date: string;
  readTime: string;
  imageUrl: string;
  url?: string;
  description?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  CP: 'bg-orange-100 text-orange-800',
  ML: 'bg-purple-100 text-purple-800',
  Dev: 'bg-blue-100 text-blue-800',
  Research: 'bg-emerald-100 text-emerald-800',
};

const NEWS_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  AI: <Zap size={14} />,
  Industry: <Globe size={14} />,
  'CP News': <TrendingUp size={14} />,
  Programming: <BookOpen size={14} />,
  Quantum: <Zap size={14} />,
  Policy: <Globe size={14} />,
  Tech: <Globe size={14} />,
};

const ThisWeekInTech: React.FC<{ items: NewsItem[] }> = ({ items }) => {
  const featured = items.find((n) => n.featured);
  const rest = items.filter((n) => !n.featured);

  if (items.length === 0) {
    return <p className="text-center py-16 text-gray-400 text-sm italic">No news yet — check back soon.</p>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center border-b-4 border-double border-black pb-6 mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-gray-500 mb-2">
          Your weekly digest of everything tech
        </p>
        <h2
          className="text-5xl md:text-7xl font-black uppercase tracking-tight"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          This Week in Tech
        </h2>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs tracking-wider uppercase text-gray-500">
          <span>Tech Club Weekly</span>
          <span className="w-1 h-1 rounded-full bg-gray-400" />
          <span>Updated from news.json</span>
        </div>
      </div>

      {featured && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 pb-10 border-b border-gray-200">
          <div className="relative overflow-hidden rounded-2xl h-72 lg:h-auto">
            <img
              src={featured.imageUrl}
              alt={featured.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded">
              Breaking
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] font-bold uppercase tracking-widest text-red-600 mb-3">
              {featured.category} &middot; Lead Story
            </span>
            <h3
              className="text-3xl md:text-4xl font-black leading-tight mb-4"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {featured.title}
            </h3>
            {featured.summary && (
              <p className="text-gray-600 leading-relaxed mb-4 text-base">
                {featured.summary}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-400 uppercase tracking-wider">
              {featured.source && <span>{featured.source}</span>}
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {featured.date}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {rest.map((item, index) => (
          <article
            key={item.id}
            className={`group ${index < rest.length - 1
                ? 'border-b md:border-b-0 md:border-r border-gray-200 pb-8 md:pb-0 md:pr-8'
                : ''
              }`}
          >
            <div className="relative overflow-hidden rounded-xl h-44 mb-4">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                {NEWS_CATEGORY_ICONS[item.category] || <Globe size={14} />}
                {item.category}
              </span>
            </div>
            <h4
              className="text-lg font-bold leading-snug mb-2 group-hover:text-indigo-600 transition-colors"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {item.title}
            </h4>
            {item.summary && (
              <p className="text-sm text-gray-500 leading-relaxed mb-3">
                {item.summary}
              </p>
            )}
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-gray-400">
              {item.source && <span>{item.source}</span>}
              {item.source && <span className="w-1 h-1 rounded-full bg-gray-300" />}
              <span>{item.date}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

const BlogsTab: React.FC<{ entries: BlogEntry[] }> = ({ entries }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(entries.map((b) => b.category)));
    return ['All', ...cats.sort()];
  }, [entries]);

  const filtered = useMemo(
    () =>
      selectedCategory === 'All'
        ? entries
        : entries.filter((b) => b.category === selectedCategory),
    [selectedCategory, entries],
  );

  if (entries.length === 0) {
    return <p className="text-center py-16 text-gray-400 text-sm italic">No blogs yet — check back soon.</p>;
  }

  const grouped = useMemo(() => {
    const map: Record<string, BlogEntry[]> = {};
    filtered.forEach(b => {
      if (!map[b.category]) map[b.category] = [];
      map[b.category].push(b);
    });
    return map;
  }, [filtered]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
            Blog Directory
          </h2>
          <p className="text-gray-500 text-sm">
            Curated reads from the community — filter by topic to find what
            matters to you.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter size={14} className="text-gray-400" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${selectedCategory === cat
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200" />

      {selectedCategory === 'All' ? (
        /* Grouped by category — two-column layout */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10 mt-8">
          {Object.entries(grouped).map(([category, blogs]) => (
            <div key={category}>
              {/* Category header */}
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-700'
                  }`}>
                  {category}
                </span>
                <span className="text-[11px] text-gray-400 font-mono">{blogs.length} {blogs.length === 1 ? 'post' : 'posts'}</span>
              </div>

              {/* Blog entries under this category */}
              <div>
                {blogs.map((blog, idx) => (
                  <a
                    key={blog.id}
                    href={blog.url || undefined}
                    target={blog.url ? '_blank' : undefined}
                    rel={blog.url ? 'noopener noreferrer' : undefined}
                    className={`group flex gap-4 py-4 ${idx < blogs.length - 1 ? 'border-b border-gray-50' : ''
                      } hover:bg-gray-50 -mx-3 px-3 rounded-lg transition-colors`}
                  >
                    {blog.imageUrl && (
                      <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden">
                        <img
                          src={blog.imageUrl}
                          alt={blog.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[15px] font-semibold leading-snug mb-1 text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {blog.title}
                      </h4>
                      {blog.description && (
                        <p className="text-sm text-gray-400 leading-relaxed mb-2 line-clamp-1">
                          {blog.description}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-[11px] text-gray-400">
                        {blog.author && (
                          <span className="flex items-center gap-1.5">
                            <span className="w-4 h-4 rounded-full bg-gray-200 flex items-center justify-center text-[8px] font-bold text-gray-500">
                              {blog.author.charAt(0)}
                            </span>
                            {blog.author}
                          </span>
                        )}
                        <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                        <span className="flex items-center gap-1">
                          <Clock size={10} />
                          {blog.readTime}
                        </span>
                        <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                        <span>{blog.date}</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Single category — full-width list */
        <div className="mt-8">
          {filtered.map((blog, idx) => (
            <a
              key={blog.id}
              href={blog.url || undefined}
              target={blog.url ? '_blank' : undefined}
              rel={blog.url ? 'noopener noreferrer' : undefined}
              className={`group flex items-start gap-5 py-5 ${idx < filtered.length - 1 ? 'border-b border-gray-100' : ''
                } hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors`}
            >
              {/* Thumbnail */}
              {blog.imageUrl && (
                <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <h4 className="text-base font-bold leading-snug mb-1 text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {blog.title}
                </h4>
                {blog.description && (
                  <p className="text-sm text-gray-500 leading-relaxed mb-2 line-clamp-2">
                    {blog.description}
                  </p>
                )}
                <div className="flex items-center gap-3 text-[11px] text-gray-400">
                  {blog.author && (
                    <span className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500">
                        {blog.author.charAt(0)}
                      </span>
                      {blog.author}
                    </span>
                  )}
                  <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {blog.readTime}
                  </span>
                  <span className="w-0.5 h-0.5 rounded-full bg-gray-300" />
                  <span>{blog.date}</span>
                  <ExternalLink size={11} className="ml-auto text-gray-300 group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>
            </a>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 text-sm">
          No blogs found in this category.
        </div>
      )}
    </div>
  );
};

type Tab = 'news' | 'blogs';

const ExplorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('news');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [blogEntries, setBlogEntries] = useState<BlogEntry[]>([]);

  useEffect(() => {
    fetch('/news.json')
      .then(r => r.json())
      .then((data: NewsItem[]) => setNewsItems(data))
      .catch(() => setNewsItems([]));

    fetch('/blogs.json')
      .then(r => r.json())
      .then((data: BlogEntry[]) => setBlogEntries(data))
      .catch(() => setBlogEntries([]));
  }, []);

  return (
    <section className="min-h-screen bg-white pt-28 pb-20">
      <div className="container mx-auto px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'news'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-500 hover:text-black'
                }`}
            >
              <Newspaper size={16} />
              This Week in Tech
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${activeTab === 'blogs'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-500 hover:text-black'
                }`}
            >
              <BookOpen size={16} />
              Blogs
            </button>
          </div>
        </div>

        {activeTab === 'news'
          ? <ThisWeekInTech items={newsItems} />
          : <BlogsTab entries={blogEntries} />
        }
      </div>
    </section>
  );
};

export default ExplorePage;