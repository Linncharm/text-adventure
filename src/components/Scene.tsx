import React, { useEffect } from 'react';
import useTypingEffect from '../hooks/useTypingEffect';
import { useTranslation } from 'react-i18next';
import TextWithEffects from '../components/Text/TextWithEffects'

interface SceneProps {
  sceneFontFamily: string; // 一定存在，因为有default兜底
  sceneFontSize: string; // 一定存在，因为有default兜底
  isCustomizeSceneFontSize: boolean; // 一定存在，因为有default兜底
  text: string;
  speed: number;
  isSceneStared: boolean;
  isTransitioning: boolean;
  onStatusChange?: (status: string) => void;
  isTypingEffect?: boolean;
}

const Scene: React.FC<SceneProps> = (props:SceneProps) => {

  const {
    sceneFontFamily,
    sceneFontSize,
    isCustomizeSceneFontSize,
    text,
    speed,
    isSceneStared,
    isTransitioning,
    onStatusChange,
    isTypingEffect
  } = props;

  // TODO 2.1 fontSizeClass又失效了
  const fontSizeClass = isCustomizeSceneFontSize ? `text-[${sceneFontSize}]` : `text-${sceneFontSize}`;
  const fontFamilyClass = sceneFontFamily ? `font-${sceneFontFamily}` : '';

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

  useEffect(() => {
  }, [sceneFontFamily, sceneFontSize]);

  // TODO 实现特效文字与普通文字的平滑拼接
  return (
    <div className={`scene-text ${isTransitioning ? 'transitioning' : ''} ${fontFamilyClass} ${fontSizeClass}`}>
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
