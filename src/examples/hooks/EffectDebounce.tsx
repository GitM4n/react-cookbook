import { useEffect, useState } from 'react'
import { LogView, useLog } from '../../lib/demo-kit'

const CATALOG = [
  'react hooks',
  'react useEffect cleanup',
  'typescript generics',
  'virtual dom',
  'vue vs react',
  'usememo vs usecallback',
]

export default function EffectDebounce() {
  const [query, setQuery] = useState('react')
  const [status, setStatus] = useState('готов к поиску')
  const { entries, push, clear } = useLog()

  useEffect(() => {
    push(`эффект: подписка на "${query}"`)
    setStatus('загрузка…')
    const timer = window.setTimeout(() => {
      const found = CATALOG.filter((item) => item.includes(query.toLowerCase())).length
      setStatus(`найдено: ${found}`)
      push(`таймер отработал → найдено ${found}`)
    }, 500)

    return () => {
      window.clearTimeout(timer)
      push(`очистка: таймер для "${query}" отменён`)
    }
  }, [query, push])

  return (
    <div className="stack">
      <div className="row">
        <input
          className="input"
          style={{ maxWidth: 300 }}
          value={query}
          aria-label="Поисковый запрос"
          placeholder="печатаю быстро…"
          onChange={(e) => setQuery(e.target.value)}
        />
        <span className="badge">{status}</span>
      </div>

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <span className="muted">
          Эффект перезапускается только при изменении <code>query</code>, а не при каждом рендере.
        </span>
        <button type="button" className="btn btn--sm btn--ghost" onClick={clear}>
          Очистить журнал
        </button>
      </div>

      <LogView entries={entries} empty="Начните печатать в поле" />

      <div className="panel">
        <div className="muted">Что происходит</div>
        Каждое нажатие клавиши меняет состояние → рендер → React сравнивает массив зависимостей → если
        изменился только <code>query</code>, предыдущий таймер <b>отменяется в cleanup</b>, и «мусорных»
        ответов не остаётся.
      </div>
    </div>
  )
}
