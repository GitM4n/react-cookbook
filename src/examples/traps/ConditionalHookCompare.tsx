import { useState } from 'react'
import { ErrorBoundary } from '../architecture/ErrorBoundaryDemo'

function BrokenWithEarlyReturn({ showSecond }: { showSecond: boolean }) {
  const [first] = useState('первый хук')

  if (!showSecond) {
    // ❌ Ранний return до второго хука: число вызовов хуков меняется между рендерами.
    return <div className="panel panel--bad">Ранний return: второй useState пропущен</div>
  }

  const [second] = useState('второй хук')
  return (
    <div className="panel">
      {first} / {second}
    </div>
  )
}

function CorrectWithEarlyReturn({ showSecond }: { showSecond: boolean }) {
  const [first] = useState('первый хук')
  const [second] = useState('второй хук')

  if (!showSecond) {
    // ✅ Все хуки вызваны безусловно, условие окружает только разметку.
    return <div className="panel panel--good">Ранний return — но хуки уже выполнены</div>
  }

  return (
    <div className="panel">
      {first} / {second}
    </div>
  )
}

function Demo({ broken }: { broken: boolean }) {
  const [showSecond, setShowSecond] = useState(true)

  const Body = broken ? BrokenWithEarlyReturn : CorrectWithEarlyReturn

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={() => setShowSecond((value) => !value)}>
          {showSecond ? 'включить ранний return' : 'вернуть вторую ветку'}
        </button>
        <span className="muted">showSecond = {String(showSecond)}</span>
      </div>

      <ErrorBoundary
        resetKey={showSecond}
        fallback={(error, reset) => (
          <div className="panel panel--bad stack">
            <b>React уронил компонент:</b>
            <code>{error.message}</code>
            <div className="row">
              <button
                type="button"
                className="btn btn--sm btn--primary"
                onClick={() => {
                  reset()
                  setShowSecond(true)
                }}
              >
                Вернуться к рабочей ветке
              </button>
            </div>
          </div>
        )}
      >
        <Body showSecond={showSecond} />
      </ErrorBoundary>

      <span className="muted">
        {broken
          ? 'Переключите ветку: React считает вызовы хуков по порядку и при несовпадении бросает ошибку о нарушении правил.'
          : 'Хуки вызываются всегда в одном и том же порядке, а условие окружает только разметку — ошибки нет.'}
      </span>
    </div>
  )
}

export function ConditionalHook() {
  return <Demo broken />
}

export function SafeHooks() {
  return <Demo broken={false} />
}
