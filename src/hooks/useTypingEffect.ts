import {useState, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import { sleep , parseTextWithEffects } from '@/utils';

interface DisplayedStatusProps {
  displayedStatus: "waiting" | "typing" | "finished";
}

interface UseTypingEffectProps {
  text: string;
  speed: number;
  isGameStarted: boolean;
  isTypingEffect: boolean;
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

const useTypingEffect = (props:UseTypingEffectProps):UseTypingEffectReturn => {
  const {
    text,
    speed,
    isGameStarted,
    isTypingEffect
  } = props;

  const {t} = useTranslation('common');
  const [displayedText, setDisplayedText] = useState('');
  const [displayedStatus, setDisplayedStatus] = useState<DisplayedStatusProps['displayedStatus']>('waiting');
  const indexRef = useRef(0); // 使用 useRef 来存储 index
  const [effectText, setEffectText] = useState(['']); // 特效文本内容
  const [effectType, setEffectType] = useState(['']); // 文本特效类型

  const filterText = (translatedText:string) => {
    const { normalText , effects } = parseTextWithEffects(translatedText); // 先解析特效部分
    console.log('effects',effects);
    const parsedType = effects.map((item) => item.effectType); // 获取特效类型
    const parsedContent = effects.map((item) => item.content); // 获取特效内容
    const parsedStartIdxArray = effects.map((item) => item.startIdx); // 获取特效开始位置
    setEffectText(parsedContent);
    setEffectType(parsedType);

    return {
      normalText,
      parsedStartIdxArray
    };

  }


  const startTyping = async (options:Options) => {

    const {clear} = options;

    if (!isTypingEffect) {
      console.log('isTypingEffect is false');
      setDisplayedStatus('finished');
      setDisplayedText('');
      return;
    }

    if (isGameStarted) {
      setDisplayedStatus('typing');
      if (clear) {
        setDisplayedText('');
        indexRef.current = 0;
      }

      // 获取翻译后的文本
      const translatedText = t(text);

      // 过滤特效文本后的文本
      const { normalText , parsedStartIdxArray } = filterText(translatedText)
      console.log('filteredText',normalText);

      // 处理逐字打字的过程,当到达startIdx时，返回特效文字，当到达endIdx时，返回普通文字
      while (indexRef.current < normalText.length) {
        if (parsedStartIdxArray.includes(indexRef.current)) {

        }
        const char = normalText.charAt(indexRef.current);
        setDisplayedText((prev) => prev + char);  // 拼接字符
        indexRef.current += 1;  // 增加 index

        // 如果当前字符是“，“ 或者 “。”
        if (char === '，' || char === ',') {
          await sleep(300);  // 暂停 0.2 秒
        }

        if (char === '。' || char === '.') {
          await sleep(500);  // 暂停 0.4 秒
        }

        if (char === '：' || char === ':') {
          await sleep(500);  // 暂停 0.5 秒
        }

        await sleep(speed);
      }
      setDisplayedStatus('finished');
    }
  };

  useEffect(() => {
    setDisplayedText('');
    indexRef.current = 0;
    startTyping({clear:true});
  }, [text, speed, isGameStarted]); // 当 isGameStarted 为 true 时开始打字


  // TODO 优化切换语言时的显示效果
  useEffect(()=>{
    if (displayedStatus === 'finished') {
      setDisplayedText(t(text));
    }
    else if (displayedStatus === 'typing') {
      setDisplayedText(t(text).slice(0, indexRef.current));
      startTyping({clear:false}); // 从当前位置开始打字
    }
  },[t])

  return {
    displayedText,
    displayedStatus,
    effectType,
    effectText
  };
};

export default useTypingEffect;
