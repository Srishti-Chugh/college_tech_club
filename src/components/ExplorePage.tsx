import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Newspaper,
  BookOpen,
  ExternalLink,
  Clock,
  TrendingUp,
  Zap,
  Globe,
  Filter,
} from 'lucide-react';

interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  date: string;
  imageUrl: string;
  category: string;
  featured?: boolean;
}

interface BlogEntry {
  id: string;
  title: string;
  author: string;
  category: string;
  date: string;
  readTime: string;
  link: string;
  description: string;
}

const NEWS_ITEMS: NewsItem[] = [
  {
    id: '1',
    headline: 'OpenAI Unveils GPT-5 with Real-Time Reasoning Capabilities',
    summary:
      'The latest model demonstrates unprecedented chain-of-thought reasoning, scoring 92% on graduate-level science benchmarks. Researchers say it marks a significant leap toward artificial general intelligence.',
    source: 'TechCrunch',
    date: 'May 5, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
    category: 'AI',
    featured: true,
  },
  {
    id: '2',
    headline: 'Apple Announces M5 Ultra Chip at WWDC Preview',
    summary:
      'The next-generation silicon promises 3x the neural engine throughput, targeting AI-native applications on device. Expected to ship in new Mac Pro lineup this fall.',
    source: 'The Verge',
    date: 'May 4, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800',
    category: 'Hardware',
  },
  {
    id: '3',
    headline: 'Rust Overtakes C++ in Systems Programming Popularity Index',
    summary:
      'For the first time, Rust has surpassed C++ on the TIOBE index for systems-level programming, driven by adoption in Linux kernel, Android, and Windows.',
    source: 'InfoQ',
    date: 'May 3, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
    category: 'Programming',
  },
  {
    id: '4',
    headline: 'SpaceX Starlink V3 Achieves 1Gbps Global Average Speed',
    summary:
      'The third-generation satellite constellation now delivers fiber-equivalent speeds to remote regions, disrupting traditional ISP markets worldwide.',
    source: 'Ars Technica',
    date: 'May 3, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&q=80&w=800',
    category: 'Space Tech',
  },
  {
    id: '5',
    headline: 'EU Passes Landmark AI Liability Directive',
    summary:
      'New regulations hold AI developers accountable for harm caused by autonomous systems, setting a global precedent for AI governance.',
    source: 'Reuters',
    date: 'May 2, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&q=80&w=800',
    category: 'Policy',
  },
  {
    id: '6',
    headline: 'Quantum Computing Hits 10,000-Qubit Milestone',
    summary:
      'IBM and Google jointly announce a breakthrough in error-corrected quantum processors, making practical quantum advantage a near-term reality.',
    source: 'MIT Tech Review',
    date: 'May 1, 2026',
    imageUrl:
      'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    category: 'Quantum',
  },
];

