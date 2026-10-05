import { useEffect, useState, useTransition } from 'react'
import type { ReactNode } from 'react'

interface Row {
  id: number
  text: string
}

function buildRows(seed: number): Row[] {
  return Array.from({ length: 2500 }, (_, index) => ({
    id: index,
    text: `строка ${(index * 7919 + seed) % 100000} — тяжёлое обновление списка`,
  }))
}

function useTickMeter() {
  const [tick, setTick] = useState(0)
  const [maxGap, setMaxGap] = useState(0)

  useEffect(() => {
    let last = performance.now()
    const id = window.setInterval(() => {
      const now = performance.now()
      const gap = now - last
      last = now
      setTick((value) => value + 1)
      if (gap > 130) setMaxGap((value) => Math.max(value, Math.round(gap)))
    }, 100)
    return () => window.clearInterval(id)
  }, [])

  return { tick, maxGap, reset: () => setMaxGap(0) }
}

function RowView({ row }: { row: Row }) {
  return <div className="muted">{row.text}</div>
}

function Panel({ children }: { children?: ReactNode }) {
  return (
    <div className="panel" style={{ maxHeight: 190, overflowY: 'auto' }}>
      {children}
    </div>
  )
}

export function BlockingSort() {
  const [rows, setRows] = useState(() => buildRows(1))
  const [seed, setSeed] = useState(1)
  const meter = useTickMeter()

  const shuffle = () => {
    const next = seed + 1
    setSeed(next)
    setRows(buildRows(next))
  }

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={shuffle}>
          Обновить список
        </button>
        <button type="button" className="btn btn--sm btn--ghost" onClick={meter.reset}>
          сброс метрики
        </button>
        <span className="badge badge--bad">обновление синхронное</span>
      </div>
      <span className="muted">
        тик: {meter.tick} · максимальная задержка тика: <b>{meter.maxGap} мс</b>
      </span>
      <Panel>
        {rows.map((row) => (
          <RowView key={row.id} row={row} />
        ))}
      </Panel>
      <span className="muted">
        Пока React перерисовывает 2500 строк, события стоят в очереди — тик «замирает».
      </span>
    </div>
  )
}

export function TransitionSort() {
  const [rows, setRows] = useState(() => buildRows(1))
  const [seed, setSeed] = useState(1)
  const [isPending, startTransition] = useTransition()
  const meter = useTickMeter()

  const shuffle = () => {
    const next = seed + 1
    setSeed(next)
    startTransition(() => setRows(buildRows(next)))
  }

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={shuffle}>
          Обновить список
        </button>
        <button type="button" className="btn btn--sm btn--ghost" onClick={meter.reset}>
          сброс метрики
        </button>
        <span className={`badge ${isPending ? 'badge--bad' : 'badge--good'}`}>
          {isPending ? 'идёт обновление…' : 'готово'}
        </span>
      </div>
      <span className="muted">
        тик: {meter.tick} · максимальная задержка тика: <b>{meter.maxGap} мс</b>
      </span>
      <Panel>
        {rows.map((row) => (
          <RowView key={row.id} row={row} />
        ))}
      </Panel>
      <span className="muted">
        То же обновление в transition: React прерывает его ради срочных событий и показывает isPending.
      </span>
    </div>
  )
}
