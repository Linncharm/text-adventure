import React, { useRef, useEffect, useState, JSX } from 'react';
import {parseTextWithEffects} from "@/utils";

type EffectsDetail = {
  effectText: string[];
  effectType: string[];
  effectStartIdx: number[];
}

type spanElementProps = {
  key: string;
  content: string;
  style?: React.CSSProperties;
}

interface TextWithEffectsProps {
  effectDetail: EffectsDetail;
  text: string;
  triggerCompleteEffect: boolean;  // 新增的prop，用于控制是否显示完整特效文本
}

const TextWithEffects: React.FC<TextWithEffectsProps> = (props) => {

  const { effectDetail, text, triggerCompleteEffect } = props;
  const { effectText, effectType, effectStartIdx } = effectDetail;

  const currentIndex = text.length - 1; // 用于控制逐字显示的索引

  // 用于存储需要应用特效的部分的span ref
  // const spanRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // 用于渲染最终的文本内容
  const [displayedText, setDisplayedText] = useState<spanElementProps[]>([]);

  useEffect(() => {
    if (triggerCompleteEffect) {
      // 如果触发了完成特效效果，直接渲染完整文本
      let fullText: spanElementProps[] = [];
      let effectIdx = 0;
      let currentText = '';
      let currentIndexInText = 0;

      //处理文本
      const { normalText } = parseTextWithEffects(text);

      // 完全渲染文本
      while (currentIndexInText < normalText.length) {
        if (effectIdx < effectStartIdx.length && effectStartIdx[effectIdx] === currentIndexInText) {
          // 如果有特效文本
          if (currentText) {
            fullText.push({
              key: currentIndexInText + '_normal',
              content: currentText
            });
            currentText = ''; // 重置普通文本
          }
          fullText.push(
            {
              key: currentIndexInText + '_effect',
              content: effectText[effectIdx],
              style: { color: 'red', fontWeight: 'bold' } // 根据effectType来应用不同样式
            }
          );

          currentIndexInText = currentIndexInText + effectText[effectIdx].length - 1;
          effectIdx++;

        } else {
          currentText += normalText[currentIndexInText];
        }

        currentIndexInText++;
      }

      // 如果还有剩余普通文本，加入到渲染结果中
      if (currentText) {
        fullText.push({
          key: currentIndexInText + '_normal',
          content: currentText
        });
      }

      setDisplayedText(fullText);
    } else {
      // 否则按照逐字递增的效果渲染
      let newText: spanElementProps[] = [];
      let effectIdx = 0;
      let currentEffectText = '';
      let currentIndexInText = 0;

      while (currentIndexInText <= currentIndex) {
        // 检查是否到达下一个特效文本的开始位置
        if (effectIdx < effectStartIdx.length && effectStartIdx[effectIdx] === currentIndexInText) {
          // 如果前面还有普通文本，需要先添加
          if (currentEffectText) {
            newText.push(
              {
                key: currentIndexInText + '_normal',
                content: currentEffectText
              }
            );
          }

          // TODO: 完成特效文本的逐字显示
          // 当前是特效文本
          newText.push(
            {
              key: currentIndexInText + '_effect',
              content: effectText[effectIdx],
              style: { color: 'red', fontWeight: 'bold'}
            }
          );

          // 更新索引
          currentIndexInText = currentIndexInText + effectText[effectIdx].length - 1;
          currentEffectText = ''; // 重置普通文本
          effectIdx++;

        } else {
          // 否则继续积累普通文本
          currentEffectText += text[currentIndexInText];
        }

        currentIndexInText++;
      }

      // 如果有剩余的普通文本，将它们添加到渲染结果中
      if (currentEffectText) {
        newText.push({
          key: currentIndexInText + '_normal',
          content: currentEffectText
        });
      }

      setDisplayedText(newText);
    }
  }, [currentIndex, effectText, effectType, effectStartIdx, text, triggerCompleteEffect]);

  return (
    <>
      {
        displayedText.map((el) => {
          return (
            <span
              key={el.key}
              style={el.style}
            >
              {el.content}
            </span>
          )
        })
      }
    </>
  )
};

export default TextWithEffects;
