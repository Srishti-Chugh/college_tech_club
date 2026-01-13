
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedBlogs from './components/FeaturedBlogs';
import UpcomingEvents from './components/UpcomingEvents';
import OurTracks from './components/OurTracks';
import SubscriptionBanner from './components/SubscriptionBanner';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FeaturedBlogs />
        <UpcomingEvents />
        <OurTracks />
        <SubscriptionBanner />
      </main>
      <Footer />
    </div>
  );
};

export default App;
