import { useRef, useState } from 'react'
import { LogView, useLog } from '../../lib/demo-kit'

export default function EventsDemo() {
  const [clicks, setClicks] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [name, setName] = useState('')
  const renders = useRef(0)
  renders.current += 1

  const { entries, push, clear } = useLog()

  const handleStep = (step: number) => {
    setClicks((c) => c + step)
    push(`click, шаг ${step}, рендеров всего: ${renders.current}`)
  }

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={() => handleStep(1)}>
          onClick: +1
        </button>
        <button type="button" className="btn btn--ghost" onClick={handleStep.bind(null, 5)}>
          onClick(5): +5
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onMouseEnter={() => {
            setHovered((h) => h + 1)
            push('mouseenter')
          }}
        >
          onMouseEnter (счётчик: {hovered})
        </button>
        <button type="button" className="btn btn--ghost" onDoubleClick={() => push('doubleclick')}>
          onDoubleClick
        </button>
        <span className="render-count">
          Рендеров: <b>#{renders.current}</b>
        </span>
      </div>

      <form
        className="row"
        onSubmit={(event) => {
          event.preventDefault()
          push(`submit: name = "${name}"`)
          setName('')
        }}
      >
        <input
          className="input"
          style={{ maxWidth: 260 }}
          placeholder="Введите имя и нажмите Enter"
          value={name}
          aria-label="Имя"
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit" className="btn btn--ghost">
          Отправить форму
        </button>
      </form>

      <div className="row" style={{ justifyContent: 'space-between' }}>
        <b>clicks = {clicks}</b>
        <button type="button" className="btn btn--sm btn--ghost" onClick={clear}>
          Очистить журнал
        </button>
      </div>

      <LogView entries={entries} empty="Событий пока не было" />

      <p className="muted">
        Обработчики — это обычные функции. Внутри <code>onChange</code> мы получаем синтетическое событие
        React'а, а в колбэках вида <code>{'() => handleStep(1)'}</code> — уже подготовленный вызов.
      </p>
    </div>
  )
}
