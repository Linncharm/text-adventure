import React from 'react';
import useTypingEffect from '../hooks/useTypingEffect';
import { useTranslation } from 'react-i18next';
import {useEffect} from "react";
import TextWithEffects from '../components/Text/TextWithEffects'

interface SceneProps {
  text: string;
  speed: number;
  isSceneStared: boolean;
  isTransitioning: boolean;
  onStatusChange?: (status: string) => void;
  isTypingEffect?: boolean;
}

const Scene: React.FC<SceneProps> = ({ text, speed, isSceneStared, isTransitioning, onStatusChange, isTypingEffect }) => {
  const { t } = useTranslation('common');
  const {
    displayedText,
    displayedStatus,
    effectText,
    effectType
  } = useTypingEffect({
    text:text,
    speed:speed,
    isGameStarted:isSceneStared,
    isTypingEffect:isTypingEffect || false
  });

  if (onStatusChange) {
    onStatusChange(displayedStatus);
  }

  // TODO 实现特效文字与普通文字的平滑拼接
  return (
    <div className={`scene-text ${isTransitioning ? 'transitioning' : ''}`}>
      <span>
        {
          isTypingEffect ? (
            <TextWithEffects text={displayedText} /> // 渲染带有动画的文本
          ) : t(text)
        }
        <span className="cursor">|</span>
      </span>
    </div>
  );
};

export default Scene;
