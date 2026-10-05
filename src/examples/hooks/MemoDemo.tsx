import { memo, useCallback, useMemo, useRef, useState } from 'react'

function fib(n: number): number {
  return n <= 1 ? n : fib(n - 1) + fib(n - 2)
}

interface Stats {
  runs: number
  ms: number
}

function PlainCalc({ n }: { n: number }) {
  const stats = useRef<Stats>({ runs: 0, ms: 0 })
  const start = performance.now()
  const value = fib(n)
  stats.current = { runs: stats.current.runs + 1, ms: performance.now() - start }

  return (
    <div className="panel">
      <div className="muted">Без useMemo — считаем при каждом рендере</div>
      <b>fib({n}) = {value}</b>
      <div className="muted">
        пересчётов: {stats.current.runs}, последний расчёт: {stats.current.ms.toFixed(2)} мс
      </div>
    </div>
  )
}

function MemoCalc({ n }: { n: number }) {
  const stats = useRef<Stats>({ runs: 0, ms: 0 })
  const value = useMemo(() => {
    const start = performance.now()
    const result = fib(n)
    stats.current = { runs: stats.current.runs + 1, ms: performance.now() - start }
    return result
  }, [n])

  return (
    <div className="panel panel--good">
      <div className="muted">С useMemo — пересчёт только при изменении n</div>
      <b>fib({n}) = {value}</b>
      <div className="muted">
        пересчётов: {stats.current.runs}, последний расчёт: {stats.current.ms.toFixed(2)} мс
      </div>
    </div>
  )
}

const ExpensiveChild = memo(function ExpensiveChild({
  value,
  onInc,
}: {
  value: number
  onInc: () => void
}) {
  const renders = useRef(0)
  renders.current += 1
  return (
    <div className="panel">
      <div className="muted">React.memo-ребёнок</div>
      <b>renders = {renders.current}</b>
      <div className="row">
        <span>value = {value}</span>
        <button type="button" className="btn btn--sm btn--ghost" onClick={onInc}>
          +1 изнутри
        </button>
      </div>
    </div>
  )
})

export default function MemoDemo() {
  const [n, setN] = useState(30)
  const [tick, setTick] = useState(0)
  const [useStableCallback, setUseStableCallback] = useState(true)

  const stableInc = useCallback(() => setN((value) => value + 1), [])
  const inlineInc = () => setN((value) => value + 1)

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={() => setTick((t) => t + 1)}>
          Перерисовать родителя (тик #{tick})
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setN((value) => value + 1)}>
          n + 1 → fib пересчитается
        </button>
        <span className="muted">n = {n}</span>
      </div>

      <div className="grid-2">
        <PlainCalc n={n} />
        <MemoCalc n={n} />
      </div>

      <div className="row">
        <button
          type="button"
          className={`chip${useStableCallback ? ' chip--active' : ''}`}
          onClick={() => setUseStableCallback(true)}
        >
          onInc = useCallback ✅
        </button>
        <button
          type="button"
          className={`chip${!useStableCallback ? ' chip--active' : ''}`}
          onClick={() => setUseStableCallback(false)}
        >
          onInc = стрелка в JSX ❌
        </button>
      </div>

      <div className="grid-2">
        <ExpensiveChild value={n} onInc={useStableCallback ? stableInc : inlineInc} />
        <div className="panel">
          <div className="muted">Родительское состояние (n, tick)</div>
          <b>
            n = {n}, tick = {tick}
          </b>
          <div className="muted">Кликайте «Перерисовать родителя» и следите за счётчиком слева.</div>
        </div>
      </div>

      <p className="muted">
        <code>useMemo</code> кэширует <b>значение</b>, <code>useCallback</code> — <b>ссылку на функцию</b>. Оба
        возвращают новое значение только тогда, когда изменились зависимости.
      </p>
    </div>
  )
}
