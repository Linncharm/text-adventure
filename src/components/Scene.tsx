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
  showCompleteText?: boolean;
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
    isTypingEffect,
    showCompleteText
  } = props;

  // TODO 2.1 fontSizeClass又失效了
  const fontSizeClass = isCustomizeSceneFontSize ? `text-[${sceneFontSize}]` : `text-${sceneFontSize}`;
  const fontFamilyClass = sceneFontFamily ? `font-${sceneFontFamily}` : '';

  const { t } = useTranslation('common');

  useEffect(() => {

  }, [sceneFontFamily, sceneFontSize]);

  // TODO 2.1 怎么解决重新渲染时旧钩子的调用问题（根本问题）
  // TODO 换个思路，重新加载Game页面？history采用localstorage存储？然后开创一个存档组件？
  let {
    displayedText,
    effectText,
    effectType
  } = useTypingEffect({
    text: text,
    speed: speed,
    isGameStarted: isSceneStared,
    isTypingEffect: isTypingEffect || false,
    onStatusChange: onStatusChange
  });


  // TODO 实现特效文字与普通文字的平滑拼接
  return (
    <div
      className={`scene-text ${isTransitioning ? 'transitioning' : ''} ${fontFamilyClass} ${fontSizeClass}`}>
      {
        showCompleteText ? (<span>{t(text)}</span>) : (<TextWithEffects text={displayedText} />)
      }
      <span className="cursor">|</span>
    </div>
  );
};

export default Scene;
