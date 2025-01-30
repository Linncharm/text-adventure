import React, {useEffect} from 'react';
import {useTranslation} from 'react-i18next';

interface ChoiceProps {
  text: string;
  onClick: () => void;
  isTransitioning: boolean;
}

const Choice: React.FC<ChoiceProps> = ({text, onClick, isTransitioning}) => {

  const {t} = useTranslation();

  return (
    <button className={`choice-button ${isTransitioning ? 'transitioning' : ''}`} onClick={onClick}>
      {t(text)}
    </button>
  );
};

export default Choice;
