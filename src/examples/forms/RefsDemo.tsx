import { useEffect, useRef, useState } from 'react'
import { RenderCount } from '../../lib/demo-kit'

export default function RefsDemo() {
  const inputRef = useRef<HTMLInputElement>(null)
  const feedRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<number | null>(null)

  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const [note, setNote] = useState('')

  useEffect(() => {
    if (!running) return
    intervalRef.current = window.setInterval(() => {
      setElapsed((value) => Math.round((value + 0.1) * 10) / 10)
    }, 100)
    return () => {
      if (intervalRef.current !== null) window.clearInterval(intervalRef.current)
    }
  }, [running])

  const focusAndSelect = () => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }

  return (
    <div className="stack">
      <div className="row">
        <input ref={inputRef} className="input" style={{ maxWidth: 260 }} defaultValue="Меня можно выделить" />
        <button type="button" className="btn btn--ghost" onClick={focusAndSelect}>
          focus() + select()
        </button>
        <RenderCount />
      </div>

      <div className="row">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            setElapsed(0)
            setRunning(true)
          }}
        >
          Старт
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setRunning(false)}>
          Стоп
        </button>
        <b style={{ fontSize: 22, minWidth: 90 }}>{elapsed.toFixed(1)} c</b>
        <span className="muted">id интервала лежит в intervalRef и не вызывает рендер</span>
      </div>

      <div className="row" style={{ alignItems: 'stretch' }}>
        <div
          ref={feedRef}
          className="panel"
          style={{ height: 130, overflowY: 'auto', flex: 1, minWidth: 220 }}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i}>Строка ленты №{i + 1}</div>
          ))}
        </div>
        <div className="stack" style={{ flex: 1 }}>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            scroll to top
          </button>
          <button
            type="button"
            className="btn btn--ghost"
            onClick={() => feedRef.current?.scrollBy({ top: 60, behavior: 'smooth' })}
          >
            scroll by 60
          </button>
          <input
            className="input"
            placeholder="Значение сюда не попадает — это просто DOM"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}
