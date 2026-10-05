import { useState } from 'react'

export function MutateState() {
  const [items, setItems] = useState(['React', 'TypeScript', 'Vite'])
  const [extra, setExtra] = useState(0)

  const addBuggy = () => {
    items.push(`Новый #${items.length + 1}`)
    setItems(items)
  }

  const addBuggyWithSideUpdate = () => {
    items.push(`Новый #${items.length + 1}`)
    setItems(items)
    setExtra((value) => value + 1)
  }

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={addBuggy}>
          Добавить (мутация)
        </button>
        <button type="button" className="btn btn--ghost" onClick={addBuggyWithSideUpdate}>
          Мутация + обновить другое состояние
        </button>
        <span className="muted">extra = {extra}</span>
      </div>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <span className="muted">
        Первая кнопка ничего не делает: массив уже изменён, но ссылка та же — React считает, что обновления
        нет. Вторая кнопка «лечит» баг случайно: другой сеттер вызывает рендер, и мутация становится видна.
      </span>
    </div>
  )
}

export function ImmutableState() {
  const [items, setItems] = useState(['React', 'TypeScript', 'Vite'])
  const [extra, setExtra] = useState(0)

  const add = () => setItems((prev) => [...prev, `Новый #${prev.length + 1}`])

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={add}>
          Добавить (иммутабельно)
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setExtra((value) => value + 1)}
        >
          Обновить другое состояние
        </button>
        <span className="muted">extra = {extra}</span>
      </div>
      <ul style={{ margin: 0, paddingLeft: 18 }}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <span className="muted">
        Каждое обновление создаёт новый массив: React сравнивает ссылки, видит изменение и рисует список.
        Порядок кнопок и соседние сеттеры больше не имеют значения.
      </span>
    </div>
  )
}
