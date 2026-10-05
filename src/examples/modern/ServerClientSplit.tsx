import { useState } from 'react'

type Side = 'server' | 'client'

interface ComponentInfo {
  name: string
  side: Side
  weight: number
  note: string
}

const INITIAL: ComponentInfo[] = [
  { name: 'PageLayout', side: 'server', weight: 0.4, note: 'статичная разметка, грузится на сервере' },
  { name: 'ProductGallery', side: 'server', weight: 2.1, note: 'данные уже в пропсах, рендер на сервере' },
  { name: 'BuyButton', side: 'client', weight: 1.8, note: 'нужен onClick → интерактивный' },
  { name: 'LikeCounter', side: 'client', weight: 1.2, note: 'useState + отправка лайка' },
  { name: 'TableOfContents', side: 'server', weight: 0.6, note: 'просто список ссылок' },
  { name: 'SearchBox', side: 'client', weight: 2.6, note: 'onChange + фильтрация на клиенте' },
]

export default function ServerClientSplit() {
  const [parts, setParts] = useState(INITIAL)

  const toggle = (name: string) =>
    setParts((prev) =>
      prev.map((part) => (part.name === name ? { ...part, side: part.side === 'server' ? 'client' : 'server' } : part)),
    )

  const client = parts.filter((part) => part.side === 'client')
  const server = parts.filter((part) => part.side === 'server')
  const clientWeight = client.reduce((sum, part) => sum + part.weight, 0)

  return (
    <div className="stack">
      <div className="grid-2">
        <div className="panel stack">
          <b>🖥 Сервер отдаёт HTML</b>
          {server.map((part) => (
            <div key={part.name} className="row" style={{ justifyContent: 'space-between' }}>
              <code>{part.name}</code>
              <span className="muted">0 КБ JS</span>
            </div>
          ))}
          {server.length === 0 ? <span className="muted">пусто</span> : null}
        </div>

        <div className="panel stack">
          <b>📦 В браузер уезжает JS</b>
          {client.map((part) => (
            <div key={part.name} className="row" style={{ justifyContent: 'space-between' }}>
              <code>{part.name}</code>
              <span className="badge">{part.weight} КБ</span>
            </div>
          ))}
          {client.length === 0 ? <span className="muted">пусто — весь код на сервере</span> : null}
        </div>
      </div>

      <div className="panel stack">
        {parts.map((part) => (
          <div key={part.name} className="row" style={{ justifyContent: 'space-between' }}>
            <span className="row">
              <code>{part.name}</code>
              <span className="muted">{part.note}</span>
            </span>
            <button type="button" className="btn btn--sm btn--ghost" onClick={() => toggle(part.name)}>
              → {part.side === 'server' ? 'сделать клиентским' : 'сделать серверным'}
            </button>
          </div>
        ))}
      </div>

      <div className={`panel ${clientWeight > 6 ? 'panel--bad' : 'panel--good'}`}>
        <b>Клиентский бандл: {clientWeight.toFixed(1)} КБ</b>
        <div className="muted">
          Переключайте компоненты: серверный компонент не добавляет ни байта в бандл, но и не может иметь
          хуков. Интерактивность «стоит» байтов.
        </div>
      </div>

      <p className="muted">
        Это концептуальная модель: настоящие Server Components работают только в RSC-совместимом
        окружении (Next.js и т. п.), здесь мы просто показываем границу «сервер/клиент».
      </p>
    </div>
  )
}
