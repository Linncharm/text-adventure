interface ParseTextWithEffectsReturn {
  effectType: string;
  content: string;
  startIdx: number;
  endIdx: number;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// TODO 思路一： 去掉特效标签后返回正常文本内容，同时返回特效类型和特效内容，以及特效文本的开始和结束位置
export const parseTextWithEffects = (inputText: string) => {
  const result: ParseTextWithEffectsReturn[] = [];
  let normalText = ''; // 用于保存去掉特效标签后的普通文本
  let lastIndex = 0; // 用于记录上一个特效的结束位置

  // 使用正则匹配 (effect:xxx) 标签和 (/effect:xxx) 结束标签
  inputText.replace(/\(effect:(.*?)\)(.*?)\(\/effect:\1\)/g, (match, effectType, content, offset) => {
    // 将特效前后的普通文本拼接到 normalText 中
    normalText += inputText.slice(lastIndex, offset); // 获取正常文本
    normalText += content; // 将匹配到的特效内容加入 normalText
    // 保存特效信息，包括特效类型、特效内容和特效在文本中的位置
    result.push({
      effectType,
      content,
      startIdx: offset,  // 特效文本开始位置
      endIdx: offset + content.length  // 特效文本结束位置
    });
    lastIndex = offset + match.length; // 更新上一个特效的结束位置
    return ''; // 返回空字符串，不替换实际内容
  });

  // 处理最后一个特效后的普通文本
  normalText += inputText.slice(lastIndex);

  // 返回去掉特效标签后的普通文本和特效信息
  return {
    normalText, // 去掉特效标签后的文本
    effects: result // 包含特效类型和内容的数组
  };
};

export const storage = (method: 'get' | 'set' | 'remove', key: string, value?: string) => {
    try {
      if (method === 'get') {
        return localStorage.getItem(key);
      }
      else if (method === 'set') {
        localStorage.setItem(key, value!);
      }
      else if (method === 'remove') {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.error('localStorage error', error);
    }
}
