import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { parseTextWithEffects } from '@/utils';

type HandleTextReturn = {
  normalText: string;
  parsedType: string[];
  parsedContent: string[];
  parsedStartIdxArray: number[];
}

type EffectsDetail = {
  effectText: string[];
  effectType: string[];
  effectStartIdx: number[];
}

interface UseTypingEffectProps {
  text: string;
  speed: number;
  isGameStarted: boolean;
  isTypingEffect: boolean;
  onStatusChange?: (status: string) => void;
}

interface UseTypingEffectReturn {
  displayedText: string;
  effectDetail:EffectsDetail;
}

const useTypingEffect = (props: UseTypingEffectProps): UseTypingEffectReturn => {

  const {
    text,
    speed,
    isGameStarted,
    isTypingEffect,
    onStatusChange,
  } = props;

  const [loopId, setLoopId] = useState<NodeJS.Timeout | null>(null);

  const { t, i18n } = useTranslation('common');
  const [displayedText, setDisplayedText] = useState(''); // 需要动态更新
  const indexRef = useRef(0); // 使用 useRef 来存储 index


  const [effectsDetail, setEffectsDetail] = useState<EffectsDetail>({
    effectText:[''],
    effectType:[''],
    effectStartIdx:[0]
  }); // 特效详情

  const isFirstRender = useRef(true); // 通过 useRef 来标记是否是第一次计算

  if (!isTypingEffect) {
    if (loopId) {
      console.log('Typing effect is stopped.', loopId);
      clearTimeout(loopId);
      setLoopId(null);
      onStatusChange && onStatusChange('finished');
    }
  }

  const filterText = (translatedText: string):HandleTextReturn => {

    // 计算文本和特效
    const { normalText, effects } = parseTextWithEffects(translatedText); // 解析特效部分
    const parsedType = effects.map((item) => item.effectType); // 获取特效类型
    const parsedContent = effects.map((item) => item.content); // 获取特效内容
    const parsedStartIdxArray = effects.map((item) => item.startIdx); // 获取特效开始位置


    return {
      normalText,
      parsedType,
      parsedContent,
      parsedStartIdxArray
    }
  };

  const startTyping = async () => {
    if (!isTypingEffect) {
      console.log('isTypingEffect is false');
      onStatusChange && onStatusChange('finished');
      setDisplayedText('');
      return;
    }

    if (!isGameStarted) return;

    onStatusChange && onStatusChange('typing');
    const translatedText = t(text);
    const { normalText, parsedStartIdxArray, parsedType, parsedContent } = filterText(translatedText);

    setDisplayedText('');

    setEffectsDetail({
      effectText:parsedContent,
      effectType:parsedType,
      effectStartIdx:parsedStartIdxArray
    })

    indexRef.current = 0;

    const typeCharacter = async () => {
      if (indexRef.current >= normalText.length) {
        onStatusChange && onStatusChange('finished');
        return;
      }

      const char = normalText.charAt(indexRef.current);
      setDisplayedText((prev) => prev + char); // 动态更新 displayedText
      indexRef.current++;

      let delay = speed;
      if (char === '，' || char === ',') delay = 300;
      else if (char === '。' || char === '.') delay = 500;
      else if (char === '：' || char === ':') delay = 500;

      let loopId = setTimeout(typeCharacter, delay); // 递归调用
      setLoopId(loopId);
    };

    typeCharacter(); // 启动递归
  };

  useEffect(() => {
    // 重置 isFirstRender
    isFirstRender.current = true; // text 改变时，重置 isFirstRender
    startTyping(); // 异步调用

  }, [text, speed, isGameStarted, isTypingEffect]); // 如果 text, speed 或 game 状态变化，则触发

  return {
    displayedText, // 动态更新的文本
    effectDetail:effectsDetail, // 文本对应的特效
  };
};

export default useTypingEffect;
