import { Position } from 'reactflow'
import { twMerge } from 'tailwind-merge'

// 创建颜色变体映射
const colorVariants = {
  green: {
    base: 'bg-gradient-to-br from-green-50/90 to-green-100/90 dark:from-green-900/20 dark:to-green-800/20',
    border: 'border-green-200/50 dark:border-green-700/30',
    shadow: 'shadow-lg dark:shadow-green-900/30',
    hoverShadow: 'hover:shadow-xl dark:hover:shadow-green-900/40',
    selected: 'ring-4 ring-green-400/50 dark:ring-green-500/40 shadow-2xl',
    handle: {
      base: 'bg-green-400 dark:bg-green-500 border-green-100 dark:border-green-700',
      connected: 'bg-green-600 dark:bg-green-400'
    },
    button: {
      base: 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-500',
      shadow: 'shadow-green-200/50 dark:shadow-green-900/50'
    },
    content: {
      title: 'text-green-800 dark:text-green-100 border-green-200/50 dark:border-green-700/50',
      text: 'text-green-700 dark:text-green-200 prose-green',
      bg: 'from-green-100/20 to-green-200/20 dark:from-green-800/20 dark:to-green-700/20'
    }
  },
  amber: {
    base: 'bg-gradient-to-br from-amber-50/90 to-amber-100/90 dark:from-amber-900/20 dark:to-amber-800/20',
    border: 'border-amber-200/50 dark:border-amber-700/30',
    shadow: 'shadow-lg dark:shadow-amber-900/30',
    hoverShadow: 'hover:shadow-xl dark:hover:shadow-amber-900/40',
    selected: 'ring-4 ring-amber-400/50 dark:ring-amber-500/40 shadow-2xl',
    handle: {
      base: 'bg-amber-400 dark:bg-amber-500 border-amber-100 dark:border-amber-700',
      connected: 'bg-amber-600 dark:bg-amber-400'
    },
    button: {
      base: 'bg-amber-500 dark:bg-amber-600 hover:bg-amber-600 dark:hover:bg-amber-500',
      shadow: 'shadow-amber-200/50 dark:shadow-amber-900/50'
    },
    content: {
      title: 'text-amber-800 dark:text-amber-100 border-amber-200/50 dark:border-amber-700/50',
      text: 'text-amber-700 dark:text-amber-200 prose-amber',
      bg: 'from-amber-100/20 to-amber-200/20 dark:from-amber-800/20 dark:to-amber-700/20'
    }
  }
}

// 基础节点样式
export const createBaseNodeStyle = (color: string, selected: boolean) => {
  const colorStyle = colorVariants[color as keyof typeof colorVariants]
  return twMerge(
    'relative',
    colorStyle.base,
    'backdrop-blur-md rounded-xl',
    colorStyle.border,
    colorStyle.shadow,
    'p-6 min-w-[250px]',
    'transition-all duration-300 ease-in-out',
    colorStyle.hoverShadow,
    'hover:scale-[1.02]',
    'group',
    selected && colorStyle.selected
  )
}

// Handle 样式
export const createHandleStyle = (color: string, isConnected: boolean) => {
  const colorStyle = colorVariants[color as keyof typeof colorVariants].handle
  return twMerge(
    '!w-3 !h-3',
    colorStyle.base,
    'transition-transform duration-200',
    'hover:!scale-125',
    isConnected && colorStyle.connected
  )
}

// 添加按钮样式
export const createAddButtonStyle = (
  color: string,
  position: Position,
  type: 'Story' | 'Choice'
) => {
  const positionStyles = {
    [Position.Top]: '-top-5 left-1/2 -translate-x-1/2',
    [Position.Right]: '-right-5 top-1/2 -translate-y-1/2',
    [Position.Bottom]: '-bottom-5 left-1/2 -translate-x-1/2',
    [Position.Left]: '-left-5 top-1/2 -translate-y-1/2'
  }

  const colorStyle = colorVariants[color as keyof typeof colorVariants].button
  return twMerge(
    'absolute',
    positionStyles[position],
    colorStyle.base,
    colorStyle.shadow,
    'text-white',
    'transition-all duration-200',
    'hover:scale-110'
  )
}

// 内容区域样式
export const createContentStyles = (color: string) => {
  const colorStyle = colorVariants[color as keyof typeof colorVariants].content
  return {
    title: twMerge(
      'font-semibold text-lg',
      colorStyle.title,
      'pb-2'
    ),
    content: twMerge(
      'text-sm',
      colorStyle.text,
      'prose dark:prose-invert',
      'max-w-none'
    ),
    decorativeBg: twMerge(
      'absolute -z-10 inset-0',
      'bg-gradient-to-br',
      colorStyle.bg,
      'rounded-xl',
      'opacity-0 group-hover:opacity-100',
      'transition-opacity duration-300'
    )
  }
}
