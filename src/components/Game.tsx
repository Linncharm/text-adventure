import React, {useState} from 'react';
import gameData from '../data/gameData';
import Scene from './Scene';
import Choice from './Choice';
import History from './History';

import { useTranslation } from "react-i18next";

const Game: React.FC = () => {
  const { t } = useTranslation('common');

  const [currentSceneId, setCurrentSceneId] = useState<number>(1);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [history, setHistory] = useState<{ sceneText: string; choiceText: string }[]>([]);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isTypingEffect, setIsTypingEffect] = useState<boolean>(true);

  const [isButtonFading, setIsButtonFading] = useState(false);
  const [isGameFading, setIsGameFading] = useState(false);

  const [sceneStatus, setSceneStatus] = useState<string>('');

  const startGame = () => {
    // 游戏内容淡出
    setIsGameFading(true);

    // 延迟切换到游戏界面，淡出效果完成后
    setTimeout(() => {
      setIsGameStarted(true);
      setIsGameFading(false);
    }, 1000); // 1秒后切换
  };

  const currentScene = gameData.find((scene) => scene.sceneId === currentSceneId);
  if (!currentScene) return null;

  const handleChoiceSelect = (nextSceneId: number, choiceText: string) => {
    console.log('handleChoiceSelect',sceneStatus);
    if (sceneStatus === 'typing') {
      setIsTypingEffect(false);
      setSceneStatus('finished');
    }
    else if (sceneStatus === 'finished') {
      setIsTypingEffect(true);
      setIsTransitioning(true);
      setTimeout(() => {
        setHistory([...history, {sceneText: currentScene.text, choiceText}]);
        setCurrentSceneId(nextSceneId);
        setIsTransitioning(false);
      }, 1000); // Duration of the transition
    }

  };

  return (
    <div className={`game-container ${isGameFading ? 'fade-in' : ''}`}>
      {!isGameStarted ? (
        <button
          className={`rounded-2xl ${isButtonFading ? 'fade-in' : ''}`}
          onClick={() => {
            setIsGameStarted(true);
            startGame();
          }}>
          {t('start')}
        </button>
      ) : (
        <>
          {history.length > 0 &&
            <History historyItems={history}/>
          }
          <Scene
            text={currentScene.text}
            isTypingEffect={isTypingEffect}
            speed={100}
            isSceneStared={isGameStarted}
            isTransitioning={isTransitioning}
            onStatusChange={setSceneStatus}
          />
          {currentScene.choices && (
            <div className={`choices ${isTransitioning ? 'transitioning' : ''}`}>
              {currentScene.choices.map((choice, index) => (
                <Choice
                  key={index}
                  text={choice.text}
                  onClick={() => handleChoiceSelect(choice.nextSceneId, choice.text)}
                  isTransitioning={isTransitioning}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Game;
