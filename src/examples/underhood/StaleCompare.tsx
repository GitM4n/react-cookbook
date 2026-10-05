import { useState } from 'react'
import { LogView, useLog } from '../../lib/demo-kit'

export function StaleIncrement() {
  const [count, setCount] = useState(0)
  const { entries, push, clear } = useLog(6)

  const fire = () => {
    const captured = count
    push(`создаём 3 таймера, каждый захватил count = ${captured}`)
    for (let i = 0; i < 3; i++) {
      window.setTimeout(() => {
        push(`таймер видит count = ${captured}, ставим ${captured + 1}`)
        setCount(captured + 1)
      }, 500)
    }
  }

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={fire}>
          +1 через 500 мс, трижды
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setCount(0)}>
          сброс
        </button>
        <button type="button" className="btn btn--sm btn--ghost" onClick={clear}>
          очистить
        </button>
        <b style={{ fontSize: 24 }}>count = {count}</b>
      </div>
      <LogView entries={entries} empty="Запустите отложенные инкременты" />
      <span className="muted">
        Три таймера создались с одним и тем же значением — в итоге прибавилось единицу, а не три.
      </span>
    </div>
  )
}

export function FreshIncrement() {
  const [count, setCount] = useState(0)
  const { entries, push, clear } = useLog(6)

  const fire = () => {
    push('создаём 3 таймера с функциональным сеттером')
    for (let i = 0; i < 3; i++) {
      window.setTimeout(() => {
        setCount((previous) => {
          push(`сеттер получил актуальное значение ${previous}`)
          return previous + 1
        })
      }, 500)
    }
  }

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={fire}>
          +1 через 500 мс, трижды
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setCount(0)}>
          сброс
        </button>
        <button type="button" className="btn btn--sm btn--ghost" onClick={clear}>
          очистить
        </button>
        <b style={{ fontSize: 24 }}>count = {count}</b>
      </div>
      <LogView entries={entries} empty="Запустите отложенные инкременты" />
      <span className="muted">
        Функция-обновитель вызывается React'ом в момент обновления — она видит свежее значение.
      </span>
    </div>
  )
}
