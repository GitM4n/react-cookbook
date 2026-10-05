import { createContext, memo, useContext, useRef, useState } from 'react'

const FlagContext = createContext('blue')

function Sensor({ label, note }: { label: string; note?: string }) {
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="panel row" style={{ justifyContent: 'space-between' }}>
      <b>{label}</b>
      <span className="row">
        <span className="muted">{note}</span>
        <span className="badge">рендеров: {renders.current}</span>
      </span>
    </div>
  )
}

const MemoSensor = memo(Sensor)

function ContextSensor() {
  const flag = useContext(FlagContext)
  return <Sensor label="Потребитель контекста (внутри React.memo)" note={`flag = ${flag}`} />
}

const MemoContextSensor = memo(ContextSensor)

export default function WhyRerenderDemo() {
  const [tick, setTick] = useState(0)
  const [flag, setFlag] = useState('blue')
  const [shared, setShared] = useState({ page: 1 })
  const stableObject = useRef({ page: 1 }).current
  const [keySeed, setKeySeed] = useState(0)

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={() => setTick((value) => value + 1)}>
          1. состояние родителя
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => setFlag((value) => (value === 'blue' ? 'orange' : 'blue'))}
        >
          2. изменить контекст
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setShared({ page: shared.page + 1 })}>
          3. новый объект в пропсах
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setShared(stableObject)}>
          4. та же ссылка в пропсах
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setKeySeed((value) => value + 1)}>
          5. сменить key
        </button>
      </div>

      <div className="panel stack">
        <div className="row" style={{ justifyContent: 'space-between' }}>
          <b>Родитель</b>
          <span className="badge">tick = {tick} · shared.page = {shared.page} · flag = {flag}</span>
        </div>

        <Sensor label="Обычный ребёнок (без memo)" note="перерисовывается при каждом рендере родителя" />
        <MemoSensor label="React.memo, примитивные пропсы" note={`tick = ${tick}`} />
        <MemoSensor label="React.memo, объект в пропсах" note={`payload.page = ${shared.page}`} />
        <MemoContextSensor key={keySeed} />
      </div>

      <p className="muted">
        <b>1</b> — состояние родителя: перерисовывается обычный ребёнок, memo-дети пропускают.{' '}
        <b>2</b> — значение контекста: перерисовывается только потребитель, и <code>memo</code> ему не
        помогает — React сравнивает значение контекста отдельно от пропсов. <b>3</b> — новая ссылка на
        объект ломает memo-кэш. <b>4</b> — та же ссылка: кэш срабатывает. <b>5</b> — смена <code>key</code>{' '}
        пересоздаёт компонент, счётчик обнуляется.
      </p>
    </div>
  )
}
