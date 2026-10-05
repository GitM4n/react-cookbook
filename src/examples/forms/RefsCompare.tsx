import { useRef, useState } from 'react'
import { RenderCount } from '../../lib/demo-kit'

export function ClicksWithState() {
  const [clicks, setClicks] = useState(0)

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={() => setClicks((c) => c + 1)}>
          Клик
        </button>
        <RenderCount label="Рендеров при каждом клике" />
      </div>
      <div className="panel panel--bad">
        clicks = {clicks} — значение нужно только для подсчёта, но UI перерисовывается целиком.
      </div>
    </div>
  )
}

export function ClicksWithRef() {
  const clicks = useRef(0)

  return (
    <div className="stack">
      <div className="row">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => {
            clicks.current += 1
          }}
        >
          Клик
        </button>
        <RenderCount label="Рендеров при каждом клике" />
      </div>
      <div className="panel panel--good">
        clicks.current = {clicks.current} — React не перерисовывает компонент. Значение увидите только после
        следующего рендера по другой причине.
      </div>
    </div>
  )
}
