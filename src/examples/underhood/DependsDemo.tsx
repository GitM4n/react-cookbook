import { useEffect, useRef, useState } from 'react'
import { LogView, useLog } from '../../lib/demo-kit'

export default function DependsDemo() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [tick, setTick] = useState(0)
  const { entries, push, clear } = useLog(8)

  const noDepsRuns = useRef(0)
  const renders = useRef(0)
  renders.current += 1

  useEffect(() => {
    push('[]: монтаж (и cleanup перед размонтированием)')
    return () => push('[]: cleanup')
  }, [push])

  useEffect(() => {
    push(`[a]: запуск, a = ${a}`)
    return () => push(`[a]: cleanup, a = ${a}`)
  }, [a, push])

  // Без массива зависимостей: выполняется после каждого рендера.
  useEffect(() => {
    noDepsRuns.current += 1
  })

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={() => setA((value) => value + 1)}>
          изменить a: {a}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setB((value) => value + 1)}>
          изменить b: {b}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setTick((value) => value + 1)}>
          изменить tick: {tick}
        </button>
        <button type="button" className="btn btn--sm btn--ghost" onClick={clear}>
          очистить
        </button>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="muted">Эффект с <code>[]</code></div>
          Запустился один раз при монтировании. Нажмите «↺ Сбросить» в шапке — увидите cleanup.
        </div>
        <div className="panel">
          <div className="muted">Эффект с <code>[a]</code></div>
          Перезапускается только при изменении <code>a</code>: cleanup → запуск.
        </div>
        <div className="panel panel--bad">
          <div className="muted">Эффект <b>без массива</b></div>
          Рендеров: <b>{renders.current}</b>, выполнений эффекта: <b>{noDepsRuns.current}</b> — цифра
          всегда на единицу меньше: эффект бежит <b>после</b> того, как результат рендера уже показан.
        </div>
        <div className="panel">
          <div className="muted">Правило</div>
          Зависимости сравниваются по значению ({'<>'} — это <code>Object.is</code>): числа и строки —
          надёжно, объекты и функции — нет.
        </div>
      </div>

      <LogView entries={entries} empty="Нажимайте кнопки и следите за парами cleanup/запуск" />

      <p className="muted">
        Порядок всегда один: <b>сначала cleanup предыдущего запуска, потом новый запуск</b>. Поэтому
        подписки не накапливаются, а таймеры не дублируются.
      </p>
    </div>
  )
}
