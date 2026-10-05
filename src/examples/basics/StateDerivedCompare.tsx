import { useState } from 'react'

export function CountersBad() {
  const [count, setCount] = useState(0)
  // Дублируем производное значение в отдельном стейте.
  const [isEven, setIsEven] = useState(true)

  const increment = () => {
    setCount(count + 1)
    setIsEven((count + 1) % 2 === 0)
  }
  // Здесь мы «забыли» обновить isEven — состояния разъехались.
  const decrement = () => setCount(count - 1)

  const inSync = isEven === (count % 2 === 0)

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={decrement}>
          −1
        </button>
        <button type="button" className="btn btn--primary" onClick={increment}>
          +1
        </button>
        <b style={{ fontSize: 22 }}>{count}</b>
      </div>
      <div className={`panel ${inSync ? '' : 'panel--bad'}`}>
        {isEven ? 'чётное' : 'нечётное'} (флаг из стейта)
        {inSync ? '' : ' — рассинхронизировалось!'}
      </div>
    </div>
  )
}

export function CountersGood() {
  const [count, setCount] = useState(0)

  const isEven = count % 2 === 0

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={() => setCount((c) => c - 1)}>
          −1
        </button>
        <button type="button" className="btn btn--primary" onClick={() => setCount((c) => c + 1)}>
          +1
        </button>
        <b style={{ fontSize: 22 }}>{count}</b>
      </div>
      <div className="panel panel--good">{isEven ? 'чётное' : 'нечётное'} (считаем при рендере)</div>
    </div>
  )
}
