import { Suspense, useState } from 'react'
import { use } from 'react'
import { ErrorBoundary } from './ErrorBoundaryDemo'

function loadData(query: string, fail: boolean): Promise<string> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      if (fail) reject(new Error(`Сервер 500 на запрос «${query}»`))
      else resolve(`Найдено 12 результатов по запросу «${query}»`)
    }, 900)
  })
}

function Result({ promise }: { promise: Promise<string> }) {
  const text = use(promise)
  return <div className="panel panel--good">{text}</div>
}

export default function SuspenseDemo() {
  const [query, setQuery] = useState('react')
  const [fail, setFail] = useState(false)
  const [request, setRequest] = useState(() => loadData('react', false))
  const [id, setId] = useState(0)

  const reload = () => {
    setRequest(loadData(query, fail))
    setId((value) => value + 1)
  }

  return (
    <div className="stack">
      <div className="row">
        <input
          className="input"
          style={{ maxWidth: 240 }}
          value={query}
          aria-label="Запрос"
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="button"
          className={`chip${fail ? ' chip--active' : ''}`}
          onClick={() => setFail((value) => !value)}
        >
          режим ошибки: {String(fail)}
        </button>
        <button type="button" className="btn btn--primary" onClick={reload}>
          Загрузить
        </button>
      </div>

      <ErrorBoundary
        resetKey={id}
        fallback={(error) => (
          <div className="panel panel--bad stack">
            <b>Ошибка загрузки</b>
            <code>{error.message}</code>
            <span className="muted">Выключите «режим ошибки» и нажмите «Загрузить» ещё раз.</span>
          </div>
        )}
      >
        <Suspense
          key={id}
          fallback={
            <div className="panel">
              <b>⏳ Suspense:</b> идёт загрузка, дочерний компонент ещё не рендерится…
            </div>
          }
        >
          <Result promise={request} />
        </Suspense>
      </ErrorBoundary>

      <p className="muted">
        <code>use(promise)</code> «бросает» промис в рендер: React видит suspended-компонент и показывает
        ближайший <code>fallback</code>, а после разрешения промиса перерисовывает subtree уже с данными.
        Обработки <code>loading</code>-состояния вручную в компоненте больше нет.
      </p>
    </div>
  )
}
