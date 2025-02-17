import { useCallback, useState, useEffect } from 'react'
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  MiniMap,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { StoryNode } from './StoryNode'
import { ChoiceNode } from './ChoiceNode'
import { NodeEditor } from './NodeEditor'
import { Toolbar } from "@/components/SceneEditor/ToolBar";
import { NodeData } from './types'

interface SceneEditorProps {
  initialNodes: Node[]
  initialEdges: Edge[]
  onSave: (nodes: Node[], edges: Edge[]) => void
}

const nodeTypes = {
  story: StoryNode,
  choice: ChoiceNode,
}

export default function SceneEditor({ initialNodes, initialEdges, onSave }: SceneEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null)

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  )

  const handleAddStoryNode = useCallback(() => {
    const newNode = {
      id: `story-${Date.now()}`,
      type: 'story',
      position: {
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 100
      },
      data: {
        title: '新故事节点',
        content: '在这里编写故事内容...'
      }
    }
    setNodes((nds) => [...nds, newNode])
  }, [setNodes])

  const handleAddChoiceNode = useCallback(() => {
    const newNode = {
      id: `choice-${Date.now()}`,
      type: 'choice',
      position: {
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 100
      },
      data: {
        title: '新选择节点',
        choices: [
          { text: '选项 1', nextNodeId: '' },
          { text: '选项 2', nextNodeId: '' }
        ]
      }
    }
    setNodes((nds) => [...nds, newNode])
  }, [setNodes])

  // 当节点或边发生变化时保存
  useEffect(() => {
    onSave(nodes, edges)
  }, [nodes, edges, onSave])

  return (
    <div className="flex flex-1 h-full">
      {/* 主工作区 */}
      <div className="flex-1 h-full">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          onNodeClick={(_, node) => setSelectedNode(node)}
          fitView
        >
          <Background />
        </ReactFlow>
      </div>

      {/* 右侧属性面板 */}
      {selectedNode && (
        <div className="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 overflow-y-auto">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            节点属性
          </h3>
          <NodeEditor node={selectedNode} onChange={setNodes} />
        </div>
      )}
    </div>
  )
}
