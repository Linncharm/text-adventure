import { useState, useEffect } from 'react'
import { Node } from 'reactflow'
import { NodeData } from '../types'

interface NodeEditorProps {
  node: Node<NodeData>
  onSaveNode?: (node: Node<NodeData>) => void
  onClose?: () => void
  isOpen: boolean // 添加 isOpen 属性
}

export function NodeEditor({ node, onSaveNode, onClose, isOpen }: NodeEditorProps) {
  const [editData, setEditData] = useState<NodeData>(node.data)

  useEffect(() => {
    setEditData(node.data)
  }, [node.data])

  const handleTitleChange = (title: string) => {
    setEditData(prev => ({
      ...prev,
      title
    }))
  }

  const handleContentChange = (content: string) => {
    setEditData(prev => ({
      ...prev,
      content
    }))
  }

  const handleChoiceChange = (index: number, text: string) => {
    setEditData(prev => ({
      ...prev,
      choices: prev.choices?.map((choice, i) =>
        i === index ? { ...choice, text } : choice
      )
    }))
  }

  const handleSave = () => {
    if (onSaveNode) {
      const updatedNode: Node<NodeData> = {
        ...node,
        data: editData
      }
      onSaveNode(updatedNode)
      onClose?.() // 保存后自动关闭面板
    }
  }

  const handleCancel = () => {
    setEditData(node.data)
    onClose?.()
  }

  // 如果面板关闭，不渲染内容
  if (!isOpen) {
    return null
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          标题
        </label>
        <input
          type="text"
          value={editData.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      {node.type === 'story' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            内容
          </label>
          <textarea
            value={editData.content}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      )}

      {node.type === 'choice' && editData.choices && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            选项
          </label>
          {editData.choices.map((choice, index) => (
            <div key={index} className="mt-2">
              <input
                type="text"
                value={choice.text}
                onChange={(e) => handleChoiceChange(index, e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300
            bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600
            rounded-md hover:bg-gray-50 dark:hover:bg-gray-700
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium text-white
            bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600
            rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          保存
        </button>
      </div>
    </div>
  )
}
