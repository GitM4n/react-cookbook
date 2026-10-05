import { Suspense, lazy, useState } from 'react'
import type { ComponentType } from 'react'

const loadWithDelay = (): Promise<{ default: ComponentType }> =>
  new Promise((resolve) => {
    // Искусственная задержка, чтобы fallback был виден глазом:
    // в реальном проекте здесь просто import('./HeavyPanel').
    window.setTimeout(() => {
      void import('./HeavyPanel').then((module) => resolve({ default: module.default }))
    }, 900)
  })

const HeavyPanel = lazy(loadWithDelay)

export default function LazyDemo() {
  const [show, setShow] = useState(false)

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={() => setShow((value) => !value)}>
          {show ? 'Размонтировать панель' : 'Открыть панель'}
        </button>
        <span className="badge">{show ? 'чанк загружен' : 'чанка пока нет в странице'}</span>
      </div>

      <Suspense
        fallback={
          <div className="panel">
            <b>⏳ lazy:</b> загружается отдельный чанк…
          </div>
        }
      >
        {show ? <HeavyPanel /> : null}
      </Suspense>

      <div className="panel">
        <div className="muted">Что происходит</div>
        <code>lazy()</code> возвращает компонент-обёртку: при первом монтаже она делает динамический
        <code> import()</code> и бросает промис — его подхватывает Suspense. Пока чанк едет, виден fallback.
        Повторные монтирования берут модуль из кэша браузера и проходят мгновенно.
      </div>
    </div>
  )
}
