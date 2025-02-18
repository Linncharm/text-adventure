import {useCallback, useState, useRef, useEffect, SetStateAction, Dispatch, forwardRef, useImperativeHandle} from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  SelectionMode,
  Background,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState, Position, MarkerType,
  useReactFlow,
  OnSelectionChangeParams,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { StoryNode } from './StoryNode'
import { ChoiceNode } from './ChoiceNode'
import { Toolbar } from "@/components/SceneEditor/ToolBar";
import { NodeData } from './types'
import { selectionStyles } from './styles/section'

const DEFAULT_CHOICE_NODE_HEIGHT = 122
const DEFAULT_STORY_NODE_HEIGHT = 200

interface SceneEditorProps {
  initialNodes: Node[]
  initialEdges: Edge[]
  onSave?: (nodes: Node[], edges: Edge[]) => void
  onNodeSelect?: (node: Node<NodeData> | null) => void
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
}: SceneEditorProps,ref) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const [isPanning, setIsPanning] = useState(false)

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

  // 处理选择变化
  const handleSelectionChange = useCallback((params: OnSelectionChangeParams) => {
    selectedNodesRef.current = params.nodes
    if (params.nodes.length < 2) {
    }
  }, [])

  // 获取相反的方向
  const getOppositePosition = (position: Position): Position => {
    switch (position) {
      case Position.Top:
        return Position.Bottom
      case Position.Right:
        return Position.Left
      case Position.Bottom:
        return Position.Top
      case Position.Left:
        return Position.Right
      default:
        return Position.Left
    }
  }

  // 修改创建 Choice 节点的函数
  const createChoiceNode = useCallback((sourceNodeId: string, position: Position) => {
    const sourceNode = nodes.find(node => node.id === sourceNodeId)
    if (!sourceNode) return

    const offsetX = (sourceNode.width || 230) + 150;
    const offsetY = (sourceNode.height || 150) + 150;
    const newNodePosition = { ...sourceNode.position }

    // 根据方向调整位置
    switch (position) {
      case Position.Top:
        newNodePosition.y -= (150 + DEFAULT_STORY_NODE_HEIGHT)
        newNodePosition.x += offsetX
        break
      case Position.Right:
        newNodePosition.x += offsetX
        break
      case Position.Bottom:
        newNodePosition.y += offsetY
        newNodePosition.x += offsetX
        break
      case Position.Left:
        newNodePosition.x -= offsetX
        break
    }

    const newNode:Node<NodeData> = {
      id: `choice-${Date.now()}`,
      type: 'choice',
      position: newNodePosition,
      data: {
        title: '新选择节点',
        choices: [
          { text: '选项 1', nextNodeId: '' },
          { text: '选项 2', nextNodeId: '' }
        ],
        connectedNodes: [], // 初始化为空数组
        connectedFrom: {
          nodeId: sourceNodeId,
          position: position
        },
      }
    }

    const newEdge = {
      id: `edge-${sourceNodeId}-${newNode.id}`,
      source: sourceNodeId,
      target: newNode.id,
      sourceHandle: position,
      //targetHandle: getOppositePosition(position),
      targetHandle: Position.Left,
      type: 'smoothstep'
    }

    // console.log("new edge from story", newEdge)

    // 更新源节点，标记该方向已连接
    setNodes(nds =>
      nds.map(node =>
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
    )


    setNodes(nds => [...nds, newNode])
    setEdges(eds => [...eds, newEdge])
  }, [nodes, setNodes, setEdges])

  // 修改创建 Story 节点的函数
  const createStoryNode = useCallback((
    sourceNodeId: string,
    position: Position,
    sourcePosition: Position,
    targetPosition: Position
  ) => {
    const sourceNode = nodes.find(node => node.id === sourceNodeId)
    if (!sourceNode) return

    console.log("Choice窗口大小",sourceNode.width,sourceNode.height)
    const offsetX = (sourceNode.width || 230) + 150;
    const offsetY = (sourceNode.height || 150) + 150;

    const newNodePosition = { ...sourceNode.position }
    // 根据方向调整位置
    switch (position) {
      case Position.Top:
        newNodePosition.y -= (150 + DEFAULT_CHOICE_NODE_HEIGHT)
        break
      case Position.Right:
        newNodePosition.x += offsetX
        break
      case Position.Bottom:
        newNodePosition.y += offsetY
        break
      case Position.Left:
        newNodePosition.x -= offsetX
        break
    }

    const newNode:Node<NodeData> = {
      id: `story-${Date.now()}`,
      type: 'story',
      position: newNodePosition,
      data: {
        title: '新故事节点',
        content: '在这里编写故事内容...',
        connectedNodes: [],
        connectedFrom: {
          nodeId: sourceNodeId,
          position: position
        },
        directionalConnections: {
          [Position.Top]: false,
          [Position.Right]: false,
          [Position.Bottom]: false,
          [Position.Left]: false,
          [getOppositePosition(position)]: true,
        }
      }
    }

    const newEdge = {
      id: `edge-${sourceNodeId}-${newNode.id}`,
      // source: newNode.id,
      // target: sourceNodeId,
      source: sourceNodeId,
      target: newNode.id,
      sourceHandle: sourcePosition,
      targetHandle: targetPosition,
      type: 'smoothstep'
    }

    // console.log("new edge from choice", newEdge)

    // 更新源节点，标记该方向已连接
    setNodes(nds =>
      nds.map(node =>
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
    )

    setNodes(nds => [...nds, newNode])
    setEdges(eds => [...eds, newEdge])
  }, [nodes, setNodes, setEdges])

  // 添加事件监听器
  useEffect(() => {
    const handleAddStoryNode = (e: CustomEvent<{
      sourceNodeId: string
      position: Position
      sourcePosition: Position
      targetPosition: Position
    }>) => {
      console.log(e.detail)
      createStoryNode(
        e.detail.sourceNodeId,
        e.detail.position,
        e.detail.sourcePosition,
        e.detail.targetPosition
      )
    }

    const handleAddChoiceNode = (e: CustomEvent<{
      sourceNodeId: string
      position: Position
    }>) => {
      console.log(e.detail)
      createChoiceNode(e.detail.sourceNodeId, e.detail.position)
    }

    window.addEventListener('add-story-node', handleAddStoryNode as EventListener)
    window.addEventListener('add-choice-node', handleAddChoiceNode as EventListener)

    return () => {
      window.removeEventListener('add-story-node', handleAddStoryNode as EventListener)
      window.removeEventListener('add-choice-node', handleAddChoiceNode as EventListener)
    }
  }, [createChoiceNode, createStoryNode])

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  // 修改节点点击处理函数
  const handleNodeClick = useCallback((_event: any, node: Node<NodeData>) => {
    // setSelectedNode(node)
    // 调用父组件的回调函数
    onNodeSelect?.(node)
  }, [onNodeSelect])

  //当节点或边发生变化时保存
  useEffect(() => {
    //onSave(nodes, edges)
  }, [nodes, edges])

  return (
    <div className="flex flex-1 h-full">
      {/* 主工作区 */}
      <div
        className={`flex-1 h-full ${selectionStyles}`}
        data-panning={isPanning}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onSelectionChange={handleSelectionChange}
          onNodeClick={handleNodeClick}
          onPaneClick={() => {
            onNodeSelect?.(null)
          }}
          defaultEdgeOptions={defaultEdgeOptions}
          minZoom={0.2}
          fitView
          selectionMode={SelectionMode.Partial}
          selectionOnDrag={true}
          panOnDrag={[1]}
          selectNodesOnDrag={true}
          multiSelectionKeyCode="Shift"
          deleteKeyCode="Delete"
        >
          <Background/>
        </ReactFlow>
      </div>
    </div>
  )
})

export default SceneEditor
