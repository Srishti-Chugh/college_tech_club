import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedBlogs from './components/FeaturedBlogs';
import UpcomingEvents from './components/UpcomingEvents';
import OurTracks from './components/OurTracks';
import SubscriptionBanner from './components/SubscriptionBanner';
import HypeWallRibbon from './components/HypeWallRibbon';
import Footer from './components/Footer';
import DevelopmentResources from './components/DevelopmentResources';
import { CPRoadmap, ArraysPage, TreesPage, LinkedListPage, StacksQueuesPage, HeapsPage, HashTablePage, GraphsPage } from './components/CPRoadmap';
import Blog2CodePage from './components/Blog2CodePage';
import EventsPage from './components/EventsPage';
import ExplorePage from './components/ExplorePage';
import IntroAnimation from './components/IntroAnimation';
import AuthPage from './components/AuthPage';
import DiscordPage from './components/DiscordPage';
import WinsPage from './components/WinsPage';

const DiscordRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-sm text-white/50 pt-28">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/join" replace state={{ from: '/discord' }} />;
  }

  return <DiscordPage />;
};

const WinsRoute: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-sm text-white/50 pt-28">
        Loading…
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/join" replace state={{ from: location.pathname }} />;
  }

  return <WinsPage />;
};

const Home: React.FC<{ introComplete: boolean }> = ({ introComplete }) => (
  <>
    <Hero introComplete={introComplete} />
    <div className="px-6 md:px-12 lg:px-20">
      <FeaturedBlogs />
    </div>
    <UpcomingEvents />
    <div className="px-6 md:px-12 lg:px-20">
      <OurTracks />
    </div>
    <HypeWallRibbon />
    <div className="px-6 md:px-12 lg:px-20">
      <SubscriptionBanner />
    </div>
  </>
);

const App: React.FC = () => {
  const [introComplete, setIntroComplete] = useState(false);
  const introPlayed = useRef(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  const showIntro = isHome && !introPlayed.current && !introComplete;

  useEffect(() => {
    if (!isHome || introPlayed.current) {
      setIntroComplete(true);
    }
  }, [isHome]);

  const handleIntroComplete = () => {
    introPlayed.current = true;
    setIntroComplete(true);
  };

  return (
    <div className="min-h-screen">
      {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
      <Navbar showLogo={!showIntro} />
      <main>
        <Routes>
          <Route path="/" element={<Home introComplete={introComplete} />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/join" element={<AuthPage />} />
          <Route path="/discord" element={<DiscordRoute />} />
          <Route path="/wins" element={<WinsRoute />} />
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