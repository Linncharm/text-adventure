import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { parseTextWithEffects } from '@/utils';

// interface DisplayedStatusProps {
//   displayedStatus: "waiting" | "typing" | "finished";
// }

interface UseTypingEffectProps {
  text: string;
  speed: number;
  isGameStarted: boolean;
  isTypingEffect: boolean;
  onStatusChange?: (status: string) => void;
}

interface UseTypingEffectReturn {
  displayedText: string;
  effectText: string[];
  effectType: string[];
}

interface Options {
  clear?: boolean;
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
  const [displayedText, setDisplayedText] = useState('');
  const indexRef = useRef(0); // 使用 useRef 来存储 index
  const [effectText, setEffectText] = useState(['']); // 特效文本内容
  const [effectType, setEffectType] = useState(['']); // 文本特效类型

  if (!isTypingEffect) {
    if (loopId) {
      console.log('Typing effect is stopped.',loopId);
      clearTimeout(loopId);
      setLoopId(null);
      onStatusChange && onStatusChange('finished');
    }
  }

  const filterText = (translatedText: string) => {
    const { normalText, effects } = parseTextWithEffects(translatedText); // 解析特效部分
    console.log('effects', effects);
    const parsedType = effects.map((item) => item.effectType); // 获取特效类型
    const parsedContent = effects.map((item) => item.content); // 获取特效内容
    const parsedStartIdxArray = effects.map((item) => item.startIdx); // 获取特效开始位置
    setEffectText(parsedContent);
    setEffectType(parsedType);

    return {
      normalText,
      parsedStartIdxArray,
    };
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
    const { normalText, parsedStartIdxArray } = filterText(translatedText);

    setDisplayedText('');
    indexRef.current = 0;

    const typeCharacter = async () => {
      if (indexRef.current >= normalText.length) {
        onStatusChange && onStatusChange('finished');
        return;
      }

      const char = normalText.charAt(indexRef.current);
      setDisplayedText((prev) => prev + char);
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
    // 每当文本、速度或游戏开始状态变化时，重新开始打字
    const startTypingEffect = async () => {
      console.log('First Typing effect is starting...');
      setDisplayedText('');
      indexRef.current = 0;
      try {
        await startTyping();  // 确保 startTyping 完全执行后再进行其他操作
        console.log('完成字符打印');
      } catch (error) {
        console.error('Typing effect error', error);
      }
    };
    startTypingEffect(); // 异步调用
  }, [text, speed, isGameStarted]);

  return {
    displayedText,
    effectType,
    effectText,
  };
};

export default useTypingEffect;
