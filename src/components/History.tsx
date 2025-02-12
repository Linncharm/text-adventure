import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import { HistoryItem } from "@/types/Game";

const History: React.FC<{ historyItems: HistoryItem[]}> = ({historyItems}) => {
  const {t} = useTranslation('common');
  const containerRef = useRef<HTMLDivElement>(null);
  const [animatingItemIndex, setAnimatingItemIndex] = useState<number | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
    if (historyItems.length > 0) {
      setAnimatingItemIndex(historyItems.length - 1);
      setTimeout(() => {
        setAnimatingItemIndex(null);
      }, 300);
    }
  }, [historyItems]);

  return (
    <div 
      ref={containerRef}
      className="
        flex flex-col justify-start items-center w-4/5 mx-auto my-5 p-5
        bg-white/5 dark:bg-black/5 backdrop-blur-[80px]
        rounded-lg overflow-y-auto max-h-[500px] relative
        scroll-smooth snap-y snap-mandatory
        [mask-image:linear-gradient(to_bottom,transparent_10%,rgba(0,0,0,0.2)_25%,rgba(0,0,0,0.5)_50%,rgba(0,0,0,0.85)_65%,rgba(0,0,0,1)_100%)]
        scrollbar-hide
      "
    >
      {historyItems.map((item, index) => (
        <div 
          key={index} 
          className={`
            w-full mb-2.5 p-2 rounded-lg 
            bg-white/5 dark:bg-black/5
            transform transition-all duration-300 ease-in-out
            ${index === animatingItemIndex 
              ? 'opacity-0 translate-y-4 animate-slideIn' 
              : 'opacity-100 translate-y-0'}
          `}
        >
          <div className="mb-5 leading-relaxed text-shadow-lg">
            {item.sceneText.map((span) => (
              <span 
                key={span.key} 
                style={span.style}
                className="text-current dark:text-white"
              >
                {span.content}
              </span>
            ))}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t(item.choiceText)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default History;