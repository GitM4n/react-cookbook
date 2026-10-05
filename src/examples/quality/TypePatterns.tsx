import { useState } from 'react'

type NotificationProps =
  | { kind: 'success'; message: string }
  | { kind: 'error'; message: string; code: number }
  | { kind: 'loading' }

/** То, что сейчас «набрано» в демо-форме: здесь строгости ещё нет. */
type Draft = {
  kind: 'success' | 'error' | 'loading'
  message?: string
  code?: number
}

/** Рантайм-аналог проверки типов: без code получить NotificationProps нельзя. */
function compile(draft: Draft): NotificationProps | null {
  if (draft.kind === 'loading') return { kind: 'loading' }
  if (!draft.message) return null
  if (draft.kind === 'success') return { kind: 'success', message: draft.message }
  if (draft.code === undefined) return null
  return { kind: 'error', message: draft.message, code: draft.code }
}

interface Todo {
  id: number
  title: string
  done: boolean
}

function List<T>({ items, render }: { items: T[]; render: (item: T) => string }) {
  return (
    <ul className="stack" style={{ margin: 0, paddingLeft: 18 }}>
      {items.map((item, index) => (
        <li key={index}>{render(item)}</li>
      ))}
    </ul>
  )
}

function Notification(props: NotificationProps) {
  if (props.kind === 'loading') return <span className="badge">Загрузка…</span>
  if (props.kind === 'error') return <span className="badge badge--bad">{props.code}: {props.message}</span>
  return <span className="badge badge--good">{props.message}</span>
}

export default function TypePatterns() {
  const [kind, setKind] = useState<NotificationProps['kind']>('success')
  const [withCode, setWithCode] = useState(true)
  const [dataset, setDataset] = useState<'strings' | 'numbers' | 'todos'>('strings')

  const draft: Draft = {
    kind,
    message: kind === 'loading' ? undefined : kind === 'success' ? 'Сохранено' : 'Не удалось сохранить',
    code: kind === 'error' && withCode ? 500 : undefined,
  }

  const compiled = compile(draft)
  const valid = compiled !== null

  const todos: Todo[] = [
    { id: 1, title: 'Пройти раздел «Типы»', done: true },
    { id: 2, title: 'Добавить типизацию в проект', done: false },
  ]

  return (
    <div className="stack">
      <div className="panel stack">
        <b>1. Discriminated union: пропсы зависят от kind</b>
        <div className="row">
          {(['success', 'error', 'loading'] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={`chip${kind === value ? ' chip--active' : ''}`}
              onClick={() => setKind(value)}
            >
              kind: {value}
            </button>
          ))}
          <label className="row">
            <input
              type="checkbox"
              checked={withCode}
              disabled={kind !== 'error'}
              onChange={(event) => setWithCode(event.target.checked)}
            />
            передать code
          </label>
        </div>

        <div className="row">
          <span className="muted">Результат:</span>
          {compiled ? (
            <Notification {...compiled} />
          ) : (
            <span className="badge badge--bad">не компилируется</span>
          )}
        </div>

        <div className={`panel ${valid ? 'panel--good' : 'panel--bad'}`}>
          {valid ? (
            <span>✅ TypeScript: ошибок нет — набор пропсов подходит под выбранный kind.</span>
          ) : (
            <span>
              ❌ TypeScript: <code>TS2741: Property 'code' is missing in type '&#123; kind: &quot;error&quot;; message: string &#125;' but required in type '&#123; kind: &quot;error&quot;; message: string; code: number &#125;'</code>
            </span>
          )}
        </div>
        <span className="muted">
          Без union типизатор не знает, что для <code>kind: &quot;error&quot;</code> обязателен <code>code</code> —
          он пропустит опечатку. Объединение литеральных типов заставляет обрабатывать каждую ветку.
        </span>
      </div>

      <div className="panel stack">
        <b>2. Дженерик: один компонент для любых данных</b>
        <div className="row">
          {(['strings', 'numbers', 'todos'] as const).map((value) => (
            <button
              key={value}
              type="button"
              className={`chip${dataset === value ? ' chip--active' : ''}`}
              onClick={() => setDataset(value)}
            >
              {value}
            </button>
          ))}
        </div>

        {dataset === 'strings' ? (
          <List items={['React', 'TypeScript', 'Vite']} render={(item) => item.toUpperCase()} />
        ) : null}
        {dataset === 'numbers' ? <List items={[1, 2, 3]} render={(item) => item.toFixed(2)} /> : null}
        {dataset === 'todos' ? (
          <List items={todos} render={(todo) => `${todo.title} — ${todo.done ? 'готово' : 'в работе'}`} />
        ) : null}

        <span className="muted">
          В одном случае <code>render: (item: string) =&gt; string</code>, в другом —{' '}
          <code>(item: Todo) =&gt; string</code>. Ошибка вроде <code>todo.titlee</code> всплывет сразу, а не
          в браузере.
        </span>
      </div>
    </div>
  )
}
