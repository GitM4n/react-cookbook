import { memo, useRef, useState } from 'react'

function Leaf({ label, marker }: { label: string; marker?: number }) {
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="panel">
      <b>{label}</b>
      <div className="muted">
        рендеров: {renders.current}
        {marker !== undefined ? ` · marker = ${marker}` : ''}
      </div>
    </div>
  )
}

const MemoLeaf = memo(Leaf)

function Parent({ rootTick }: { rootTick: number }) {
  const [local, setLocal] = useState(0)
  const renders = useRef(0)
  renders.current += 1

  return (
    <div className="panel stack" style={{ marginLeft: 20 }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <b>Parent (своё состояние)</b>
        <span className="badge">рендеров: {renders.current}</span>
      </div>
      <div className="row">
        <button type="button" className="btn btn--sm btn--ghost" onClick={() => setLocal((value) => value + 1)}>
          состояние в Parent: {local}
        </button>
        <span className="muted">rootTick = {rootTick}</span>
      </div>
      <Leaf label="Leaf (обычный)" marker={local} />
      <MemoLeaf label="Leaf (React.memo)" marker={rootTick} />
    </div>
  )
}

export default function RerenderTree() {
  const [rootTick, setRootTick] = useState(0)
  const renders = useRef(0)
  renders.current += 1

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={() => setRootTick((value) => value + 1)}>
          Обновить состояние Root
        </button>
        <span className="badge">рендеров Root: {renders.current}</span>
      </div>

      <Parent rootTick={rootTick} />

      <p className="muted">
        Обновление состояния перерисовывает компонент, где оно лежит, <b>и всё его поддерево</b>. Обычный
        Leaf перерисовывается вместе с Parent, а <code>MemoLeaf</code> пропускает рендер — его пропсы
        не изменились. Сам по себе рендер дёшев: это вызов функции и сравнение, реальный DOM трогается
        только если изменилось описание.
      </p>
    </div>
  )
}
