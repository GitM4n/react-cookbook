import { useState } from 'react'

export default function Counter({ initial = 0 }: { initial?: number }) {
  const [count, setCount] = useState(initial)

  return (
    <div className="stack">
      <span data-testid="value">Значение: {count}</span>
      <div className="row">
        <button type="button" onClick={() => setCount((value) => value + 1)}>
          Увеличить
        </button>
        <button type="button" onClick={() => setCount(initial)}>
          Сбросить
        </button>
      </div>
      {count > 5 ? <span className="badge badge--good">Счётчик перешёл порог</span> : null}
    </div>
  )
}
