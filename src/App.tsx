import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedBlogs from './components/FeaturedBlogs';
import UpcomingEvents from './components/UpcomingEvents';
import OurTracks from './components/OurTracks';
import SubscriptionBanner from './components/SubscriptionBanner';
import Footer from './components/Footer';
import DevelopmentResources from './components/DevelopmentResources';
import { CPRoadmap, ArraysPage, TreesPage, LinkedListPage, StacksQueuesPage, HeapsPage, HashTablePage, GraphsPage } from './components/CPRoadmap';
import Blog2CodePage from './components/Blog2CodePage';
import EventsPage from './components/EventsPage';
import ExplorePage from './components/ExplorePage';

const JoinPage: React.FC = () => (
  <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6">
    <div className="w-full max-w-md text-center">
      <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-5 py-2 mb-8">
        <span className="text-xs font-mono tracking-wider text-gray-400">// authentication</span>
      </div>
      <h1 className="text-5xl md:text-6xl font-black uppercase tracking-tight mb-4">
        Coming Soon
      </h1>
      <p className="text-gray-500 font-mono text-sm mb-10">
        Login & sign-up are under construction. Check back shortly.
      </p>
      <div className="w-full max-w-sm mx-auto rounded-xl border border-white/10 bg-gray-950 p-5 font-mono text-sm text-left">
        <p className="text-gray-500">{'>'} auth module loading...</p>
        <p className="text-yellow-400">{'>'} eta: very soon</p>
        <p className="text-green-400 mt-2">{'>'} meanwhile, explore the site _</p>
      </div>
      <a href="/" className="inline-block mt-8 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">
        &larr; Back to Home
      </a>
    </div>
  </section>
);

const Home: React.FC = () => (
  <>
    <Hero />
    <FeaturedBlogs />
    <UpcomingEvents />
    <OurTracks />
    <SubscriptionBanner />
  </>
);

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/resources/development" element={<DevelopmentResources />} />
          <Route path="/resources/cp-roadmap" element={<CPRoadmap />} />
          <Route path="/ml/blog2code" element={<Blog2CodePage />} />
          <Route path="/dsa/arrays" element={<ArraysPage />} />
          <Route path="/dsa/trees" element={<TreesPage />} />
          <Route path="/dsa/linked-lists" element={<LinkedListPage />} />
          <Route path="/dsa/stacks-queues" element={<StacksQueuesPage />} />
          <Route path="/dsa/heaps" element={<HeapsPage />} />
          <Route path="/dsa/hash-tables" element={<HashTablePage />} />
          <Route path="/dsa/graphs" element={<GraphsPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;