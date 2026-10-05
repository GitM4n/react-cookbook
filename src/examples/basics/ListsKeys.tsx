import { useRef, useState } from 'react'
import type { ReactNode } from 'react'

interface Item {
  id: number
  label: string
}

function Row({ children }: { children?: ReactNode }) {
  const [liked, setLiked] = useState(false)
  return (
    <li className="panel row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
      <span>
        {children} {liked ? '❤️' : ''}
      </span>
      <button type="button" className="chip" onClick={() => setLiked((v) => !v)}>
        {liked ? 'лайкнут' : 'лайк'}
      </button>
    </li>
  )
}

export default function ListsKeys() {
  const nextId = useRef(4)
  const [items, setItems] = useState<Item[]>([
    { id: 1, label: 'Антон' },
    { id: 2, label: 'Борис' },
    { id: 3, label: 'Вера' },
  ])
  const [byIndex, setByIndex] = useState(false)

  const add = () => {
    const id = nextId.current++
    setItems((prev) => [...prev, { id, label: `Гость #${id}` }])
  }
  const removeFirst = () => setItems((prev) => prev.slice(1))
  const shuffle = () => setItems((prev) => [...prev].sort(() => Math.random() - 0.5))

  return (
    <div className="stack">
      <div className="row">
        <button
          type="button"
          className={`chip${!byIndex ? ' chip--active' : ''}`}
          onClick={() => setByIndex(false)}
        >
          key = item.id ✅
        </button>
        <button
          type="button"
          className={`chip${byIndex ? ' chip--active' : ''}`}
          onClick={() => setByIndex(true)}
        >
          key = index ❌
        </button>
      </div>

      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={add}>
          Добавить
        </button>
        <button type="button" className="btn btn--ghost" onClick={removeFirst}>
          Удалить первого
        </button>
        <button type="button" className="btn btn--ghost" onClick={shuffle}>
          Перемешать
        </button>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map((item, index) => (
          <Row key={byIndex ? index : item.id}>{item.label}</Row>
        ))}
      </ul>

      <p className="muted">
        Поставьте лайк первому человеку, затем нажмите <b>«Удалить первого»</b> при ключах-индексах: лайк
        останется не тому человеку. Состояние живёт в компоненте, а <code>key</code> говорит React, какой
        именно компонент с какой строкой совпадает.
      </p>
    </div>
  )
}
