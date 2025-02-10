import React, {useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import { HistoryItem } from "@/types/Game";

const History: React.FC<{ historyItems: HistoryItem[]}> = ({historyItems}) => {

  const {t} = useTranslation('common');
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
          <div className="scene-text">
            {
              item.sceneText.map((span) => (
                <span key={span.key} style={span.style}>{span.content}</span>
              ))
            }
          </div>
          <div className="choice-text">{t(item.choiceText)}</div>
        </div>
      ))}
    </div>
  );
};

export default History;
