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
    showCompleteText = false
  } = props;

  const [isEffectTextStart, setIsEffectTextStart] = useState(false);

  // TODO 2.1 fontSizeClass又失效了
  const fontSizeClass = isCustomizeSceneFontSize ? `text-[${sceneFontSize}]` : `text-${sceneFontSize}`;
  const fontFamilyClass = sceneFontFamily ? `font-${sceneFontFamily}` : '';

  const { t } = useTranslation('common');

  useEffect(() => {

  }, [sceneFontFamily, sceneFontSize]);

  let {
    displayedText,
    effectDetail,
  } = useTypingEffect({
    text: text,
    speed: speed,
    isGameStarted: isSceneStared,
    isTypingEffect: isTypingEffect || false,
    onStatusChange: onStatusChange
  });


  return (
    <div className={`scene-text ${isTransitioning ? 'transitioning' : ''} ${fontFamilyClass} ${fontSizeClass}`}>
      {(
        <TextWithEffects
          effectDetail={effectDetail}
          text={showCompleteText ? t(text) : displayedText}
          triggerCompleteEffect={showCompleteText}
        />
        )
      }
      <span className="cursor">|</span>
    </div>

  );
};

export default Scene;
