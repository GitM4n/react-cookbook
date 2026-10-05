import { useCallback, useEffect, useState } from 'react'
import { LogView, useLog } from '../../lib/demo-kit'

interface TickerProps {
  label: string
  onTick: (label: string) => void
}

function BadTicker({ label, onTick }: TickerProps) {
  useEffect(() => {
    // Нет cleanup: интервал живёт вечно, даже после размонтирования.
    window.setInterval(() => onTick(label), 700)
  }, [])
  return <div className="panel panel--bad">⏱ {label}: интервал запущен (cleanup не снят)</div>
}

function GoodTicker({ label, onTick }: TickerProps) {
  useEffect(() => {
    const id = window.setInterval(() => onTick(label), 700)
    return () => window.clearInterval(id)
  }, [label, onTick])
  return <div className="panel panel--good">⏱ {label}: интервал запущен (cleanup снимет его)</div>
}

function Demo({ bad }: { bad: boolean }) {
  const [mounted, setMounted] = useState(true)
  const { entries, push, clear } = useLog(6)

  const onTick = useCallback((label: string) => push(`${label}: тик`), [push])

  useEffect(() => {
    if (mounted) push('ребёнок смонтирован')
    else push('ребёнок размонтирован')
  }, [mounted, push])

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={() => setMounted((m) => !m)}>
          {mounted ? 'Размонтировать' : 'Монтировать'} тикер
        </button>
        <button type="button" className="btn btn--ghost" onClick={clear}>
          Очистить журнал
        </button>
      </div>
      {mounted ? (
        bad ? (
          <BadTicker label="ticker" onTick={onTick} />
        ) : (
          <GoodTicker label="ticker" onTick={onTick} />
        )
      ) : (
        <div className="panel muted">ребёнок в DOM отсутствует</div>
      )}
      <LogView entries={entries} empty="Журнал пуст" />
    </div>
  )
}

export function LeakDemo() {
  return <Demo bad />
}

export function CleanupDemo() {
  return <Demo bad={false} />
}
