import { useState } from 'react'
import { ErrorBoundary } from './ErrorBoundaryDemo'

function Bomb({ armed }: { armed: boolean }) {
  if (armed) throw new Error('ComponentDidCrash')
  return <div className="panel panel--good">Всё работает.</div>
}

export function SilentBoundary() {
  const [armed, setArmed] = useState(false)

  return (
    <div className="stack">
      <button type="button" className="btn btn--ghost" onClick={() => setArmed(true)}>
        Взорвать компонент
      </button>
      <ErrorBoundary resetKey={armed} fallback={() => null}>
        <Bomb armed={armed} />
      </ErrorBoundary>
      <span className="muted">
        Граница выше поймала ошибку… и не сказала об этом ничего: место компонента просто стало пустым.
      </span>
    </div>
  )
}

export function RecoveryBoundary() {
  const [armed, setArmed] = useState(false)

  return (
    <div className="stack">
      <button type="button" className="btn btn--ghost" onClick={() => setArmed(true)}>
        Взорвать компонент
      </button>
      <ErrorBoundary
        resetKey={armed}
        fallback={(error, reset) => (
          <div className="panel panel--bad stack">
            <b>Не удалось загрузить этот блок</b>
            <code>{error.message}</code>
            <div className="row">
              <button
                type="button"
                className="btn btn--sm btn--primary"
                onClick={() => {
                  reset()
                  setArmed(false)
                }}
              >
                Попробовать снова
              </button>
              <span className="muted">лог ушёл в console / Sentry</span>
            </div>
          </div>
        )}
      >
        <Bomb armed={armed} />
      </ErrorBoundary>
      <span className="muted">
        Пользователь понимает, что случилось, и может вернуть блок в работу без перезагрузки страницы.
      </span>
    </div>
  )
}
