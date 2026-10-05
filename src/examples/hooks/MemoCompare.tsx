import { useMemo, useRef, useState } from 'react'

const ITEMS = [
  'react',
  'react hooks',
  'react server components',
  'typescript',
  'usememo',
  'usecallback',
  'reconciliation',
  'batching',
]

function BadDeps() {
  const [text, setText] = useState('')
  const [tick, setTick] = useState(0)
  const runs = useRef(0)

  const filter = { text } // ❌ новый объект при каждом рендере
  const filtered = useMemo(() => {
    runs.current += 1
    return ITEMS.filter((item) => item.includes(filter.text))
  }, [filter])

  return (
    <div className="stack">
      <input
        className="input"
        value={text}
        aria-label="Фильтр"
        placeholder="фильтр"
        onChange={(e) => setText(e.target.value)}
      />
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={() => setTick((t) => t + 1)}>
          Перерисовать (тик {tick})
        </button>
        <span className="badge badge--bad">пересчётов: {runs.current}</span>
      </div>
      <div className="muted">{filtered.join(', ')}</div>
    </div>
  )
}

function GoodDeps() {
  const [text, setText] = useState('')
  const [tick, setTick] = useState(0)
  const runs = useRef(0)

  const filtered = useMemo(() => {
    runs.current += 1
    return ITEMS.filter((item) => item.includes(text))
  }, [text]) // ✅ примитив: строка сравнивается по значению

  return (
    <div className="stack">
      <input
        className="input"
        value={text}
        aria-label="Фильтр"
        placeholder="фильтр"
        onChange={(e) => setText(e.target.value)}
      />
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={() => setTick((t) => t + 1)}>
          Перерисовать (тик {tick})
        </button>
        <span className="badge badge--good">пересчётов: {runs.current}</span>
      </div>
      <div className="muted">{filtered.join(', ')}</div>
    </div>
  )
}

export function MemoBadDeps() {
  return <BadDeps />
}

export function MemoGoodDeps() {
  return <GoodDeps />
}
