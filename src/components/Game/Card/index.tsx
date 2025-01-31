import React from 'react';
import { useRouter } from 'next/router';

interface CardProps {
  id: string;
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = ({ id, title, description }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/game/${title}`);
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 cursor-pointer hover:scale-105 transition-transform duration-500"
      onClick={handleClick}
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 break-words">{description}</p>
    </div>
  );
};

export default Card;
