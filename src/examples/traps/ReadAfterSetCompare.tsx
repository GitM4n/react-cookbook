import { useEffect, useState } from 'react'
import { LogView, useLog } from '../../lib/demo-kit'

export function ReadRightAfter() {
  const [count, setCount] = useState(0)
  const { entries, push, clear } = useLog(6)

  const handleClick = () => {
    setCount(count + 1)
    push(`сразу после setCount: count = ${count} — старое значение`)
    push(`через 0 мс:            count = ${count} — всё ещё старое`)
  }

  useEffect(() => {
    push(`рендер завершён:       count = ${count} — вот теперь новое`)
  }, [count, push])

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={handleClick}>
          +1 и прочитать значение
        </button>
        <b>count = {count}</b>
        <button type="button" className="btn btn--sm btn--ghost" onClick={clear}>
          очистить
        </button>
      </div>
      <LogView entries={entries} empty="Нажмите кнопку" />
      <span className="muted">
        Обработчик читает ту же переменную, что была в его замыкании: React ещё не перерисовал компонент.
      </span>
    </div>
  )
}

export function ReadAfterRender() {
  const [count, setCount] = useState(0)
  const { entries, push, clear } = useLog(6)

  const handleClick = () => {
    setCount((previous) => {
      push(`сеттер применён к previous = ${previous}`)
      return previous + 1
    })
  }

  useEffect(() => {
    push(`рендер завшершён: count = ${count}`)
  }, [count, push])

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={handleClick}>
          +1 и прочитать значение
        </button>
        <b>count = {count}</b>
        <button type="button" className="btn btn--sm btn--ghost" onClick={clear}>
          очистить
        </button>
      </div>
      <LogView entries={entries} empty="Нажмите кнопку" />
      <span className="muted">
        Новое значение читают там, где оно уже существует: в теле следующего рендера, в эффекте или внутри
        функции-обновителя.
      </span>
    </div>
  )
}
