import React from "react";
import { useTranslation } from "react-i18next";

interface SectionHeaderProps {
  icon?: string;
  title: string;
  subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = (props) => {

  const { icon, title, subtitle } = props;
  const { t,i18n } = useTranslation('home');
  console.log('SectionHeader render',i18n.language);

  return (
    <>
      <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-200">
        {t(title)}
        {icon &&
          <span className="ml-2">{icon}</span>
        }
      </h2>
      <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
        {t(subtitle)}
      </p>
    </>
  )
}

export default SectionHeader;
