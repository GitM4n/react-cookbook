import { useState } from 'react'
import type { ReactNode } from 'react'

interface Item {
  id: number
  name: string
}

const ITEMS: Item[] = [
  { id: 1, name: 'Антон' },
  { id: 2, name: 'Борис' },
  { id: 3, name: 'Вера' },
]

function LikeButton({ label }: { label: string }) {
  const [liked, setLiked] = useState(false)
  return (
    <button type="button" className={`chip${liked ? ' chip--active' : ''}`} onClick={() => setLiked((value) => !value)}>
      {liked ? '❤️' : '🤍'} {label}
    </button>
  )
}

function List({
  keyFactory,
  children,
}: {
  keyFactory: (item: Item, index: number) => string
  children?: ReactNode
}) {
  const [, setTick] = useState(0)

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={() => setTick((value) => value + 1)}>
          перерисовать родителя
        </button>
        <span className="muted">{children}</span>
      </div>
      <div className="row">
        {ITEMS.map((item, index) => (
          <LikeButton key={keyFactory(item, index)} label={item.name} />
        ))}
      </div>
    </div>
  )
}

export function RandomKeys() {
  return (
    <List keyFactory={() => String(Math.random())}>
      Поставьте лайк и нажмите «перерисовать родителя»: лайки исчезают — React считает, что это совершенно
      новые компоненты.
    </List>
  )
}

export function StableKeys() {
  return (
    <List keyFactory={(item) => String(item.id)}>
      Лайки переживают любые рендеры: ключи стабильны, React переиспользует те же экземпляры.
    </List>
  )
}
