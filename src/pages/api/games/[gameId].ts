import { NextApiRequest, NextApiResponse } from 'next';
import { GameDataDto } from "@/types/Game";
import gameData from "@/data/gameData";

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
