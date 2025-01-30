import React from 'react';

interface TextWithEffectsProps {
  text: string;
}

const TextWithEffects: React.FC<TextWithEffectsProps> = ({ text }) => {
  return <span dangerouslySetInnerHTML={{ __html: text }} />;
};

export default TextWithEffects;
