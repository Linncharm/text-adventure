import Home from '../../components/Home/index';
import React from 'react';

const HomePage: React.FC = () => {
  return (
    <div
      className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
          min-h-screen">
      <Home/>
    </div>
  )
};

export default HomePage;
