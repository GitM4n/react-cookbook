import { useState } from 'react'

interface Item {
  id: number
  text: string
}

type Op =
  | { kind: 'insert'; id: number; text: string }
  | { kind: 'remove'; id: number; text: string }
  | { kind: 'update'; id: number; from: string; to: string }
  | { kind: 'keep'; id: number }

function diff(before: Item[], after: Item[]): Op[] {
  const beforeMap = new Map(before.map((item) => [item.id, item]))
  const afterMap = new Map(after.map((item) => [item.id, item]))
  const ops: Op[] = []

  for (const item of after) {
    const previous = beforeMap.get(item.id)
    if (!previous) ops.push({ kind: 'insert', id: item.id, text: item.text })
    else if (previous.text !== item.text) ops.push({ kind: 'update', id: item.id, from: previous.text, to: item.text })
    else ops.push({ kind: 'keep', id: item.id })
  }
  for (const item of before) {
    if (!afterMap.has(item.id)) ops.push({ kind: 'remove', id: item.id, text: item.text })
  }
  return ops
}

let nextId = 4

export default function VirtualDomDemo() {
  const [committed, setCommitted] = useState<Item[]>([
    { id: 1, text: 'Антон' },
    { id: 2, text: 'Борис' },
    { id: 3, text: 'Вера' },
  ])
  const [draft, setDraft] = useState<Item[]>(committed)
  const [applied, setApplied] = useState<Op[]>([])

  const ops = diff(committed, draft)
  const pending = ops.filter((op) => op.kind !== 'keep')

  const commit = () => {
    setCommitted(draft)
    setApplied(ops)
  }

  const reset = () => {
    const initial = [
      { id: 1, text: 'Антон' },
      { id: 2, text: 'Борис' },
      { id: 3, text: 'Вера' },
    ]
    setCommitted(initial)
    setDraft(initial)
    setApplied([])
    nextId = 4
  }

  const label = (op: Op) => {
    if (op.kind === 'insert') return `+ insert #${op.id} «${op.text}»`
    if (op.kind === 'remove') return `− remove #${op.id} «${op.text}»`
    if (op.kind === 'update') return `~ update #${op.id}: «${op.from}» → «${op.to}»`
    return `· keep #${op.id}`
  }

  return (
    <div className="stack">
      <div className="row">
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            const id = nextId++
            setDraft((prev) => [...prev, { id, text: `Гость #${id}` }])
          }}
        >
          + элемент
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setDraft((prev) => prev.slice(0, -1))}
        >
          − последний
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() =>
            setDraft((prev) => prev.map((item, index) => (index === 0 ? { ...item, text: `Антон ${'*'.repeat((item.text.split('*').length) % 3)}` } : item)))
          }
        >
          изменить первый
        </button>
        <button type="button" className="btn btn--ghost" onClick={reset}>
          сброс
        </button>
      </div>

      <div className="grid-2">
        <div className="panel stack">
          <b>Виртуальное дерево до (committed)</b>
          {committed.map((item) => (
            <div key={item.id}>
              <code>&lt;li key={item.id}&gt;{item.text}&lt;/li&gt;</code>
            </div>
          ))}
        </div>
        <div className="panel stack">
          <b>Виртуальное дерево после (draft)</b>
          {draft.map((item) => (
            <div key={item.id}>
              <code>&lt;li key={item.id}&gt;{item.text}&lt;/li&gt;</code>
            </div>
          ))}
        </div>
      </div>

      <div className={`panel ${pending.length ? 'panel--bad' : 'panel--good'}`}>
        <b>Патч, который получит настоящий DOM:</b>
        {pending.length === 0 ? (
          <div className="muted">изменений нет — React ничего не тронет</div>
        ) : (
          pending.map((op, index) => (
            <div key={index}>
              <code>{label(op)}</code>
            </div>
          ))
        )}
        <div className="row" style={{ marginTop: 8 }}>
          <button type="button" className="btn btn--sm btn--primary" onClick={commit} disabled={!pending.length}>
            Применить (как это делает React после рендера)
          </button>
          <span className="muted">всего узлов в дереве: {ops.length}, тронет React: {pending.length}</span>
        </div>
      </div>

      {applied.length ? (
        <div className="panel">
          <div className="muted">Последний применённый патч</div>
          {applied.map((op, index) => (
            <div key={index}>
              <code>{label(op)}</code>
            </div>
          ))}
        </div>
      ) : null}

      <p className="muted">
        Рендер создаёт <b>новое описание</b> дерева (JSX → объекты). React сравнивает его с предыдущим,
        составляет список операций и выполняет только их. Настоящий DOM пересоздаётся лишь для
        добавленных/удалённых узлов — остальное это правка текста и атрибутов.
      </p>
    </div>
  )
}
