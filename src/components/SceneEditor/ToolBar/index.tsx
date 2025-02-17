import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { PlusIcon, DocumentTextIcon, ArrowPathRoundedSquareIcon } from '@heroicons/react/24/outline'

interface ToolbarProps {
  onAddStoryNode: () => void
  onAddChoiceNode: () => void
}

export function Toolbar({ onAddStoryNode, onAddChoiceNode }: ToolbarProps) {
  return (
    <div className="h-14 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-12 z-10">
      <div className="h-full px-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* 左侧工具按钮组 */}
          <div className="flex items-center space-x-2">
            {/* 添加节点下拉菜单 */}
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg flex items-center">
                <PlusIcon className="w-5 h-5" />
                <span className="ml-1 text-sm">添加节点</span>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute left-0 mt-2 w-48 origin-top-left bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 focus:outline-none">
                  <div className="p-1">
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          onClick={onAddStoryNode}
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
                          onClick={onAddChoiceNode}
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

            {/* 其他工具栏按钮 */}
            {/* ... */}
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
  )
}
