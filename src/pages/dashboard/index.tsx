import {useState, useRef, Dispatch, SetStateAction} from 'react'
import { Dialog } from '@headlessui/react'
import { Node, Edge ,useNodesState} from 'reactflow'
import { NodeEditor } from "@/components/SceneEditor/NodeEditor";
import {
  PlusIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ArrowPathRoundedSquareIcon
} from '@heroicons/react/24/outline'
import SceneEditor from "@/components/SceneEditor";
import { Toolbar } from "@/components/SceneEditor/ToolBar";
import { Menu, Transition } from '@headlessui/react'
import {NodeData} from "@/components/SceneEditor/types";

interface Scene {
  id: string
  name: string
  lastModified: string
  status: 'draft' | 'published'
  // 添加保存场景编辑器的数据
  editorData: {
    nodes: Node[]
    edges: Edge[]
  }
}

const initStoryNode: Node<NodeData> = {
  id: `story-${Date.now()}`,
  type: 'story',
  position: { x: 250, y: 5 },
  data: {
    title: '故事节点',
    content: '在这里编写故事内容...'
  }
}

const DashboardPage = ()=> {

  const [isLeftPanelOpen, setIsLeftPanelOpen] = useState(true)
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true)
  const [isNewSceneModalOpen, setIsNewSceneModalOpen] = useState(false)
  const [newSceneName, setNewSceneName] = useState('')                          // 新场景名称
  const [selectedScene, setSelectedScene] = useState<Scene | null>(null)        // 在场景列表中选择的场景
  const [scenes, setScenes] = useState<Scene[]>([])                             // 左侧场景列表
  const [selectedNode, setSelectedNode] = useState<Node<NodeData> | null>(null) // 选择的节点

  const sceneEditorRef = useRef<{ setNodes: Dispatch<SetStateAction<Node<any, string | undefined>[]>> }>(null);

  // 处理场景数据更新
  const handleSceneDataUpdate = (sceneId: string, nodes: Node[], edges: Edge[]) => {
    setScenes(currentScenes =>
      currentScenes.map(scene =>
        scene.id === sceneId
          ? {
            ...scene,
            lastModified: new Date().toISOString(),
            editorData: { nodes, edges }
          }
          : scene
      )
    )
  }

  // 创建新场景
  const handleCreateNewScene = () => {
    if (!newSceneName.trim()) return

    const newScene = {
      id: Date.now().toString(),
      name: newSceneName,
      lastModified: new Date().toISOString(),
      status: 'draft' as const,
      editorData: {
        nodes: [initStoryNode],
        edges: []
      }
    }

    setScenes([...scenes, newScene])
    setNewSceneName('')
    setIsNewSceneModalOpen(false)
    setSelectedScene(newScene)
  }

  // 处理节点选择
  const handleNodeSelect = (node: Node<NodeData> | null) => {
    //console.log('Selected Node:', node)
    setSelectedNode(node)
    // 如果你想在选择节点时自动打开右侧面板
    node && setIsRightPanelOpen(true)
  }

  // 处理节点更新
  const handleNodeUpdate = (updatedNode: Node<NodeData>) => {
    //console.log('Updated Node:', updatedNode)
    // 更新选中的节点
    setSelectedNode(updatedNode)

    // 同时更新场景中的节点数据
    if (selectedScene) {
      setScenes(currentScenes =>
        currentScenes.map(scene =>
          scene.id === selectedScene.id
            ? {
              ...scene,
              lastModified: new Date().toISOString(),
              editorData: {
                ...scene.editorData,
                nodes: scene.editorData.nodes.map(node =>
                  node.id === updatedNode.id ? updatedNode : node
                )
              }
            }
            : scene
        )
      )
    }

    // TODO:更新react-flow的节点数据
    // 对于相同的id，只用新节点的data替换旧的，其他不变
    sceneEditorRef.current?.setNodes((nodes) =>
      nodes.map((node) => (node.id === updatedNode.id ? {...node,data:updatedNode.data} : node))
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 pt-12">
      {/* 工具栏 */}
      <div className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-12 z-10">
        <div className="h-full px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* 左侧工具按钮组 */}
            <div className="flex items-center space-x-2">
              <Menu as="div" className="relative inline-block text-left">
                <Menu.Button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center">
                  <PlusIcon className="w-5 h-5" />
                  <span className="ml-1 text-sm">添加节点</span>
                </Menu.Button>

                <Transition
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-in"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Menu.Items className="absolute left-0 mt-2 w-48 origin-top-left bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none">
                    <div className="p-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`
                              ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}
                              group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-200
                            `}
                          >
                            <DocumentTextIcon className="w-5 h-5 mr-2" />
                            故事节点
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`
                              ${active ? 'bg-gray-100 dark:bg-gray-700' : ''}
                              group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-200
                            `}
                          >
                            <ArrowPathRoundedSquareIcon className="w-5 h-5 mr-2" />
                            选择节点
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* 右侧工具按钮组 */}
            <div className="flex items-center space-x-2">
              {/* 这里可以添加更多工具栏按钮 */}
            </div>
          </div>
        </div>
      </div>
      {/* 主布局 */}
      <div className="flex h-[calc(100vh-7rem)]">
        {/* 左侧面板 */}
        <div className={`
          ${isLeftPanelOpen ? 'w-40' : 'w-0'}
          transition-all duration-300 ease-in-out
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          flex flex-col
        `}>
          {/* 左侧面板内容 */}
          {isLeftPanelOpen && (
            <>
              <div className="p-2 border-b border-gray-200 dark:border-gray-700 flex justify-center">
                <button
                  onClick={() => setIsNewSceneModalOpen(true)}
                  className="w-auto flex items-center justify-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700
      dark:bg-purple-500 dark:hover:bg-purple-600 text-white rounded-md transition-colors text-xs"
                >
                  <PlusIcon className="h-4 w-4 mr-1"/>
                  新建场景
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {scenes.map((scene) => (
                  <div
                    key={scene.id}
                    onClick={() => setSelectedScene(scene)}
                    className={`
                      p-4 cursor-pointer transition-colors
                      ${selectedScene?.id === scene.id
                      ? 'bg-purple-50 dark:bg-purple-900/30'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'}
                    `}
                  >
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                      {scene.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      最后修改: {new Date(scene.lastModified).toLocaleDateString()}
                    </div>
                    <div className="mt-1">
                      <span className={`
                        text-xs px-2 py-1 rounded-full
                        ${scene.status === 'draft'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'}
                      `}>
                        {scene.status === 'draft' ? '草稿' : '已发布'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* 左侧面板折叠按钮 */}
          <button
            onClick={() => setIsLeftPanelOpen(!isLeftPanelOpen)}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800
              p-1 rounded-r-lg shadow-md border border-l-0 border-gray-200 dark:border-gray-700"
          >
            {isLeftPanelOpen ? <ChevronLeftIcon className="h-5 w-5" /> : <ChevronRightIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* 中间工作区 */}
        <div className="flex-1 overflow-hidden bg-gray-50 dark:bg-gray-900">
          {selectedScene ? (
            <div className="h-full p-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm h-full p-6">
                {/*<h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">*/}
                {/*  {selectedScene.name}*/}
                {/*</h2>*/}
                <div className="h-full">
                  <SceneEditor
                    ref={sceneEditorRef}
                    key={selectedScene.id}
                    initialNodes={selectedScene.editorData.nodes}
                    initialEdges={selectedScene.editorData.edges}
                    // onSave={(nodes, edges) => handleSceneDataUpdate(selectedScene.id, nodes, edges)}
                    onNodeSelect={handleNodeSelect}
                  />
                </div>
                {/*<div className="text-gray-600 dark:text-gray-400">*/}
                {/*  工作区内容将在这里展示...*/}
                {/*</div>*/}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              请选择或创建一个场景开始编辑
            </div>
          )}
        </div>

        {/* 右侧面板 */}
        <div className={`
          ${isRightPanelOpen ? 'w-64' : 'w-0'}
          transition-all duration-300 ease-in-out overflow-hidden
          bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700
        `}>
          {selectedNode && (
            <NodeEditor
              node={selectedNode}
              onSaveNode={handleNodeUpdate}
              onClose={() => {
                setIsRightPanelOpen(false)
              }}
              isOpen={isRightPanelOpen}
            />
          )}
          {/* 右侧面板折叠按钮 */}
          <button
            onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800
      p-1 rounded-l-lg shadow-md border border-r-0 border-gray-200 dark:border-gray-700"
          >
            {isRightPanelOpen ?
              <ChevronRightIcon className="h-5 w-5"/> :
              <ChevronLeftIcon className="h-5 w-5"/>
            }
          </button>
        </div>
      </div>

      {/* 新建场景模态框 */}
      <Dialog
        open={isNewSceneModalOpen}
        onClose={() => setIsNewSceneModalOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true"/>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white dark:bg-gray-800 p-6">
            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
              新建场景
            </Dialog.Title>

            <div className="mt-4">
              <input
                type="text"
                value={newSceneName}
                onChange={(e) => setNewSceneName(e.target.value)}
                placeholder="输入场景名称"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                  focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setIsNewSceneModalOpen(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100
                  dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleCreateNewScene}
                disabled={!newSceneName.trim()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700
                  disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                创建
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

export default DashboardPage
