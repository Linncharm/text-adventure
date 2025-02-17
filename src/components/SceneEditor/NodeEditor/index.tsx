import { Node } from 'reactflow'
import { NodeData } from '../types'

interface NodeEditorProps {
  node: Node<NodeData>
  onChange: (setter: (nodes: Node<NodeData>[]) => Node<NodeData>[]) => void
}

export function NodeEditor({ node, onChange }: NodeEditorProps) {
  const handleTitleChange = (title: string) => {
    onChange((nodes) =>
      nodes.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, title } } : n))
    )
  }

  const handleContentChange = (content: string) => {
    onChange((nodes) =>
      nodes.map((n) => (n.id === node.id ? { ...n, data: { ...n.data, content } } : n))
    )
  }

  const handleChoiceChange = (index: number, text: string) => {
    onChange((nodes) =>
      nodes.map((n) => {
        if (n.id === node.id && n.data.choices) {
          const newChoices = [...n.data.choices]
          newChoices[index] = { ...newChoices[index], text }
          return { ...n, data: { ...n.data, choices: newChoices } }
        }
        return n
      })
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          标题
        </label>
        <input
          type="text"
          value={node.data.title}
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
            value={node.data.content}
            onChange={(e) => handleContentChange(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        </div>
      )}

      {node.type === 'choice' && node.data.choices && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            选项
          </label>
          {node.data.choices.map((choice, index) => (
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
    </div>
  )
}