const BLOG_ENTRIES: BlogEntry[] = [
  {
    id: '1',
    title: 'Building Scalable APIs with Rust and Actix-Web',
    author: 'Arjun Mehta',
    category: 'Backend',
    date: 'May 4, 2026',
    readTime: '12 min',
    link: '#',
    description: 'A deep dive into high-performance web services using Rust.',
  },
  {
    id: '2',
    title: 'Understanding Transformer Architectures from Scratch',
    author: 'Priya Sharma',
    category: 'AI/ML',
    date: 'May 3, 2026',
    readTime: '18 min',
    link: '#',
    description:
      'Step-by-step implementation of attention mechanisms and positional encoding.',
  },
  {
    id: '3',
    title: 'React Server Components: The Complete Guide',
    author: 'Rahul Verma',
    category: 'Frontend',
    date: 'May 2, 2026',
    readTime: '15 min',
    link: '#',
    description:
      'How RSC changes the mental model of data fetching in React apps.',
  },
  {
    id: '4',
    title: 'Competitive Programming: Mastering Segment Trees',
    author: 'Sneha Iyer',
    category: 'DSA',
    date: 'May 1, 2026',
    readTime: '20 min',
    link: '#',
    description:
      'Range queries, lazy propagation, and advanced tree techniques.',
  },
  {
    id: '5',
    title: 'DevOps in 2026: GitOps, Platform Engineering & Beyond',
    author: 'Karan Singh',
    category: 'DevOps',
    date: 'Apr 30, 2026',
    readTime: '10 min',
    link: '#',
    description:
      'The shifting landscape of infrastructure automation and developer experience.',
  },
  {
    id: '6',
    title: 'Introduction to WebAssembly for Web Developers',
    author: 'Ananya Das',
    category: 'Frontend',
    date: 'Apr 29, 2026',
    readTime: '14 min',
    link: '#',
    description:
      'Bringing near-native performance to the browser with WASM.',
  },
  {
    id: '7',
    title: 'Graph Neural Networks: Theory and Applications',
    author: 'Vikram Patel',
    category: 'AI/ML',
    date: 'Apr 28, 2026',
    readTime: '22 min',
    link: '#',
    description:
      'How GNNs are revolutionizing molecule discovery and social network analysis.',
  },
  {
    id: '8',
    title: 'Kubernetes Networking Deep Dive',
    author: 'Rohan Gupta',
    category: 'DevOps',
    date: 'Apr 27, 2026',
    readTime: '16 min',
    link: '#',
    description:
      'CNI plugins, service meshes, and network policies demystified.',
  },
  {
    id: '9',
    title: 'Solving Dynamic Programming Problems Intuitively',
    author: 'Meera Joshi',
    category: 'DSA',
    date: 'Apr 26, 2026',
    readTime: '17 min',
    link: '#',
    description:
      'Pattern recognition techniques that make DP approachable.',
  },
  {
    id: '10',
    title: 'Building a Real-Time Chat App with WebSockets & Go',
    author: 'Aditya Nair',
    category: 'Backend',
    date: 'Apr 25, 2026',
    readTime: '13 min',
    link: '#',
    description:
      'Goroutines, channels, and efficient message broadcasting.',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  'AI/ML': 'bg-purple-100 text-purple-800',
  Frontend: 'bg-blue-100 text-blue-800',
  Backend: 'bg-green-100 text-green-800',
  DSA: 'bg-orange-100 text-orange-800',
  DevOps: 'bg-cyan-100 text-cyan-800',
};

const NEWS_CATEGORY_ICONS: Record<string, React.ReactNode> = {
  AI: <Zap size={14} />,
  Hardware: <Globe size={14} />,
  Programming: <BookOpen size={14} />,
  'Space Tech': <TrendingUp size={14} />,
  Policy: <Globe size={14} />,
  Quantum: <Zap size={14} />,
};

const ThisWeekInTech: React.FC = () => {
  const featured = NEWS_ITEMS.find((n) => n.featured);
  const rest = NEWS_ITEMS.filter((n) => !n.featured);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Newspaper masthead */}
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
          <span>Vol. 12 &middot; Issue 18</span>
          <span className="w-1 h-1 rounded-full bg-gray-400" />
          <span>May 5, 2026</span>
          <span className="w-1 h-1 rounded-full bg-gray-400" />
          <span>Tech Club Weekly</span>
        </div>
      </div>

      {/* Featured story */}
      {featured && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 pb-10 border-b border-gray-200">
          <div className="relative overflow-hidden rounded-2xl h-72 lg:h-auto">
            <img
              src={featured.imageUrl}
              alt={featured.headline}
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
              {featured.headline}
            </h3>
            <p className="text-gray-600 leading-relaxed mb-4 text-base">
              {featured.summary}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-400 uppercase tracking-wider">
              <span>{featured.source}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1">
                <Clock size={12} />
                {featured.date}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* News grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10">
        {rest.map((item, index) => (
          <article
            key={item.id}
            className={`group ${
              index < rest.length - 1
                ? 'border-b md:border-b-0 md:border-r border-gray-200 pb-8 md:pb-0 md:pr-8'
                : ''
            }`}
          >
            <div className="relative overflow-hidden rounded-xl h-44 mb-4">
              <img
                src={item.imageUrl}
                alt={item.headline}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-indigo-600">
                {NEWS_CATEGORY_ICONS[item.category]}
                {item.category}
              </span>
            </div>
            <h4
              className="text-lg font-bold leading-snug mb-2 group-hover:text-indigo-600 transition-colors"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              {item.headline}
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              {item.summary}
            </p>
            <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-gray-400">
              <span>{item.source}</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{item.date}</span>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

const BlogsTab: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = useMemo(() => {
    const cats = Array.from(new Set(BLOG_ENTRIES.map((b) => b.category)));
    return ['All', ...cats.sort()];
  }, []);

  const filtered = useMemo(
    () =>
      selectedCategory === 'All'
        ? BLOG_ENTRIES
        : BLOG_ENTRIES.filter((b) => b.category === selectedCategory),
    [selectedCategory],
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-2">
          Blog Directory
        </h2>
        <p className="text-gray-500 text-sm">
          Curated reads from the community — filter by topic to find what
          matters to you.
        </p>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-3 mb-8 flex-wrap">
        <Filter size={16} className="text-gray-400" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
              selectedCategory === cat
                ? 'bg-black text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Blog table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Title
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden md:table-cell">
                Author
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden sm:table-cell">
                Category
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden lg:table-cell">
                Date
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden lg:table-cell">
                Read Time
              </th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500">
                Link
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((blog, idx) => (
              <tr
                key={blog.id}
                className={`group hover:bg-indigo-50/50 transition-colors ${
                  idx < filtered.length - 1
                    ? 'border-b border-gray-100'
                    : ''
                }`}
              >
                <td className="px-6 py-5">
                  <div className="font-semibold text-sm group-hover:text-indigo-600 transition-colors">
                    {blog.title}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {blog.description}
                  </div>
                </td>
                <td className="px-6 py-5 text-sm text-gray-600 hidden md:table-cell">
                  {blog.author}
                </td>
                <td className="px-6 py-5 hidden sm:table-cell">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      CATEGORY_COLORS[blog.category] ||
                      'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {blog.category}
                  </span>
                </td>
                <td className="px-6 py-5 text-xs text-gray-400 hidden lg:table-cell">
                  {blog.date}
                </td>
                <td className="px-6 py-5 text-xs text-gray-400 hidden lg:table-cell">
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {blog.readTime}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <a
                    href={blog.link}
                    className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-indigo-600 hover:text-indigo-800 transition-colors"
                  >
                    Read
                    <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400 text-sm">
            No blogs found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

type Tab = 'news' | 'blogs';

const ExplorePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('news');

  return (
    <section className="min-h-screen bg-white pt-28 pb-20">
      <div className="container mx-auto px-6">
        {/* Back link */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 hover:text-black transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-gray-100 rounded-full p-1">
            <button
              onClick={() => setActiveTab('news')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === 'news'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <Newspaper size={16} />
              This Week in Tech
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold uppercase tracking-wider transition-all ${
                activeTab === 'blogs'
                  ? 'bg-black text-white shadow-lg'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              <BookOpen size={16} />
              Blogs
            </button>
          </div>
        </div>

        {/* Tab content */}
        {activeTab === 'news' ? <ThisWeekInTech /> : <BlogsTab />}
      </div>
    </section>
  );
};

export default ExplorePage;
