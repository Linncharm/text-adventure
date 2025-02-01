import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { parseTextWithEffects } from '@/utils';

interface DisplayedStatusProps {
  displayedStatus: "waiting" | "typing" | "finished";
}

interface UseTypingEffectProps {
  text: string;
  speed: number;
  isGameStarted: boolean;
  isTypingEffect: boolean;
  isSceneReset?: boolean;
}

interface UseTypingEffectReturn {
  displayedText: string;
  displayedStatus: DisplayedStatusProps['displayedStatus'];
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
    isSceneReset,
  } = props;

  const { t, i18n } = useTranslation('common');
  const [displayedText, setDisplayedText] = useState('');
  const [displayedStatus, setDisplayedStatus] = useState<DisplayedStatusProps['displayedStatus']>('waiting');
  const indexRef = useRef(0); // 使用 useRef 来存储 index
  const [effectText, setEffectText] = useState(['']); // 特效文本内容
  const [effectType, setEffectType] = useState(['']); // 文本特效类型

  const resetTypingEffect = () => {
    // 先清空，然后用新的语言重新输出
    setDisplayedText('');
    indexRef.current = 0;
    setDisplayedStatus('waiting');
    console.log('Typing effect has been reset.');
  };

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

  const sleep = (ms: number) => {
    return new Promise<void>((resolve) => {
      setTimeout(resolve, ms);
    });
  };


  const startTyping = async ():Promise<void> => {
    if (!isTypingEffect) {
      console.log('isTypingEffect is false');
      setDisplayedStatus('finished');
      setDisplayedText('');
      return;
    }

    if (isGameStarted) {
      setDisplayedStatus('typing');

      // 获取翻译后的文本
      const translatedText = t(text);

      // 过滤特效文本后的文本
      const { normalText, parsedStartIdxArray } = filterText(translatedText);
      console.log('filteredText', normalText);

      // 处理逐字打字的过程,当到达startIdx时，返回特效文字，当到达endIdx时，返回普通文字
      while (indexRef.current < normalText.length) {
        if (parsedStartIdxArray.includes(indexRef.current)) {
          // 处理特效部分（如果有）
        }
        const char = normalText.charAt(indexRef.current);

        setDisplayedText((prev) => prev + char);  // 拼接字符
        indexRef.current += 1;  // 增加 index

        // TODO 2.1 BUG 第一次加载时sleep失效
        if (char === '，' || char === ',') {
          await sleep(300);  // 暂停 0.3 秒
        } else if (char === '。' || char === '.') {
          console.log('暂停 0.5 秒');
          await sleep(500);  // 暂停 0.5 秒
        } else if (char === '：' || char === ':') {
          await sleep(500);  // 暂停 0.5 秒
        } else {
          await sleep(speed);  // 暂停 speed 毫秒
        }

      }
      setDisplayedStatus('finished');
    }
  };



  useEffect(() => {
    // 清理操作: 当 isSceneReset 为 true 时，重置打字效果
    if (isSceneReset) {
      console.log('Scene is being reset...');
      resetTypingEffect();  // 重置状态
      startTyping()
        .then(() => {
          console.log("完成重置字符打印");
        })
        .catch((error) => {
          console.error('Typing effect reset error', error);
        });
    }
  }, [isSceneReset]); // 监听 isSceneReset 变化

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
    displayedStatus,
    effectType,
    effectText,
  };
};

export default useTypingEffect;
