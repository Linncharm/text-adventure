import React, { useEffect, useState, useRef } from 'react';
import { GameDataDto } from '@/types/Game';
import Scene from './Scene';
import Choice from './Choice';
import History from './History';
import Loading from './Loading'
import { useRouter } from 'next/router';
import { storage } from "@/utils";

import { SpanElementProps,HistoryItem } from "@/types/Game";

//SceneStatus有三种状态，分别是：'waiting', 'typing', 'finished'
type SceneStatus = 'waiting' | 'typing' | 'finished';

interface GameProps {
  gameId: string;
}

const Game: React.FC<GameProps> = ({ gameId }) => {

  // 1. Choice->Scene->TextWithEffects
  // 2. TextWithEffects->Scene
  const [sceneStatus, setSceneStatus] = useState<SceneStatus>('waiting');

  const router = useRouter();
  const { query } = router;

  const [gameData, setGameData] = useState<GameDataDto>();
  const [currentSceneId, setCurrentSceneId] = useState<number>(1);
  // const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  // const [isTypingEffect, setIsTypingEffect] = useState<boolean>(true);
  const [isGameFading, setIsGameFading] = useState(false);

  const [progress, setProgress] = useState(0);
  const [isLoadingComplete, setIsLoadingComplete] = useState(false);
  // 记录加载开始的时间
  const startTimeRef = useRef<number | null>(null);

  const fetchGameData = async () => {

    if (storage('get', `${gameId}-history`)) {
      const historyData = storage('get', `${gameId}-history`);
      if (!historyData) return;
      setHistory(JSON.parse(historyData));
      setCurrentSceneId(JSON.parse(historyData).pop().nextSceneId);
      setIsLoadingComplete(true);
    }

    if (storage('get', `${gameId}`)) {
      const data = storage('get', `${gameId}`);
      if (!data) return;
      setIsLoadingComplete(true);
      setGameData(JSON.parse(data));
      return;
    }

    const response = await fetch(`/api/games/${gameId}`);
    if (!response.ok) {
      console.error('Failed to fetch game data');
      return;
    }
    const data = await response.json();
    setGameData(data);
    if (gameId) storage('set', `${query.id}`, JSON.stringify(data));
  };

  const handleLoadingComplete = () => {
    setIsLoadingComplete(true);
  };

  const startGame = () => {
    setIsGameFading(true);
    setTimeout(() => {
      // setIsGameStarted(true);
      setIsGameFading(false);
    }, 1000); // 1秒后切换
  };

  // 只有在数据准备好后才渲染游戏内容
  useEffect(() => {
    fetchGameData().then(() => {
      // setIsGameStarted(true);
      startGame();
    });
  }, [gameId]);

  useEffect(() => {

    startTimeRef.current = Date.now();

    const timeoutId = setTimeout(() => {
      // 超过10秒后停止加载
      setProgress(100);
      setIsLoadingComplete(true);
    }, 10000); // 超时时间10秒

    const interval = setInterval(() => {

      if (gameData && Date.now() - startTimeRef.current! > 2000) {
        setProgress(100);
        clearInterval(interval);
        clearTimeout(timeoutId);
      }

      setProgress((prev) => {
        if (prev < 70) {
          return prev + Math.random() * 4 + 1; // Fast growth
        } else if (prev < 80) {
          return prev + Math.random() * 2 + 0.5; // Medium growth
        } else if (prev < 100) {
          return prev + Math.random() * 0.2 + 0.1; // Slow growth
        }
        clearInterval(interval);
        return 100;
      });
    }, 25);

    return () => {
      clearInterval(interval);
      clearTimeout(timeoutId);
    };
  }, [gameData]);

  // 如果没有游戏数据，渲染加载状态或占位符
  if (!gameData || !isLoadingComplete) {
    return (
      <Loading
        progress={progress}
        onComplete={handleLoadingComplete}
      />
    )
  }
  const { DefaultSettings, Story } = gameData;
  const currentScene = Story.find((scene) => scene.sceneId === currentSceneId);
  if (!currentScene) return null;

  const handleSceneStatusChange = (status: SceneStatus) => {
    setSceneStatus(status);
  }

  const handleHistoryText = (isSubmit:boolean,nextSceneId?: number, choiceText?: string,completeText?: SpanElementProps[]) => {
    if (completeText && !isSubmit) {
      // 暂存span的文本
      storage('set', `${gameId}-new-text`, JSON.stringify(completeText));
    }
    else if (isSubmit) {
      const newHistoryText = storage('get', `${gameId}-new-text`);
      if (!newHistoryText) return;
      const temp:SpanElementProps[] = JSON.parse(newHistoryText);
      const newHistory = [...history,{ sceneText: temp, choiceText: choiceText!,nextSceneId: nextSceneId! }];

      storage('remove', `${gameId}-new-text`);
      storage('set', `${gameId}-history`, JSON.stringify(newHistory));
      setHistory(newHistory);
      setCurrentSceneId(nextSceneId!);
      setIsTransitioning(false);
      setSceneStatus('waiting');
    }

  }

  // TODO 频繁点击会出现文字错乱bug
  const handleChoiceSelect = (nextSceneId: number, choiceText: string) => {
    if (sceneStatus === 'typing') {
      setSceneStatus('finished');
    }
    else if (sceneStatus === 'finished') //重置sceneStatus
    {
      setIsTransitioning(true); // 设置完后Scene会渲染一次，保留着上一次的text
      setTimeout(() => {

        handleHistoryText(true,nextSceneId, choiceText);
      }, 1000); // Duration of the transition
    }
  };

  return (
    <div className="main-content">
      <div className={`game-container ${isGameFading ? 'fade-in' : ''}`}>
        {history.length > 0 &&
          <History historyItems={history} />
        }
        <span>{gameId}</span>
        <Scene
          text={currentScene.text}

          speed={100}
          isTransitioning={isTransitioning}

          sceneStatus={sceneStatus}

          onCompleteText={(completeText) => handleHistoryText(false,undefined,undefined,completeText)}
          onStatusChange={handleSceneStatusChange} // 通过scene间接传给hook
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
      </div>
    </div>
  );
};

export default Game;
