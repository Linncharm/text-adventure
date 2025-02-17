import { memo } from 'react'
import { Handle, Position } from 'reactflow'

export const StoryNode = memo(({ data }: { data: { title: string; content: string } }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="font-medium text-gray-900 dark:text-white mb-2">{data.title}</div>
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {data.content.substring(0, 100)}...
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
})

StoryNode.displayName = 'StoryNode'
