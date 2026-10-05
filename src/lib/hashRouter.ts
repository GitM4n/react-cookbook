import { useEffect, useState } from 'react'

export interface Route {
  sectionId: string | null
  topicId: string | null
}

function parseHash(): Route {
  const parts = window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  if (parts.length >= 2) return { sectionId: parts[0], topicId: parts[1] }
  if (parts.length === 1) return { sectionId: parts[0], topicId: null }
  return { sectionId: null, topicId: null }
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash)

  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

export function navigate(path: string): void {
  window.location.hash = path
}
