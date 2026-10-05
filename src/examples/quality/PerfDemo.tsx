import { memo, useCallback, useRef, useState } from 'react'

const ROW_COUNT = 150

interface RowProps {
  index: number
  selected: boolean
  onSelect: (index: number) => void
  renderRef: { current: number }
}

function Row({ index, selected, onSelect, renderRef }: RowProps) {
  renderRef.current += 1
  return (
    <button
      type="button"
      className={`chip${selected ? ' chip--active' : ''}`}
      onClick={() => onSelect(index)}
    >
      строка {index}
    </button>
  )
}

const MemoRow = memo(Row)

/** Считает после строк: React рендерит детей по порядку, поэтому здесь виден актуальный итог. */
function RowStats({ renderRef }: { renderRef: { current: number } }) {
  return <span className="badge">рендеров строк за всё время: {renderRef.current}</span>
}

export default function PerfDemo() {
  const [selected, setSelected] = useState<number | null>(null)
  const [parentTick, setParentTick] = useState(0)
  const [memoized, setMemoized] = useState(true)
  const [stableCallback, setStableCallback] = useState(true)

  const renderRef = useRef(0)
  const renders = useRef(0)
  renders.current += 1

  const stableSelect = useCallback((index: number) => setSelected(index), [])
  const inlineSelect = (index: number) => setSelected(index)
  const onSelect = stableCallback ? stableSelect : inlineSelect

  const RowComponent = memoized ? MemoRow : Row

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={() => setParentTick((value) => value + 1)}>
          Перерисовать родителя (тик {parentTick})
        </button>
        <span className="badge">рендеров родителя: {renders.current}</span>
      </div>

      <div className="row">
        <button
          type="button"
          className={`chip${memoized ? ' chip--active' : ''}`}
          onClick={() => setMemoized(true)}
        >
          React.memo: вкл ✅
        </button>
        <button
          type="button"
          className={`chip${!memoized ? ' chip--active' : ''}`}
          onClick={() => setMemoized(false)}
        >
          React.memo: выкл ❌
        </button>
        <button
          type="button"
          className={`chip${stableCallback ? ' chip--active' : ''}`}
          onClick={() => setStableCallback(true)}
        >
          колбэк стабильный ✅
        </button>
        <button
          type="button"
          className={`chip${!stableCallback ? ' chip--active' : ''}`}
          onClick={() => setStableCallback(false)}
        >
          колбэк новый каждый рендер ❌
        </button>
      </div>

      <div className="panel" style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 220, overflowY: 'auto' }}>
        {Array.from({ length: ROW_COUNT }, (_, index) => (
          <RowComponent
            key={index}
            index={index}
            selected={selected === index}
            onSelect={onSelect}
            renderRef={renderRef}
          />
        ))}
      </div>

      <RowStats renderRef={renderRef} />

      <p className="muted">
        Включите «React.memo + стабильный колбэк» и жмите «Перерисовать родителя»: счётчик строк почти не
        растёт. Выключите любой из двух — и все 150 строк перерисуются заново. Мемоизация работает только
        вместе со стабильными пропсами.
      </p>
    </div>
  )
}
