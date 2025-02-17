import { memo } from 'react'
import { Handle, Position } from 'reactflow'
import { Choice } from '../types'

export const ChoiceNode = memo(({ data }: { data: { title: string; choices: Choice[] } }) => {
  return (
    <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg shadow-lg p-4 min-w-[200px]">
      <Handle type="target" position={Position.Top} />
      <div className="font-medium text-gray-900 dark:text-white mb-2">{data.title}</div>
      <div className="space-y-2">
        {data.choices.map((choice, index) => (
          <div
            key={index}
            className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 rounded p-2"
          >
            {choice.text}
          </div>
        ))}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  )
})

ChoiceNode.displayName = 'ChoiceNode'
