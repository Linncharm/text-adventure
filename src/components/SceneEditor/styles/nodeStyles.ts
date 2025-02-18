import { Position } from 'reactflow'

// 基础节点样式
export const createBaseNodeStyle = (color: string, selected: boolean) => `
  relative
  bg-gradient-to-br
  from-${color}-50/90 to-${color}-100/90
  dark:from-${color}-900/20 dark:to-${color}-800/20
  backdrop-blur-md
  rounded-xl
  shadow-lg
  dark:shadow-${color}-900/30
  border border-${color}-200/50
  dark:border-${color}-700/30
  p-6
  min-w-[250px]
  transition-all duration-300 ease-in-out
  hover:shadow-xl
  dark:hover:shadow-${color}-900/40
  hover:scale-[1.02]
  group
  ${selected ? `ring-4 ring-${color}-400/50 dark:ring-${color}-500/40 shadow-2xl scale-[1.02]` : ''}
`

// Handle 样式
export const createHandleStyle = (color: string, isConnected: boolean) => `
  !w-3 !h-3
  !bg-${color}-400 dark:!bg-${color}-500
  !border-2 !border-${color}-100 dark:!border-${color}-700
  transition-transform duration-200
  hover:!scale-125
  ${isConnected ? `!bg-${color}-600 dark:!bg-${color}-400` : ''}
`

// 添加按钮样式
export const createAddButtonStyle = (
  color: string,
  position: Position,
  type: 'Story' | 'Choice') => {

  const positionStyles = {
    [Position.Top]: '-top-5 left-1/2 -translate-x-1/2',
    [Position.Right]: '-right-5 top-1/2 -translate-y-1/2',
    [Position.Bottom]: '-bottom-5 left-1/2 -translate-x-1/2',
    [Position.Left]: '-left-5 top-1/2 -translate-y-1/2'
  }

  return `
    absolute ${positionStyles[position]}
    bg-${color}-500 dark:bg-${color}-600
    hover:bg-${color}-600 dark:hover:bg-${color}-500
    shadow-lg shadow-${color}-200/50 dark:shadow-${color}-900/50
    text-white
    transition-all duration-200
    hover:scale-110
  `
}

// 内容区域样式
export const createContentStyles = (color: string) => ({
  title: `
    font-semibold text-lg
    text-${color}-800 dark:text-${color}-100
    border-b border-${color}-200/50 dark:border-${color}-700/50
    pb-2
  `,
  content: `
    text-sm
    text-${color}-700 dark:text-${color}-200
    prose prose-${color} dark:prose-invert
    max-w-none
  `,
  decorativeBg: `
    absolute -z-10 inset-0
    bg-gradient-to-br
    from-${color}-100/20 to-${color}-200/20
    dark:from-${color}-800/20 dark:to-${color}-700/20
    rounded-xl
    opacity-0 group-hover:opacity-100
    transition-opacity duration-300
  `
})
