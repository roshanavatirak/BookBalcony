import React from 'react'
import Hero from '../components/Home/Hero'
import RecentlyAdded from '../components/Home/RecentlyAdded'
import TrendingBooks from '../components/Home/TrendingBooks'
import EditorsChoice from '../components/Home/EditorsChoice'


function Home() {
  return (
    <div className="bg-zinc-900 text-white px-10 py-8">
      <Hero/>
      <RecentlyAdded/>
      <TrendingBooks/>
      <EditorsChoice/>
    </div>
  )
}

export default Home