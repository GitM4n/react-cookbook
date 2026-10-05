import { useEffect, useRef, useState } from 'react'

function MirrorViaEffect({ value }: { value: string }) {
  const [mirror, setMirror] = useState(value)
  const renders = useRef(0)
  renders.current += 1

  useEffect(() => {
    setMirror(value)
  }, [value])

  const stale = mirror !== value

  return (
    <div className={`panel ${stale ? 'panel--bad' : ''}`}>
      <b>Зеркало через useEffect</b>
      <div>
        пропс: <code>{value}</code> · состояние: <code>{mirror}</code>
      </div>
      <span className="muted">
        рендеров: {renders.current}
        {stale ? ' — состояние ещё отстаёт от пропса' : ''}
      </span>
    </div>
  )
}

function DerivedValue({ value }: { value: string }) {
  const renders = useRef(0)
  renders.current += 1

  return (
    <div className="panel panel--good">
      <b>Производное значение</b>
      <div>
        пропс: <code>{value}</code> (второго источника нет)
      </div>
      <span className="muted">рендеров: {renders.current}</span>
    </div>
  )
}

export function SyncViaEffect() {
  const [value, setValue] = useState('запрос #1')

  return (
    <div className="stack">
      <button type="button" className="btn btn--ghost" onClick={() => setValue((prev) => prev + ' → #')}>
        изменить вход
      </button>
      <MirrorViaEffect value={value} />
      <span className="muted">
        На каждый вход — два рендера: сначала со старым зеркалом, потом после эффекта. Между ними UI
        показывает рассогласованные данные.
      </span>
    </div>
  )
}

export function SyncDerived() {
  const [value, setValue] = useState('запрос #1')

  return (
    <div className="stack">
      <button type="button" className="btn btn--ghost" onClick={() => setValue((prev) => prev + ' → #')}>
        изменить вход
      </button>
      <DerivedValue value={value} />
      <span className="muted">
        Один вход — один рендер, рассинхрон невозможен физически: значение просто вычисляется заново.
      </span>
    </div>
  )
}
