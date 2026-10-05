import { useCallback, useMemo, useRef, useState } from 'react'

function verdict(same: boolean) {
  return same ? (
    <span className="badge badge--good">true</span>
  ) : (
    <span className="badge badge--bad">false</span>
  )
}

export default function ReferentialDemo() {
  const [tick, setTick] = useState(0)
  const [, setForced] = useState(0)
  const renders = useRef(0)
  renders.current += 1

  const inlineObject = { tick }
  const memoObject = useMemo(() => ({ tick }), [tick])
  const inlineFunction = () => tick
  const memoFunction = useCallback(() => tick, [tick])

  const arrayA = [tick, 1]
  const arrayB = [tick, 1]

  const rows: { name: string; left: string; right: string; same: boolean }[] = [
    { name: 'объект-литерал дважды', left: '{ tick } === { tick }', right: 'Object.is', same: Object.is(inlineObject, { tick }) },
    { name: 'useMemo против нового литерала', left: 'memoObject === inlineObject', right: 'Object.is', same: Object.is(memoObject, inlineObject) },
    { name: 'стрелка в JSX против useCallback', left: 'inlineFunction === memoFunction', right: 'Object.is', same: Object.is(inlineFunction, memoFunction) },
    { name: 'массивы с одинаковыми элементами', left: 'arrayA === arrayB', right: 'Object.is', same: Object.is(arrayA, arrayB) },
    { name: 'одно и то же примитивное значение', left: 'tick === tick', right: 'Object.is', same: Object.is(tick, tick) },
    { name: 'спецслучай: NaN с самим собой', left: 'Object.is(NaN, NaN)', right: 'Object.is', same: Object.is(NaN, NaN) },
    { name: 'спецслучай: 0 и −0', left: 'Object.is(0, -0)', right: 'Object.is', same: Object.is(0, -0) },
  ]

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={() => setTick((value) => value + 1)}>
          изменить tick: {tick}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setForced((value) => value + 1)}>
          перерисовать без изменений
        </button>
        <span className="render-count">
          Рендеров: <b>#{renders.current}</b>
        </span>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Что сравниваем</th>
            <th>Выражение</th>
            <th>Результат</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>
                <code>{row.left}</code>
              </td>
              <td>{verdict(row.same)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="panel">
        <div className="muted">Что это значит на практике</div>
        <code>React.memo</code>, массивы зависимостей и сравнение значений контекста используют{' '}
        <code>Object.is</code>. Два литерала <code>{'{ tick }'}</code> — это <b>разные</b> объекты, даже если
        содержимое идентично, а <code>NaN</code> равен <code>NaN</code>, и <code>0</code> — не равно{' '}
        <code>-0</code>. «Перерисовать без изменений» не меняет ни одной ссылки — таблица остаётся прежней.
      </div>
    </div>
  )
}
