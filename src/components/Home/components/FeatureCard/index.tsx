import React from 'react';
import { useTranslation } from "react-i18next";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = (props) => {

  const { title, description, icon } = props;

  const { t } = useTranslation('home');

  return (
    <div className="bg-white/70 dark:bg-black/20 backdrop-blur-sm rounded-2xl p-8">
      <h3 className="text-2xl dark:text-gray-200 font-semibold mb-4">
        <span className="mr-2">
          {icon}
        </span>
        {t(title)}
      </h3>
      <p className="text-gray-500 dark:text-gray-300">
        {t(description)}
      </p>
    </div>
  )
}

export default FeatureCard;
