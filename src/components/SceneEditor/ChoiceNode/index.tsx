import {memo} from 'react'
import {Handle, HandleType, NodeProps, Position} from 'reactflow'
import {PlusIcon} from '@heroicons/react/24/outline'
import {NodeData} from '../types'

import {
  createBaseNodeStyle,
  createHandleStyle,
  createAddButtonStyle,
  createContentStyles
} from '../styles/nodeStyles'

export const ChoiceNode = memo(({ id, data, isConnectable,selected }: NodeProps<NodeData>) => {

  const COLOR_THEME = 'amber'
  const styles = createContentStyles(COLOR_THEME)
  const connectedNodes = data.connectedNodes || []

  // console.log("choice data", data)

  // 获取已连接的方向，如果没有 connectedFrom，默认假设从左边连接
  //const addButtonPosition = data.connectedFrom?.position || Position.Left

  // 永远为左，因为story永远往右连
  const addButtonPosition = Position.Right

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
    return position === addButtonPosition ? 'source' : 'target'
  }

  const renderAddButton = (position: Position, className: string) => {
    // 检查该方向是否已经有连接
    if (!canAddMore) return null

    return (
      <button
        className={`absolute ${className} p-1 rounded-full transform hover:scale-110 transition-all
        ${connectedNodes.length >= 4 ? 'opacity-50 cursor-not-allowed' : ''}`}
        onClick={(e) => {
          e.stopPropagation()
          const event = new CustomEvent('add-story-node', {
            detail: {
              sourceNodeId: id,
              position: addButtonPosition,
              sourcePosition: addButtonPosition,
              targetPosition: getOppositePosition(addButtonPosition)
            }
          })
          window.dispatchEvent(event)
        }}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    )
  }

  // 确保 choice 节点只能创建一个连接
  const canAddMore = !data.connectedNodes || data.connectedNodes.length < 1
  console.log("canAddMore", canAddMore,data)

  return (
    <div className={createBaseNodeStyle(COLOR_THEME, selected)}>
      {Object.values(Position).map((position) => (
        (position === Position.Left || position === Position.Right) && <Handle
          key={position}
          type={getHandleType(position)}
          position={position}
          id={position}
          isConnectable={isConnectable}
          className={createHandleStyle(COLOR_THEME, false)}
        />
      ))}

      {
        Object.values(Position).map((position) => (
          position === addButtonPosition &&
          renderAddButton(position, createAddButtonStyle(COLOR_THEME, position, 'Choice'))
        ))
      }

      {/* 内容区域 */}
      <div className="space-y-4">
        <div className={styles.title}>
          {data.title}
        </div>
        <div className="space-y-2">
          {data.choices?.map((choice, index) => (
            <div
              key={index}
              className={`
                p-3
                bg-${COLOR_THEME}-100/50 dark:bg-${COLOR_THEME}-800/30
                backdrop-blur-sm
                rounded-lg
                text-sm
                text-${COLOR_THEME}-700 dark:text-${COLOR_THEME}-200
                border border-${COLOR_THEME}-200/30 dark:border-${COLOR_THEME}-700/30
                hover:bg-${COLOR_THEME}-200/50 dark:hover:bg-${COLOR_THEME}-700/40
                transition-colors duration-200
                cursor-pointer
              `}>
              {choice.text}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.decorativeBg}/>

    </div>
  )
})

ChoiceNode.displayName = 'ChoiceNode'
