import { memo, useCallback } from 'react'
import { Handle, Position, NodeProps,HandleType } from 'reactflow'
import { PlusIcon } from '@heroicons/react/24/outline'
import { NodeData } from '../types'

import {
  createBaseNodeStyle,
  createHandleStyle,
  createAddButtonStyle,
  createContentStyles
} from '../styles/nodeStyles'

// 用于跟踪方向连接的接口
interface DirectionalConnections {
  [Position.Top]: boolean
  [Position.Right]: boolean
  [Position.Bottom]: boolean
  [Position.Left]: boolean
}

export const StoryNode = memo(({ id, data, isConnectable,selected }: NodeProps<NodeData>) => {

  /// console.log("story data", data)
  // 定义主题
  const COLOR_THEME = 'green'
  const styles = createContentStyles(COLOR_THEME)
  // console.log("story data", data)

  const addButtonPosition = data.connectedFrom?.position

  // 获取相反的方向
  function getOppositePosition(position: Position): Position {
    switch (position) {
      case Position.Left:
        return Position.Right
      case Position.Right:
        return Position.Left
      case Position.Top:
        return Position.Bottom
      case Position.Bottom:
        return Position.Top
      default:
        return Position.Right
    }
  }

  // 设置handle为source或者target
  const getHandleType = (position: Position): HandleType => {
    // addButtonPosition不存在时默认都是source
    if (!addButtonPosition) return 'source'
    return position === getOppositePosition(addButtonPosition) ? 'target' : 'source'
  }

  const connectedNodes = data.connectedNodes || []
  const directionalConnections = data.directionalConnections || {
    [Position.Top]: false,
    [Position.Right]: false,
    [Position.Bottom]: false,
    [Position.Left]: false
  }



  const canAddMore = connectedNodes.length < 4

  const renderAddButton = (position: Position, className: string) => {
    // 检查该方向是否已经有连接
    if (!canAddMore || directionalConnections[position]) return null

    return (
      <button
        className={`absolute ${className} p-1 rounded-full transform hover:scale-110 transition-all
          ${connectedNodes.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          if (canAddMore) {
            const event = new CustomEvent('add-choice-node', {
              detail: {
                sourceNodeId: id,
                position
              }
            })
            window.dispatchEvent(event)
          }
        }}
        disabled={!canAddMore}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    )
  }



  return (
    <div className={createBaseNodeStyle(COLOR_THEME, selected)}>
      {Object.values(Position).map((position) => (
        <Handle
          key={position}
          type={getHandleType(position)}
          position={position}
          id={position}
          isConnectable={isConnectable && !directionalConnections[position]}
          className={createHandleStyle(
            COLOR_THEME,
            directionalConnections[position]
          )}
        />
      ))}

      {Object.values(Position).map((position) =>
        renderAddButton(
          position,
          createAddButtonStyle(COLOR_THEME, position,'Story')
        )
      )}

      {/* 内容区域 */}
      <div className="space-y-4">
        <div className={styles.title}>
          {data.title}
        </div>
        <div className={styles.content}>
          {data.content}
        </div>
      </div>

      {/* 装饰性背景 */}
      <div className={styles.decorativeBg}/>

    </div>
  )
})

StoryNode.displayName = 'StoryNode'
