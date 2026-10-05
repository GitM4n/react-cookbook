import { useRef, useState } from 'react'

export default function StateDerived() {
  const [count, setCount] = useState(0)
  const renders = useRef(0)
  renders.current += 1

  // Выведенное состояние: просто результат, посчитанный во время рендера.
  // Отдельный useState ему не нужен.
  const isEven = count % 2 === 0
  const parity = isEven ? 'чётное' : 'нечётное'
  const doubled = count * 2

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={() => setCount((c) => c - 1)}>
          −1
        </button>
        <button type="button" className="btn btn--primary" onClick={() => setCount((c) => c + 1)}>
          +1
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setCount(0)}>
          сброс
        </button>
        <span className="render-count">
          Рендеров: <b>#{renders.current}</b>
        </span>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="muted">Состояние (useState)</div>
          <b style={{ fontSize: 26 }}>{count}</b>
        </div>
        <div className="panel">
          <div className="muted">Выведенные значения (просто вычисления)</div>
          <b style={{ fontSize: 26 }}>
            {parity} · ×2 = {doubled}
          </b>
        </div>
      </div>

      <p className="muted">
        Пока <code>count</code> меняется, <code>parity</code> и <code>doubled</code> всегда пересчитываются
        заново — рассинхронизироваться им не с чем.
      </p>
    </div>
  )
}
