import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ChoiceProps {
  text: string;
  onClick: () => void;
  isTransitioning: boolean;
}

const Choice: React.FC<ChoiceProps> = ({ text, onClick, isTransitioning }) => {
  const { t } = useTranslation('common');
  const [displayText, setDisplayText] = useState(text);
  const [isTextChanging, setIsTextChanging] = useState(false);

  useEffect(() => {
    if (text !== displayText) {
      setIsTextChanging(true);
      // 等待淡出动画完成后更新文本
      setTimeout(() => {
        setDisplayText(text);
        setIsTextChanging(false);
      }, 300);
    }
  }, [text]);

  return (
    <button 
      className="
        bg-[var(--background-color)] text-[var(--text-color)]
        border-2 border-[var(--border-color)] rounded-[15px]
        px-5 py-2.5 m-[5px] text-base cursor-pointer
        transition-[background-color,width,height] duration-200 ease-in-out
        hover:bg-[var(--text-color)] hover:text-[var(--background-dark-1)]
        min-w-[120px]
      "
      onClick={onClick}
    >
      <span className={`
        inline-block w-full transition-all duration-300 ease-in-out
        ${isTextChanging ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
      `}>
        {t(displayText)}
      </span>
    </button>
  );
};

export default Choice;