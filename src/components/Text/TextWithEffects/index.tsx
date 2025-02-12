import React, { useEffect, useState, useRef } from 'react';
import { parseTextWithEffects,sleep } from "@/utils";
import { useTranslation } from "react-i18next";

type SceneStatus = 'waiting' | 'typing' | 'finished';

type SpanElementProps = {
  key: string;
  content: string;
  style?: React.CSSProperties;
};

interface TextWithEffectsProps {
  speed: number;
  text: string;
  triggerCompleteEffect: boolean;
  sceneStatus: SceneStatus;
  onStatusChange: (status: SceneStatus) => void;
  onCompleteText: (completeText: SpanElementProps[]) => void; // New prop
}

const TextWithEffects: React.FC<TextWithEffectsProps> = (props) => {
  const { text, triggerCompleteEffect,speed,onStatusChange,sceneStatus,onCompleteText } = props;

  const { t,i18n } = useTranslation('common');
  const translatedText = t(text);


  const [displayedText, setDisplayedText] = useState<SpanElementProps[]>([]);
  const currentIndex = useRef(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { normalText, effects } = parseTextWithEffects(translatedText);

  const effectType = effects.map((item) => item.effectType); // 获取特效类型
  const effectText = effects.map((item) => item.content); // 获取特效内容
  const effectStartIdx = effects.map((item) => item.startIdx); // 获取特效开始位置



  let completeText: SpanElementProps[] = [];
  let effectIdx = 0;
  let currentEffectText = '';
  let currentIndexInText = 0;

  // 清理函数，用于清除现有的定时器
  const clearCurrentInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
      console.log("定时器清理完毕");
      onStatusChange('finished');
    }
  };

  const addSpanElement = (newText: SpanElementProps[], el: SpanElementProps) => {
    // 查找是否已有相同 key 的元素
    const index = newText.findIndex((item) => item.key === el.key);

    if (index >= 0) {
      // 如果有相同的 key，替换元素
      newText[index] = {
        ...newText[index], // 保留原有属性
        content: el.content, // 更新 content
        style: el.style ? el.style : undefined, // 更新 style
      };
    } else {
      // 如果没有相同 key，直接添加新元素
      newText.push(el);
    }
  };

  // 添加普通文本
  const addNormalText = (textToAdd: string,textType:SpanElementProps[]) => {
    if (textToAdd) {
      addSpanElement(textType, {
        key: currentIndexInText + '_normal',
        content: textToAdd,
      });
    }
  };

  const addEffectText = (textToAdd: string,textType:SpanElementProps[]) => {
    if (textToAdd) {
      addSpanElement(textType, {
        key: currentIndexInText + '_effect',
        content: textToAdd,
        style: { color: 'red', fontWeight: 'bold' },
      });
    }
  }

  // 获得所有的文本结构，通用部分
  const getCompleteText = () => {
    // 清空 completeText 数组，确保每次调用时都是新的空数组
    completeText.length = 0;

    while (currentIndexInText < normalText.length) {
      // 判断是否是特效文本
      if (effectIdx < effectStartIdx.length && effectStartIdx[effectIdx] === currentIndexInText) {

        // 如果有普通文本，添加到 completeText
        if (currentEffectText !== '') {
          addNormalText(currentEffectText, completeText);
          currentEffectText = ''; // 重置当前普通文本
        }

        // 添加特效文本
        addEffectText(effectText[effectIdx], completeText);

        // 更新索引，跳过特效文本长度
        currentIndexInText += effectText[effectIdx].length;
        effectIdx++;
      } else {
        // 如果是普通文本，拼接到 currentEffectText 中
        currentEffectText += normalText[currentIndexInText];
        currentIndexInText++;
      }
    }

    // 在循环结束后，检查是否有剩余的普通文本，并添加到 completeText
    if (currentEffectText !== '') {
      addNormalText(currentEffectText, completeText);
    }
  };

  const displayNextChar = async () => {
    const newText = [...displayedText];
    let totalLength = 0;

    // 计算所有文本的总长度
    completeText.forEach(el => {
      totalLength += el.content.length;
    });

    // 如果已经渲染完所有字符，清除定时器
    if (currentIndex.current >= totalLength) {
      return true;
    }

    let currentTotal = 0;
    for (let idx = 0; idx < completeText.length; idx++) {
      const el = completeText[idx];
      const contentLength = el.content.length;
      const prevTotal = currentTotal;
      currentTotal += contentLength;

      // 判断当前字符是否在这个元素内
      if (currentIndex.current < currentTotal) {
        const charPosition = currentIndex.current - prevTotal;

        // 先检查是否需要sleep，但不立即执行
        if (el.content[charPosition-1] === ',' ||
          el.content[charPosition-1] === '.' ||
          el.content[charPosition-1] === '。' ||
          el.content[charPosition-1] === '，') {
          await sleep(300);
        }

        // 先更新文本内容
        addSpanElement(newText, {
          key: el.key,
          content: el.content.substring(0, charPosition + 1),
          style: el.style || undefined,
        });
        break;
      } else {
        addSpanElement(newText, {
          key: el.key,
          content: el.content,
          style: el.style || undefined,
        });
      }
    }

    // 先更新显示的文本
    setDisplayedText(newText);
    currentIndex.current++;

    return false;
  };

  useEffect(() => {

    clearCurrentInterval();
    getCompleteText();

    // 如果触发了完成特效效果，直接渲染完整文本
    if (triggerCompleteEffect) {
      // 直接显示完整文本，并重置 currentIndex
      setDisplayedText(completeText);

      //  TODO: 02/10 目前只能返回当前语言的文本，多语言是动态变化还是静态备份？
      onCompleteText(completeText);
      currentIndex.current = 0;
      onStatusChange('finished');
    } else {
      onStatusChange('typing');
      // 重置当前索引，确保从头开始打字
      currentIndex.current = 0;
      setDisplayedText([]); // 清空显示的文本，重新开始

      const runDisplayNextChar = async () => {
        if (intervalRef.current === null) return; // 如果已经清理了定时器，就不继续执行

        const isComplete = await displayNextChar();
        if (!isComplete) {
          intervalRef.current = setTimeout(runDisplayNextChar, speed);
        } else {
          clearCurrentInterval();
        }
      };

      intervalRef.current = setTimeout(runDisplayNextChar, speed);

      // 存储新的定时器 ID
      // intervalRef.current = setInterval(async () => {
      //   const isComplete = await displayNextChar();
      //   if (isComplete) {
      //     clearCurrentInterval();
      //   }
      // }, speed);
    }

    // 组件卸载时清理定时器
    return clearCurrentInterval;


  }, [text, triggerCompleteEffect,sceneStatus]);

  return (
    <>
      {displayedText.map((el) => (
        <span key={el.key} style={el.style}>
          {el.content}
        </span>
      ))}
    </>
  );
};

export default TextWithEffects;
