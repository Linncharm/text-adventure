import { Position } from "reactflow";

export interface Choice {
  text: string
  nextNodeId: string
}

// 连接信息类型定义
// 可以有多个Story连接到一个Choice，但是一个Choice只能连接到一个Story
export interface ConnectionInfo {
  nodeId: string
  position: Position
}

// 节点数据类型定义
export interface NodeData {
  title: string
  content?: string  // 可选：用于 story 节点
  choices?: Choice[] // 可选：用于 choice 节点
  connectedNodes?: string[]  // 记录已连接的节点 ID
  connectedFrom?: ConnectionInfo  // 记录从哪个节点连接过来的
  connectedTo?: ConnectionInfo  // 记录连接到哪个节点
  directionalConnections?: { // 记录已连接的方向
    [Position.Top]: boolean
    [Position.Right]: boolean
    [Position.Bottom]: boolean
    [Position.Left]: boolean
  }
}
