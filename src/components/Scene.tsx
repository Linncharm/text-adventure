import React, {useEffect, useRef, useState} from 'react';
import { useTranslation } from 'react-i18next';
import TextWithEffects from '../components/Text/TextWithEffects'
import { SpanElementProps } from '@/types/Game';

type SceneStatus = 'waiting' | 'typing' | 'finished';


interface SceneProps {
  text: string;
  speed: number;

  isTransitioning: boolean;
  sceneStatus: SceneStatus;

  onStatusChange: (status: SceneStatus) => void;
  onCompleteText: (completeText: SpanElementProps[]) => void;
}

const Scene: React.FC<SceneProps> = (props:SceneProps) => {

  const {
    text, // transition结束后的新text
    speed,
    isTransitioning,
    sceneStatus,
    onStatusChange,
    onCompleteText
  } = props;

  const { t } = useTranslation('common');

  const oldText = useRef<string>(props.text);

  // 监听 text 变化并更新 oldText
  useEffect(() => {
    oldText.current = text;
  }, [text]);

  // status为finished，且transition结束或text没有变化后，返回true
  const isFinished= () => {
    if (oldText.current !== text) {
      return false;
    }
    else if (sceneStatus === 'finished') {
      return true;
    }
    return false;
  }

  // console.table([{
  //   isFinished: isFinished(),
  //   isTransitioning,
  //   oldText: oldText.current,
  //   newText: text,
  //   sceneStatus
  // }]);


  return (
    <div className={`scene-text ${isTransitioning ? 'transitioning' : ''}`}>
      {(
        <TextWithEffects
          text={t(text)}
          triggerCompleteEffect={isFinished()}

          sceneStatus={sceneStatus}

          speed={speed}

          onCompleteText={onCompleteText}
          onStatusChange={onStatusChange}
        />
        )
      }
      <span className="cursor">|</span>
    </div>

  );
};

export default Scene;
