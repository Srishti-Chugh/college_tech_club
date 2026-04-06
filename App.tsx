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
