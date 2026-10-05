import { useState } from 'react'

type Mode = 'and' | 'ternary' | 'early' | 'variable'

function Profile({ mode, loggedIn, views }: { mode: Mode; loggedIn: boolean; views: number }) {
  if (mode === 'early') {
    if (!loggedIn) {
      return (
        <div className="panel">
          <b>Early return:</b> сначала проверяем условие и сразу возвращаем заглушку.
        </div>
      )
    }
    return (
      <div className="panel panel--good">
        <b>Early return:</b> профиль, просмотров: {views}
      </div>
    )
  }

  if (mode === 'and') {
    return (
      <div className="panel">
        <code>{'loggedIn && <Profile …/>'}</code> → {loggedIn ? 'показан профиль' : 'ничего (false не рисуется)'}
      </div>
    )
  }

  if (mode === 'ternary') {
    return (
      <div className="panel">
        <code>{'loggedIn ? <Profile …/> : <Login …/>'}</code> →{' '}
        {loggedIn ? `профиль, просмотров: ${views}` : 'форма входа'}
      </div>
    )
  }

  const node = loggedIn ? <b>переменная с JSX: просмотров {views}</b> : null
  return <div className="panel">Любой вариант можно присвоить переменную → {node ?? 'null'}</div>
}

export default function ConditionalRender() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [views, setViews] = useState(7)
  const [mode, setMode] = useState<Mode>('ternary')

  const modes: { id: Mode; label: string }[] = [
    { id: 'and', label: '&&' },
    { id: 'ternary', label: 'тернарник' },
    { id: 'early', label: 'early return' },
    { id: 'variable', label: 'переменная' },
  ]

  return (
    <div className="stack">
      <div className="row">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            className={`chip${mode === m.id ? ' chip--active' : ''}`}
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={() => setLoggedIn((v) => !v)}>
          loggedIn = {String(loggedIn)}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setViews((v) => v + 1)}>
          +1 просмотр
        </button>
      </div>

      <Profile mode={mode} loggedIn={loggedIn} views={views} />

      <p className="muted">
        Все четыре способа возвращают <b>один и тот же результат</b>: React рисует то, что вернуло
        выражение, а <code>null</code>, <code>false</code> и <code>undefined</code> игнорируются.
      </p>
    </div>
  )
}
