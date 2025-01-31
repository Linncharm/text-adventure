import React from 'react';
import Card from '@/components/Game/Card';

const Home: React.FC = () => {
  const cards = [
    { id: '1', title: 'Game-1', description: 'Description for Game 1,Test TEST aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { id: '2', title: 'Game-2', description: 'Description for Game 2,Test TEST aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { id: '3', title: 'Game-3', description: 'Description for Game 3,Test TEST aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { id: '4', title: 'Game-4', description: 'Description for Game 4,Test TEST aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { id: '5', title: 'Game-5', description: 'Description for Game 5,Test TEST aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { id: '6', title: 'Game-6', description: 'Description for Game 6,Test TEST bbbbbbbbbbbbbbbbb aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { id: '7', title: 'Game-7', description: 'Description for Game 7,Test TEST aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { id: '8', title: 'Game-8', description: 'Description for Game 8,Test TEST aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { id: '9', title: 'Game-9', description: 'Description for Game 9,Test TEST aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
  ];

  return (
    <div
      className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700
          min-h-screen">
      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center">
        <section className="w-full pt-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-14">
              {cards.map((card) => (
                <Card
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  description={card.description}
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
