
import React from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FreshlyPublished from './components/FreshlyPublished';
import FeaturedPosts from './components/FeaturedPosts';
import FeaturedCategories from './components/FeaturedCategories';
import SubscriptionBanner from './components/SubscriptionBanner';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <FreshlyPublished />
        <FeaturedPosts />
        <FeaturedCategories />
        <SubscriptionBanner />
      </main>
      <Footer />
    </div>
  );
};

export default App;
