import { useEffect, useRef, useState } from 'react'

interface Item {
  id: number
  text: string
}

type Verdict = 'created' | 'reused' | 'reused-other-item' | 'unknown'

const INITIAL: Item[] = [
  { id: 1, text: 'Антон' },
  { id: 2, text: 'Борис' },
  { id: 3, text: 'Вера' },
  { id: 4, text: 'Глеб' },
]

export default function ReconciliationDemo() {
  const [items, setItems] = useState<Item[]>(INITIAL)
  const [byIndex, setByIndex] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const nodeHistory = useRef(new Map<Element, string>())
  const [report, setReport] = useState<{ id: number; verdict: Verdict }[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const rows = Array.from(container.querySelectorAll<HTMLElement>('[data-item-id]'))
    const next: { id: number; verdict: Verdict }[] = []

    for (const row of rows) {
      const id = row.dataset.itemId ?? ''
      const previousId = nodeHistory.current.get(row)
      const verdict: Verdict =
        previousId === undefined ? 'created' : previousId === id ? 'reused' : 'reused-other-item'
      next.push({ id: Number(id), verdict })
      nodeHistory.current.set(row, id)
    }

    setReport(next)
    // Сравнение узлов нужно именно после обновления списка, а не после каждого рендера.
  }, [items, byIndex])

  const shuffle = () => setItems((prev) => [...prev].sort(() => Math.random() - 0.5))

  const text = (verdict: Verdict) => {
    if (verdict === 'created') return 'создан заново'
    if (verdict === 'reused') return 'переиспользован ✅'
    return 'узел остался, но теперь отвечает за другой id ⚠️'
  }

  return (
    <div className="stack">
      <div className="row">
        <button
          type="button"
          className={`chip${!byIndex ? ' chip--active' : ''}`}
          onClick={() => setByIndex(false)}
        >
          key = id
        </button>
        <button
          type="button"
          className={`chip${byIndex ? ' chip--active' : ''}`}
          onClick={() => setByIndex(true)}
        >
          key = index
        </button>
        <button type="button" className="btn btn--ghost" onClick={shuffle}>
          Перемешать
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setItems(INITIAL)}>
          Вернуть порядок
        </button>
      </div>

      <div className="panel stack" ref={containerRef}>
        {items.map((item, index) => (
          <div key={byIndex ? index : item.id} data-item-id={item.id} className="panel">
            <code>key={byIndex ? index : item.id}</code> — {item.text}
          </div>
        ))}
      </div>

      <div className="panel stack">
        <b>Судьба каждого DOM-узла после последнего обновления</b>
        {report.map((row) => (
          <div key={row.id} className="row" style={{ justifyContent: 'space-between' }}>
            <span>id = {row.id}</span>
            <span className="muted">{text(row.verdict)}</span>
          </div>
        ))}
        <span className="muted">
          Счётчик проверяет ссылки на настоящие DOM-узлы до и после обновления — это и есть то, что делает
          reconciliation.
        </span>
      </div>

      <p className="muted">
        С ключами по <code>id</code> React <b>перемещает</b> существующие узлы: ссылки сохраняются. С ключами
        по индексу узлы тоже переиспользуются, но по позиции — после перемешивания один и тот же узел
        начинает отображать другой элемент списка, а его локальное состояние «переезжает» к чужой строке.
      </p>
    </div>
  )
}
