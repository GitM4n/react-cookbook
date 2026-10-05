import { useCallback, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/** Счётчик рендеров: обновляется при каждом вызове компонента. */
export function RenderCount({ label = 'Рендеров' }: { label?: string }) {
  const count = useRef(0)
  count.current += 1
  return (
    <span className="render-count">
      {label}: <b>#{count.current}</b>
    </span>
  )
}

/** Простейший журнал событий для демонстрации эффектов и батчинга. */
export function useLog(limit = 8) {
  const [entries, setEntries] = useState<string[]>([])

  const push = useCallback(
    (message: string) => {
      const time = new Date().toLocaleTimeString('ru-RU', { hour12: false })
      setEntries((prev) => [`${time}  ${message}`, ...prev].slice(0, limit))
    },
    [limit],
  )

  const clear = useCallback(() => setEntries([]), [])

  return { entries, push, clear }
}

export function LogView({
  entries,
  empty = 'Журнал пуст — взаимодействуйте с примером',
}: {
  entries: string[]
  empty?: string
}) {
  return (
    <div className="log">
      {entries.length === 0 ? (
        <span className="log__empty">{empty}</span>
      ) : (
        entries.map((entry, i) => (
          <div key={`${entry}-${i}`} className="log__item">
            {entry}
          </div>
        ))
      )}
    </div>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      {children}
    </label>
  )
}
