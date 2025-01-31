import { NextApiRequest, NextApiResponse } from 'next';
import { GameDataDto } from "@/types/Game";

const gameData: GameDataDto = {
  DefaultSettings:{
    isCustomizeDefaultFontSize:false,
    defaultFontFamily:"cursive",
    defaultFontSize:"xl"
  },
  Story:[
    {
      sceneFontFamily: "monospace",
      sceneFontSize: "2xl",
      sceneId: 1,
      text: "scene1.text",
      choices: [
        {
          text: "scene1.choice1",
          nextSceneId: 2
        },
        {text: "scene1.choice2", nextSceneId: 3}
      ]
    },
    {
      sceneFontFamily: "monospace",
      sceneFontSize: "3xl",
      sceneId: 2,
      text: "scene2.text",
      choices: [
        {text: "scene2.choice1", nextSceneId: 4},
        {text: "scene2.choice2", nextSceneId: 3}
      ]
    },
    {
      sceneFontFamily: "arial",
      isCustomizeSceneFontSize: true,
      sceneFontSize: "40px",
      sceneId: 3,
      text: "scene3.text",
      choices: [
        {text: "scene3.choice1", nextSceneId: 5},
        {text: "scene3.choice2", nextSceneId: 1}
      ]
    },
    {
      sceneId: 4,
      text: "scene4.text",
      choices: [
        {text: "scene4.choice1", nextSceneId: 6},
        {text: "scene4.choice2", nextSceneId: 3}
      ]
    },
    {
      sceneId: 5,
      text: "scene5.text",
      choices: [
        {text: "scene5.choice1", nextSceneId: 7},
        {text: "scene5.choice2", nextSceneId: 3}
      ]
    },
    {
      sceneId: 6,
      text: "scene6.text",
      choices: [
        {text: "scene6.choice1", nextSceneId: 5},
        {text: "scene6.choice2", nextSceneId: 8}
      ]
    },
    {
      sceneId: 7,
      text: "scene7.text",
      choices: [
        {text: "scene7.choice1", nextSceneId: 9},
        {text: "scene7.choice2", nextSceneId: 10}
      ]
    },
    {
      sceneId: 8,
      text: "scene8.text",
      choices: [
        {text: "scene8.choice1", nextSceneId: 5},
        {text: "scene8.choice2", nextSceneId: 1}
      ]
    },
    {
      sceneId: 9,
      text: "scene9.text",
      choices: [
        {text: "scene9.choice1", nextSceneId: 11},
        {text: "scene9.choice2", nextSceneId: 10}
      ]
    },
    {
      sceneId: 10,
      text: "scene10.text",
      choices: [
        {text: "scene10.choice1", nextSceneId: 1},
        {text: "scene10.choice2", nextSceneId: 12}
      ]
    },
    {
      sceneId: 11,
      text: "scene11.text",
      choices: [
        {text: "scene11.choice1", nextSceneId: 13},
        {text: "scene11.choice2", nextSceneId: 10}
      ]
    },
    {
      sceneId: 12,
      text: "scene12.text",
      choices: []
    },
    {
      sceneId: 13,
      text: "scene13.text",
      choices: [
        {text: "scene13.choice1", nextSceneId: 14},
        {text: "scene13.choice2", nextSceneId: 10}
      ]
    },
    {
      sceneId: 14,
      text: "scene14.text",
      choices: [
        {text: "scene14.choice1", nextSceneId: 15},
        {text: "scene14.choice2", nextSceneId: 10}
      ]
    },
    {
      sceneId: 15,
      text: "scene15.text",
      choices: [
        {text: "scene15.choice1", nextSceneId: 16},
        {text: "scene15.choice2", nextSceneId: 17}
      ]
    },
    {
      sceneId: 16,
      text: "scene16.text",
      choices: [
        {text: "scene16.choice1", nextSceneId: 18},
        {text: "scene16.choice2", nextSceneId: 10}
      ]
    },
    {
      sceneId: 17,
      text: "scene17.text",
      choices: [
        {text: "scene17.choice1", nextSceneId: 19},
        {text: "scene17.choice2", nextSceneId: 10}
      ]
    },
    {
      sceneId: 18,
      text: "scene18.text",
      choices: []
    },
    {
      sceneId: 19,
      text: "scene19.text",
      choices: [
        {text: "scene19.choice1", nextSceneId: 20},
        {text: "scene19.choice2", nextSceneId: 10}
      ]
    },
    {
      sceneId: 20,
      text: "scene20.text",
      choices: []
    }
  ]
}

const fetchGameData = async (gameId: string) => {
  if (gameId === 'Game-1') {
    console.log('Game-1');
    return gameData;
  } else {
    console.log('Game-2');
    return gameData;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { gameId } = req.query; // 获取动态参数 gameId

  if (typeof gameId !== 'string') {
    return res.status(400).json({ error: 'Invalid gameId' });
  }

  try {
    const gameData = await fetchGameData(gameId); // 获取游戏数据
    res.status(200).json(gameData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch game data' });
  }
}
