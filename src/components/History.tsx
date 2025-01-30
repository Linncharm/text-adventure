import React, {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';

interface HistoryProps {
  historyItems: { sceneText: string; choiceText: string }[];
}

const History: React.FC<HistoryProps> = ({historyItems}) => {
  const {t} = useTranslation();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [historyItems]);

  return (
    <div className="history-container" ref={containerRef}>
      {historyItems.map((item, index) => (
        <div key={index} className="history-item">
          <p className="scene-text">{t(item.sceneText)}</p>
          <p className="choice-text">{t(item.choiceText)}</p>
        </div>
      ))}
    </div>
  );
};

export default History;
