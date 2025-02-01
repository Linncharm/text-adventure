import React, { useState } from "react";
import { useTranslation } from "react-i18next";

// 考虑直接封装antd collapse组件
interface FAQCardProps {
  question: string;
  answer: string;
}

const FAQCard: React.FC<FAQCardProps> = (props) => {
  const { t } = useTranslation();
  const { question, answer } = props;
  const [isOpen, setIsOpen] = useState(false);

  const toggleCollapse = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${
        isOpen
          ? "bg-gradient-to-t from-gray-200 to-white/70 dark:from-black/20 dark:to-gray-800"
          : "bg-white/70 dark:bg-black/20"
      } backdrop-blur-sm rounded-2xl p-8`}
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={toggleCollapse}
      >
        <h3 className="text-xl font-semibold mb-1 dark:text-gray-200">
          {t(question)}
        </h3>
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" className="h-6 w-6">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </div>
      <div
        className={
        `overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? "max-h-[1000px]" : "max-h-0"} `
      }>
        {isOpen && (
          <>
            <hr className="my-4 border-t border-gray-300 dark:border-gray-600" />
            <p className="text-gray-500 dark:text-gray-300">
              {t(answer)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default FAQCard;
