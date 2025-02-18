import { debounce, throttle } from 'lodash-es'

// 使用泛型来保持类型安全
export function throttledFn<T extends (...args: any[]) => any>(
  fn: T,
  delay = 16
) {
  return throttle(fn, delay)
}

// 使用泛型来保持类型安全
export function debouncedFn<T extends (...args: any[]) => any>(
  fn: T,
  delay = 150
) {
  return debounce(fn, delay)
}
