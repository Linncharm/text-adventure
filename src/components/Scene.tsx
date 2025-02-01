import React, { useEffect,useState } from 'react';
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

  const [isSceneReset, setIsSceneReset] = useState(false);

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

  const { t, i18n } = useTranslation('common');

  useEffect(() => {

  }, [sceneFontFamily, sceneFontSize]);

  // TODO 2.1 怎么解决重新渲染时旧钩子的调用问题（根本问题）
  // TODO 换个思路，重新加载Game页面？history采用localstorage存储？然后开创一个存档组件？
  let {
    displayedText,
    displayedStatus,
    effectText,
    effectType
  } = useTypingEffect({
    text: text,
    speed: speed,
    isGameStarted: isSceneStared,
    isTypingEffect: isTypingEffect || false,
    isSceneReset: isSceneReset,
  });



  if (onStatusChange) {
    onStatusChange(displayedStatus);
  }

  // useEffect(() => {
  //   if (displayedStatus === 'typing') {
  //     setIsSceneReset(true);
  //   } else {
  //     setIsSceneReset(false);
  //   }
  //   console.log(`2. 检测到语言改变，重新渲染Scene 渲染前 ${isSceneReset} 渲染后 ${displayedStatus === 'typing'}`);
  // }, [i18n.language]);

  // console.log({displayedText, displayedStatus, effectText, effectType});

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
