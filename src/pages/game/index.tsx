import React, {useEffect, useState} from 'react';
import Card from '@/components/Game/Card';
import { GameCard } from "@/types/Card";

const Home: React.FC = () => {
  const cards = [
    { id: '1', title: 'Game-1', description: 'Description for Game 1,Test TEST aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',imageURL:'/images/image1.jpg' },
    { id: '2', title: 'Game-2', description: 'Description for Game 2,Test TEST aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',imageURL:'/images/image1.jpg' },
    { id: '3', title: 'Game-3', description: 'Description for Game 3,Test TEST aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',imageURL:'/images/image1.jpg' }
];

  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  const [cardItems, setCardItems] = useState<GameCard[]>();
  const [page, setPage] = useState(0); // 当前页数，初始为 0

  const handleLoadingComplete = () => {
    setIsLoadingComplete(true);
  };

  // 用于刷新卡片的函数
  const handleRefresh = async () => {
    try {
      setIsLoadingComplete(false);
      const response = await fetch(`/api/cards?page=${page}`);
      if (!response.ok) {
        console.error('Failed to fetch card data');
        return;
      }

      const data = await response.json();
      console.log(data)
      // 如果 data 为 undefined 或空数组，跳过
      if (!data || data.length === 0) {
        console.log('No more cards, starting from the beginning');
        setPage(0); // 重置页数，从头开始加载
        return; // 退出当前函数
      }

      // 将新加载的卡片替换原有的卡片
      setCardItems(data);
      setIsLoadingComplete(true);

      // 更新页面数
      setPage((prevPage) => prevPage + 1);

    } catch (error) {
      console.error('Error fetching card data:', error);
    }
  };


  useEffect(() => {
    handleRefresh()
      .then(() => {
        console.log('Refreshed');
        setIsLoadingComplete(true);
      })
      .catch((error) => {
        console.error('Failed to refresh', error);
      });
  }, []);

  return (
    <div
      className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
          min-h-screen">
      <main className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center pt-16">
        <button
          onClick={handleRefresh}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors duration-300 flex items-center"
        >
          <span className="mr-0.5">Refresh</span>
          {!isLoadingComplete && (
            <svg className="size-6 animate-spin dark:text-white text-black"
                 xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                      strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          )}
        </button>
        <section className="w-full pt-10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-14">
              {cardItems && cardItems.map((card) => (
                <Card
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
                  image={card.imageURL}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
