
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
import CPRoadmap from './components/CPRoadmap';
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
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
