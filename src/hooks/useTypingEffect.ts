import {useState, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {sleep} from '@/utils';

interface DisplayedStatusProps {
  displayedStatus: "waiting" | "typing" | "finished";
}

interface UseTypingEffectProps {
  text: string;
  speed: number;
  isGameStarted: boolean;
  isTypingEffect: boolean;
}

interface Options {
  clear?: boolean;
}

const useTypingEffect = (props:UseTypingEffectProps) => {
  const {
    text,
    speed,
    isGameStarted,
    isTypingEffect
  } = props;
  const {t} = useTranslation();
  const [displayedText, setDisplayedText] = useState('');
  const [displayedStatus, setDisplayedStatus] = useState<DisplayedStatusProps['displayedStatus']>('waiting');
  const indexRef = useRef(0); // 使用 useRef 来存储 index

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

      // 处理逐字打字的过程
      while (indexRef.current < translatedText.length) {
        const char = translatedText.charAt(indexRef.current);
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

  return {displayedText, displayedStatus};
};

export default useTypingEffect;
