import { useCallback, useEffect, useRef, useState } from 'react'
import { LogView, useLog } from '../../lib/demo-kit'

function Child({ seed, log }: { seed: number; log: (message: string) => void }) {
  const renders = useRef(0)
  renders.current += 1
  const prevSeed = useRef(seed)

  useEffect(() => {
    log('child: mount (эффекты после первого рендера)')
    return () => log('child: unmount (cleanup)')
  }, [log])

  useEffect(() => {
    if (prevSeed.current !== seed) {
      log(`child: update, seed ${prevSeed.current} → ${seed}`)
      prevSeed.current = seed
    }
  }, [seed, log])

  return (
    <div className="panel">
      <b>Child</b>
      <div className="muted">
        seed = {seed}, рендеров: {renders.current}
      </div>
    </div>
  )
}

export default function LifecycleDemo() {
  const [mounted, setMounted] = useState(true)
  const [seed, setSeed] = useState(1)
  const { entries, push, clear } = useLog(10)
  const log = useCallback((message: string) => push(message), [push])

  useEffect(() => {
    log('parent: mount')
    return () => log('parent: unmount (cleanup)')
  }, [log])

  useEffect(() => {
    log(`parent: эффект от seed = ${seed}`)
  }, [seed, log])

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={() => setSeed((value) => value + 1)}>
          Сменить seed
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setMounted((value) => !value)}>
          {mounted ? 'Размонтировать' : 'Монтировать'} Child
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setSeed(1)}>
          seed = 1
        </button>
        <button type="button" className="btn btn--ghost" onClick={clear}>
          Очистить
        </button>
      </div>

      <div className="stack">
        <div className="panel">
          <b>Parent</b>
          <div className="muted">seed = {seed}</div>
        </div>
        {mounted ? <Child seed={seed} log={log} /> : <div className="panel muted">Child размонтирован</div>}
      </div>

      <LogView entries={entries} empty="Жмите кнопки и следите за порядком" />

      <p className="muted">
        Сначала React отрисовывает DOM, <b>потом</b> запускает эффекты: сначала у ребёнка, затем у родителя.
        При размонтировании cleanup выполняется в том же порядке. Эффект «update» срабатывает и при монтировании
        — поэтому в нём есть проверка <code>prevSeed.current !== seed</code>.
      </p>
    </div>
  )
}
