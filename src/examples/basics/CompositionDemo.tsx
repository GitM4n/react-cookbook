import { useState } from 'react'
import type { ReactNode } from 'react'

interface CardProps {
  title: string
  actions?: ReactNode
  children?: ReactNode
}

function Card({ title, actions, children }: CardProps) {
  return (
    <div className="panel stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <b>{title}</b>
        {actions ? <div className="row">{actions}</div> : null}
      </div>
      <div className="muted">{children}</div>
    </div>
  )
}

function Page({ children }: { children?: ReactNode }) {
  return <div className="stack">{children}</div>
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel">
      <div className="muted">{label}</div>
      <b style={{ fontSize: 24 }}>{value}</b>
    </div>
  )
}

export default function CompositionDemo() {
  const [mode, setMode] = useState<'children' | 'slots'>('children')
  const [views, setViews] = useState(42)

  return (
    <div className="stack">
      <div className="row">
        <button
          type="button"
          className={`chip${mode === 'children' ? ' chip--active' : ''}`}
          onClick={() => setMode('children')}
        >
          children
        </button>
        <button
          type="button"
          className={`chip${mode === 'slots' ? ' chip--active' : ''}`}
          onClick={() => setMode('slots')}
        >
          пропсы-слоты
        </button>
        <button type="button" className="btn btn--sm btn--ghost" onClick={() => setViews((v) => v + 1)}>
          Плюс просмотр
        </button>
      </div>

      {mode === 'children' ? (
        <Card
          title="Карточка через children"
          actions={
            <button type="button" className="btn btn--sm btn--primary" onClick={() => setViews((v) => v + 1)}>
              Ещё раз
            </button>
          }
        >
          Контент вложенный в тег компонента попадает в пропс <code>children</code> автоматически.
        </Card>
      ) : (
        <Card
          title="Карточка через слоты"
          actions={
            <button type="button" className="btn btn--sm btn--primary" onClick={() => setViews((v) => v + 1)}>
              Ещё раз
            </button>
          }
        >
          Тот же UI, но заголовок, кнопка и текст передаются отдельными именованными пропсами.
        </Card>
      )}

      <Page>
        <div className="row" style={{ alignItems: 'stretch' }}>
          <Stat label="Просмотры" value={views} />
          <Stat label="Секции" value={3} />
          <Stat label="Уровни вложенности" value={2} />
        </div>
        <Card title="Композиция важнее наследования">
          React не умеет наследовать компоненты — вместо этого готовые куски UI собирают друг в друга через
          <code>children</code> и именованные слоты.
        </Card>
      </Page>
    </div>
  )
}
