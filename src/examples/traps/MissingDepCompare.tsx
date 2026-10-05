import { useEffect, useState } from 'react'
import { LogView, useLog } from '../../lib/demo-kit'

const DEFAULT_DELAY = 600

function Controls({ delay, setDelay }: { delay: number; setDelay: (value: number) => void }) {
  return (
    <div className="row">
      <label className="row">
        <span className="muted">интервал опроса:</span>
        <input
          type="range"
          min={300}
          max={1600}
          step={100}
          value={delay}
          onChange={(event) => setDelay(Number(event.target.value))}
        />
        <b>{delay} мс</b>
      </label>
    </div>
  )
}

export function EffectWithoutDeps() {
  const [delay, setDelay] = useState(DEFAULT_DELAY)
  const { entries, push, clear } = useLog(6)

  useEffect(() => {
    push(`эффект запустился один раз, interval = ${delay}`)
    const id = window.setInterval(() => push(`опрос с interval = ${delay}`), delay)
    return () => window.clearInterval(id)
    // ❌ Зависимости забыли: effect навсегда захватил начальный delay.
  }, [])

  return (
    <div className="stack">
      <Controls delay={delay} setDelay={setDelay} />
      <div className="row">
        <span className="badge badge--bad">в консоли эффекта всегда {DEFAULT_DELAY} мс</span>
        <button type="button" className="btn btn--sm btn--ghost" onClick={clear}>
          очистить
        </button>
      </div>
      <LogView entries={entries} empty="Подождите пару секунд или подвигайте ползунок" />
      <span className="muted">
        Ползунок двигается, значение в UI меняется, а эффект продолжает опрашивать с начальным интервалом:
        он видит только ту переменную, что была в момент монтирования.
      </span>
    </div>
  )
}

export function EffectWithDeps() {
  const [delay, setDelay] = useState(DEFAULT_DELAY)
  const { entries, push, clear } = useLog(6)

  useEffect(() => {
    push(`запуск: interval = ${delay}`)
    const id = window.setInterval(() => push(`опрос с interval = ${delay}`), delay)
    return () => {
      window.clearInterval(id)
      push(`cleanup: interval = ${delay} снят`)
    }
  }, [delay, push])

  return (
    <div className="stack">
      <Controls delay={delay} setDelay={setDelay} />
      <div className="row">
        <span className="badge badge--good">интервал в журнале совпадает с ползунком</span>
        <button type="button" className="btn btn--sm btn--ghost" onClick={clear}>
          очистить
        </button>
      </div>
      <LogView entries={entries} empty="Подождите пару секунд или подвигайте ползунок" />
      <span className="muted">
        Добавили delay в зависимости — при каждом изменении старый таймер снимается, новый ставится с
        актуальным значением.
      </span>
    </div>
  )
}
