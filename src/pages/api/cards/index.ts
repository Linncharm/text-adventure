import { NextApiRequest, NextApiResponse } from 'next';
import { shuffle } from 'lodash';
import { GameCard } from '@/types/Card';

const cards:GameCard[] = [
  { id: '1', title: 'Game-1', description: 'Description for Game 1,Test TEST aaa', imageURL: '/images/image1.jpg' },
  { id: '2', title: 'Game-2', description: 'Description for Game 2,Test TEST bbb', imageURL: '/images/image1.jpg' },
  { id: '3', title: 'Game-3', description: 'Description for Game 3,Test TEST ccc', imageURL: '/images/image1.jpg' },
  { id: '4', title: 'Game-4', description: 'Description for Game 4,Test TEST ddd', imageURL: '/images/image1.jpg' },
  { id: '5', title: 'Game-5', description: 'Description for Game 5,Test TEST eee', imageURL: '/images/image1.jpg' },
  { id: '6', title: 'Game-6', description: 'Description for Game 6,Test TEST fff', imageURL: '/images/image1.jpg' },
  { id: '7', title: 'Game-7', description: 'Description for Game 7,Test TEST ggg', imageURL: '/images/image1.jpg' },
  { id: '8', title: 'Game-8', description: 'Description for Game 8,Test TEST hhh', imageURL: '/images/image1.jpg' },
  { id: '9', title: 'Game-9', description: 'Description for Game 9,Test TEST iii', imageURL: '/images/image1.jpg' },
  { id: '10', title: 'Game-10', description: 'Description for Game 10,Test TEST jjj', imageURL: '/images/image1.jpg' },
  { id: '11', title: 'Game-11', description: 'Description for Game 11,Test TEST kkk', imageURL: '/images/image1.jpg' },
  { id: '12', title: 'Game-12', description: 'Description for Game 12,Test TEST lll', imageURL: '/images/image1.jpg' },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 获取当前加载的页数，默认从第 0 页开始
  const page = parseInt(req.query.page as string) || 0;

  // 按照洗牌后的顺序排列卡片
  const shuffledCards = shuffle(cards);

  // 计算当前页的起始和结束位置
  const startIndex = page * 3;
  const endIndex = startIndex + 3;

  // 获取当前页的卡片
  const selectedCards = shuffledCards.slice(startIndex, endIndex);

  // 如果没有更多卡片，返回空数组
  if (selectedCards.length === 0) {
    return res.status(200).json([]);
  }

  // 返回选中的卡片
  return res.status(200).json(selectedCards);
}
