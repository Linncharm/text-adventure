import React from 'react';
import useTypingEffect from '../hooks/useTypingEffect';
import { useTranslation } from 'react-i18next';
import {useEffect} from "react";

interface SceneProps {
  text: string;
  speed: number;
  isSceneStared: boolean;
  isTransitioning: boolean;
  onStatusChange?: (status: string) => void;
  isTypingEffect?: boolean;
}

const Scene: React.FC<SceneProps> = ({ text, speed, isSceneStared, isTransitioning, onStatusChange, isTypingEffect }) => {
  const { t } = useTranslation();
  const {
    displayedText,
    displayedStatus
  } = useTypingEffect({
    text:text,
    speed:speed,
    isGameStarted:isSceneStared,
    isTypingEffect:isTypingEffect || false
  });

  if (onStatusChange) {
    onStatusChange(displayedStatus);
  }

  return (
    <div className={`scene-text ${isTransitioning ? 'transitioning' : ''}`}>
      <span>
        {
          isTypingEffect ? displayedText : t(text)
        }
        <span className="cursor">|</span>
      </span>
    </div>
  );
};

export default Scene;
