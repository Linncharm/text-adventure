import React from "react";
import HomeFeature from "@/components/Home/components/Feature";
import HomeComment from "@/components/Home/components/Comment";
import HomeFAQ from "@/components/Home/components/FAQ";

const HomePage: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center">
      <HomeFeature/>
      <HomeComment/>
      <HomeFAQ/>
    </main>
  )
}

export default HomePage;
