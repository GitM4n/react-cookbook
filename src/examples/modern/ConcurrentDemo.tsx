import { useDeferredValue, useEffect, useRef, useState } from 'react'
import { RenderCount } from '../../lib/demo-kit'

const ITEMS = Array.from(
  { length: 40000 },
  (_, index) => `запись ${index}: react, hooks, typescript, rendering #${index % 97}`,
)

function findMatches(query: string): string[] {
  const q = query.trim().toLowerCase()
  const source = q ? ITEMS.filter((item) => item.includes(q)) : ITEMS
  return source.slice(0, 1200)
}

export default function ConcurrentDemo() {
  const [query, setQuery] = useState('')
  const deferredQuery = useDeferredValue(query)
  const [renderMs, setRenderMs] = useState(0)
  const startedAt = useRef(0)

  const isStale = query !== deferredQuery
  const matches = findMatches(deferredQuery)

  useEffect(() => {
    if (startedAt.current > 0) {
      setRenderMs(Math.round(performance.now() - startedAt.current))
    }
  })

  const handleChange = (value: string) => {
    startedAt.current = performance.now()
    setQuery(value)
  }

  return (
    <div className="stack">
      <div className="row">
        <input
          className="input"
          style={{ maxWidth: 320 }}
          value={query}
          aria-label="Фильтр списка"
          placeholder="печатаю — смотрю на отзывчивость"
          onChange={(e) => handleChange(e.target.value)}
        />
        <span className={`badge ${isStale ? 'badge--bad' : 'badge--good'}`}>
          {isStale ? 'список отстаёт и догоняет' : 'список синхронен'}
        </span>
        <span className="badge">рендер от нажатия: {renderMs} мс</span>
        <RenderCount label="Рендеров" />
      </div>

      <div className="panel">
        <div className="muted">
          query = «{query}» (срочное) · deferredQuery = «{deferredQuery}» (не срочное)
        </div>
        <b>Совпадений: {matches.length}</b>
      </div>

      <div className="panel" style={{ maxHeight: 260, overflowY: 'auto' }}>
        {matches.slice(0, 300).map((item, index) => (
          <div key={index} className="muted">
            {item}
          </div>
        ))}
      </div>

      <p className="muted">
        Пока вы печатаете, React сначала обновляет ввод (срочно), а тяжёлый список перерисовывает тогда, когда
        найдёт свободное окно — поэтому значение <code>deferredQuery</code> немного отстаёт. Это и есть
        concurrent rendering: обычные рендеры можно прерывать, а срочные обновления не ждут.
      </p>
    </div>
  )
}
