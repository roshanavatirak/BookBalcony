import React, { useEffect, useState } from 'react';
import Hero from '../components/Home/Hero';
import RecentlyAdded from '../components/Home/RecentlyAdded';
import TrendingBooks from '../components/Home/TrendingBooks';
import EditorsChoice from '../components/Home/EditorsChoice';
import OnboardingModal from '../components/Home/OnboardingModal'; // ✅ Import the modal

function Home() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const shouldShow = localStorage.getItem("showOnboarding");
    if (shouldShow === "true") {
      setShowOnboarding(true);
    }
  }, []);

  return (
    <div className="bg-zinc-900 text-white px-4 sm:px-6 md:px-10 py-6 sm:py-8">
      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
      
      <Hero />
      <RecentlyAdded />
      <TrendingBooks />
      <EditorsChoice />
    </div>
  );
}

export default Home;
