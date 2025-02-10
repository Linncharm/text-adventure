import React from "react";

type CustomizeFontSize = string;
type FontSize = 'xs' | 'sm' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl' | CustomizeFontSize;

// 默认设定
interface DefaultSettings {
  defaultFontFamily: string;
  isCustomizeDefaultFontSize: boolean;
  defaultFontSize: FontSize;

}

// 选择单元
interface Choice {
  text: string;
  nextSceneId: number;
  choiceFontFamily?: string;
  isCustomizeChoiceFontSize?: boolean;
  choiceFontSize?: FontSize;
}

// 场景单元
interface Scene {
  sceneId: number;
  text: string;
  choices: Choice[];
  sceneFontFamily?: string;
  isCustomizeSceneFontSize?: boolean;
  sceneFontSize?: FontSize;
}
// 全部的游戏数据
export interface GameDataDto {
  DefaultSettings: DefaultSettings;
  Story: Scene[];
}

export type SpanElementProps = {
  key: string;
  content: string;
  style?: React.CSSProperties;
};

export interface HistoryItem {
  sceneText: SpanElementProps[],
  choiceText: string,
  nextSceneId:number
}
