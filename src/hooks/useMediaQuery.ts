import { useCallback, useSyncExternalStore } from 'react'

const canMatchMedia = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'

export function useMediaQuery(query: string) {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (!canMatchMedia()) return () => {}

      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener('change', onChange)
      return () => mediaQuery.removeEventListener('change', onChange)
    },
    [query],
  )

  const getSnapshot = () => canMatchMedia() && window.matchMedia(query).matches

  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
