import React from 'react';
import { useRouter } from 'next/router';

interface CardProps {
  id: string;
  title: string;
  description: string;
  image: string; // Path to the local image
}

const Card: React.FC<CardProps> = ({ id, title, description, image }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/game/${title}`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-xl cursor-pointer hover:scale-105 transition-transform duration-500"
      onClick={handleClick}
    >
      <div className="relative" style={{ paddingBottom: '61.8%' }}> {/* Golden ratio split */}
        <img
          src={image}
          alt={title}
          className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
        />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-white dark:from-gray-800 to-transparent"/>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 break-words">{description}</p>
      </div>
    </div>
  );
};

export default Card;
