import { useState } from 'react'
import { isValidElement } from 'react'
import type { ReactNode } from 'react'

function formatValue(value: unknown): string {
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'boolean') return String(value)
  if (typeof value === 'function') return (value as { name?: string }).name || 'fn()'
  return '{…}'
}

function describeNode(node: ReactNode, depth = 0): string[] {
  const pad = '  '.repeat(depth)
  if (node === null || node === undefined || typeof node === 'boolean') return []
  if (Array.isArray(node)) return node.flatMap((child) => describeNode(child, depth))
  if (typeof node === 'string' || typeof node === 'number') return [`${pad}${JSON.stringify(node)}`]
  if (!isValidElement<Record<string, unknown>>(node)) return [`${pad}${String(node)}`]

  const { children, ...rest } = node.props
  const type = node.type
  const name =
    typeof type === 'string' ? type : typeof type === 'function' ? type.name || 'Component' : 'Fragment'
  const attrs = Object.entries(rest)
    .map(([key, value]) => `${key}=${formatValue(value)}`)
    .join(' ')

  return [`${pad}<${name}${attrs ? ' ' + attrs : ''}>`, ...describeNode(children as ReactNode, depth + 1)]
}

export default function JsxInspector() {
  const [title, setTitle] = useState('Hello, JSX')
  const [withBadge, setWithBadge] = useState(true)

  const card = (
    <div className="panel" data-open={withBadge}>
      <h4 style={{ margin: 0 }}>{title}</h4>
      {withBadge && <span className="badge">NEW</span>}
    </div>
  )

  return (
    <div className="stack">
      <div className="row">
        <input
          className="input"
          style={{ maxWidth: 240 }}
          value={title}
          aria-label="Текст заголовка"
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          type="button"
          className={`chip${withBadge ? ' chip--active' : ''}`}
          onClick={() => setWithBadge((v) => !v)}
        >
          withBadge = {String(withBadge)}
        </button>
      </div>

      <div className="grid-2">
        <div className="stack">
          <span className="muted">1. Что появилось на экране:</span>
          {card}
        </div>
        <div className="stack">
          <span className="muted">2. Что JSX вернул React'у (объект элементов):</span>
          <pre className="log">{describeNode(card).join('\n') || '—'}</pre>
        </div>
      </div>

      <p className="muted">
        JSX ничего не рисует сам по себе: он превращается в <code>createElement</code>-подобный вызов и
        возвращает обычный объект. React сравнивает старое и новое описание и вносит минимальные изменения в
        настоящий DOM.
      </p>
    </div>
  )
}
