import React, {useCallback, useState, useRef, useEffect, forwardRef, useImperativeHandle, useMemo} from 'react'
import ReactFlow, {
  Node,
  Edge,
  SelectionMode,
  Background,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState, Position, MarkerType,
  OnSelectionChangeParams,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { StoryNode } from './StoryNode'
import { ChoiceNode } from './ChoiceNode'
import { Toolbar } from "@/components/SceneEditor/ToolBar";
import { NodeData } from './types'
import { selectionStyles } from './styles/section'
import { debouncedFn, throttledFn } from '@/utils/performance'

const DEFAULT_CHOICE_NODE_HEIGHT = 122
const DEFAULT_STORY_NODE_HEIGHT = 200
const THROTTLE_TIME = 10

interface SceneEditorProps {
  initialNodes: Node[]
  initialEdges: Edge[]
  onSave?: (nodes: Node[], edges: Edge[]) => void
  onNodeSelect?: (node: Node<NodeData> | null) => void
  onPanelClick?: (status:boolean) => void
}

const nodeTypes = {
  story: StoryNode,
  choice: ChoiceNode,
}

// 添加默认边样式
const defaultEdgeOptions = {
  type: 'smoothstep',
  markerEnd: {
    type: MarkerType.Arrow,
    width: 20,
    height: 20,
    color: '#6B7280',
  },
  style: {
    strokeWidth: 2,
    stroke: '#6B7280',
  },
  animated: true,
};

const SceneEditor = forwardRef(({
  initialNodes,
  initialEdges,
  onSave,
  onNodeSelect,
  onPanelClick,
}: SceneEditorProps,ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [isPanning, setIsPanning] = useState(false)

  // 添加计数器 ref
  const storyCountRef = useRef<number>(0)
  const choiceCountsRef = useRef<Map<string, number>>(new Map())

  // 获取下一个节点编号
  // TODO 增加删除节点功能
  const getNextNodeNumber = useCallback((
    type: 'story' | 'choice',
    sourceNodeId?: string
  ) => {
    if (type === 'story') {
      storyCountRef.current += 1
      return storyCountRef.current
    } else {
      // 如果是选择节点，检查源节点的计数
      if (!sourceNodeId) return 1
      const currentCount = choiceCountsRef.current.get(sourceNodeId) || 0
      const nextCount = currentCount + 1
      choiceCountsRef.current.set(sourceNodeId, nextCount)
      return nextCount
    }
  }, [])

  // 使用 useMemo 缓存静态配置
  const flowConfig = useMemo(() => ({
    defaultEdgeOptions,
    nodeTypes,
    minZoom: 0.2,
    selectionMode: SelectionMode.Partial,
    selectionOnDrag: true,
    panOnDrag: [1],
    selectNodesOnDrag: true,
    multiSelectionKeyCode: "Shift",
    deleteKeyCode: "Delete",
  }), [])

  // TODO 节点数大于 1 时才做节流处理
  // 节流处理节点变化
  const throttledNodesChange = useCallback(
    throttledFn((changes: any) => {
      onNodesChange(changes)
    }, THROTTLE_TIME),
    []
  )

  // 节流处理边的变化
  const throttledEdgesChange = useCallback(
    throttledFn((changes: any) => {
      onEdgesChange(changes)
    }, THROTTLE_TIME),
    []
  )

  // 节流处理连接
  const throttledConnect = useCallback(
    throttledFn((params: Connection) => {
      setEdges((eds) => addEdge(params, eds))
    }, THROTTLE_TIME),
    [setEdges]
  )

  // 防抖处理选择变化
  const debouncedSelectionChange = useCallback(
    debouncedFn((params: OnSelectionChangeParams) => {
      selectedNodesRef.current = params.nodes
    }, 100),
    []
  )

  useImperativeHandle(ref, () => ({
    setNodes,
  }));

  const selectedNodesRef = useRef<Node[]>([])

  // 处理鼠标按下事件
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button === 1) {
      setIsPanning(true)
    }
  }, [])

  // 处理鼠标松开事件
  const handleMouseUp = useCallback((event: React.MouseEvent) => {
    if (event.button === 1) {
      setIsPanning(false)
      return
    }

    // 如果有两个或以上节点被选中
    if (selectedNodesRef.current.length >= 2) {
      const selectionElement = document.querySelector('.react-flow__selection') as HTMLElement
      if (selectionElement) {
        const rect = selectionElement.getBoundingClientRect()
        const flowPane = document.querySelector('.react-flow__renderer') as HTMLElement
        const flowRect = flowPane.getBoundingClientRect()

      }
    }
  }, [])

  const getOppositePosition = (position: Position): Position => {
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

  // 优化创建节点函数
  const createNode = useCallback((
    type: 'choice' | 'story',
    sourceNodeId: string,
    position: Position,
    additionalParams = {}
  ) => {
    const sourceNode = nodes.find(node => node.id === sourceNodeId)
    if (!sourceNode) return

    const { width = 230, height = 150 } = sourceNode
    const offsetX = width! + 150
    const offsetY = height! + 150

    const positionMap = new Map([
      [Position.Top, { x: offsetX, y: -(150 + (type === 'choice' ? DEFAULT_CHOICE_NODE_HEIGHT : DEFAULT_STORY_NODE_HEIGHT)) }],
      [Position.Right, { x: offsetX, y: 0 }],
      [Position.Bottom, { x: offsetX, y: offsetY }],
      [Position.Left, { x: -offsetX, y: 0 }]
    ])

    const offset = positionMap.get(position) || { x: 0, y: 0 }
    const newPosition = {
      x: sourceNode.position.x + offset.x,
      y: sourceNode.position.y + offset.y
    }

    const newNode = {
      id: `${type}-${Date.now()}`,
      type,
      position: newPosition,
      data: {
        ...additionalParams,
        connectedFrom: {
          nodeId: sourceNodeId,
          position
        },
        connectedNodes: [],
        directionalConnections: {
          [Position.Top]: false,
          [Position.Right]: false,
          [Position.Bottom]: false,
          [Position.Left]: false,
          [getOppositePosition(position)]: type === 'story'
        }
      }
    }

    // 批量更新所有状态
    requestAnimationFrame(() => {
      setNodes(prev => {
        const updatedNodes = prev.map(node =>
          node.id === sourceNodeId
            ? {
              ...node,
              data: {
                ...node.data,
                connectedNodes: [...(node.data.connectedNodes || []), newNode.id],
                directionalConnections: {
                  ...(node.data.directionalConnections || {
                    [Position.Top]: false,
                    [Position.Right]: false,
                    [Position.Bottom]: false,
                    [Position.Left]: false
                  }),
                  [position]: true
                }
              }
            }
            : node
        )
        return [...updatedNodes, newNode]
      })

      setEdges(prev => [
        ...prev,
        {
          id: `edge-${sourceNodeId}-${newNode.id}`,
          source: sourceNodeId,
          target: newNode.id,
          sourceHandle: position,
          targetHandle: Position.Left,
          type: 'smoothstep'
        }
      ])
    })
  }, [nodes, setNodes, setEdges])

  // 优化事件监听器注册
  useEffect(() => {
    const handlers = new Map([
      ['add-story-node', (e: CustomEvent) => {
        const { sourceNodeId, position, sourcePosition, targetPosition } = e.detail
        const storyNumber = getNextNodeNumber('story')
        createNode('story', sourceNodeId, position, {
          title: `故事-${storyNumber}`,
          content: '在这里编写故事内容...',
          sourcePosition,
          targetPosition
        })
      }],
      ['add-choice-node', (e: CustomEvent) => {
        const { sourceNodeId, position } = e.detail
        const choiceNumber = getNextNodeNumber('choice', sourceNodeId)
        createNode('choice', sourceNodeId, position, {
          title: `选择${choiceNumber}`,
          choices: [
            { text: '选项 1', nextNodeId: '' },
            { text: '选项 2', nextNodeId: '' }
          ]
        })
      }]
    ])

    handlers.forEach((handler, event) => {
      window.addEventListener(event, handler as EventListener)
    })

    return () => {
      handlers.forEach((handler, event) => {
        window.removeEventListener(event, handler as EventListener)
      })
    }
  }, [createNode])

  // 修改节点点击处理函数
  const handleNodeClick = useCallback((_event: any, node: Node<NodeData>) => {
    // setSelectedNode(node)
    // 调用父组件的回调函数
    onNodeSelect?.(node)
  }, [onNodeSelect])

  // 点击画布时的处理
  const handlePanelClick = useCallback(() => {
    // 不清理，但是折叠
    //onNodeSelect?.(null)
    onPanelClick?.(false)
  }, [onPanelClick])

  //当节点或边发生变化时保存
  useEffect(() => {
    //onSave(nodes, edges)
  }, [nodes, edges])

  return (
    <div className="flex flex-1 h-full">
      <div
        className={`flex-1 h-full ${selectionStyles}`}
        data-panning={isPanning}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <ReactFlow
          {...flowConfig}
          nodes={nodes}
          edges={edges}
          onNodesChange={throttledNodesChange}
          onEdgesChange={throttledEdgesChange}
          onConnect={throttledConnect}
          onSelectionChange={debouncedSelectionChange}
          onNodeClick={handleNodeClick}
          onPaneClick={handlePanelClick}
        >
          <Background />
        </ReactFlow>
      </div>
    </div>
  )
})

export default SceneEditor
