import { useState } from 'react'

export function NotificationsBad() {
  const [count, setCount] = useState(0)

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={() => setCount((c) => c + 1)}>
          +1
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setCount((c) => Math.max(0, c - 1))}>
          −1
        </button>
      </div>
      <div className="panel panel--bad">
        <code>{'{count && <Badge …>}'}</code>
        <div>Результат: {count && <span className="badge">уведомлений: {count}</span>}</div>
        <span className="muted">Когда count = 0, в DOM попадает просто «0».</span>
      </div>
    </div>
  )
}

export function NotificationsGood() {
  const [count, setCount] = useState(0)

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={() => setCount((c) => c + 1)}>
          +1
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setCount((c) => Math.max(0, c - 1))}>
          −1
        </button>
      </div>
      <div className="panel panel--good">
        <code>{'{count > 0 && <Badge …>}'}</code>
        <div>Результат: {count > 0 && <span className="badge">уведомлений: {count}</span>}</div>
        <span className="muted">При нулях возвращается false — на экране ничего.</span>
      </div>
    </div>
  )
}
