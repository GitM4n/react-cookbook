import { useRef, useState } from 'react'
import { LogView, useLog } from '../../lib/demo-kit'

type Scenario = 'click' | 'timeout' | 'promise' | 'native'

const LABELS: Record<Scenario, string> = {
  click: 'в обработчике клика',
  timeout: 'в setTimeout',
  promise: 'в промисе (async/await)',
  native: 'в нативном DOM-слушателе',
}

export default function BatchingDemo() {
  const [a, setA] = useState(0)
  const [b, setB] = useState(0)
  const [c, setC] = useState(0)
  const renders = useRef(0)
  renders.current += 1

  const { entries, push, clear } = useLog(10)

  const run = (scenario: Scenario) => {
    const before = renders.current
    const triple = () => {
      setA((value) => value + 1)
      setB((value) => value + 1)
      setC((value) => value + 1)
    }

    if (scenario === 'click') triple()
    if (scenario === 'timeout') window.setTimeout(triple, 100)
    if (scenario === 'promise') void Promise.resolve().then(triple)
    if (scenario === 'native') {
      const node = document.createElement('div')
      const listener = () => {
        triple()
        node.removeEventListener('probe', listener)
      }
      node.addEventListener('probe', listener)
      node.dispatchEvent(new Event('probe'))
    }

    window.setTimeout(() => {
      push(`${LABELS[scenario]}: 3 вызова setState → рендеров: ${renders.current - before}`)
    }, 160)
  }

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={() => run('click')}>
          Обработчик клика
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => run('timeout')}>
          setTimeout
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => run('promise')}>
          промис
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => run('native')}>
          нативный слушатель
        </button>
        <button type="button" className="btn btn--sm btn--ghost" onClick={clear}>
          очистить
        </button>
      </div>

      <div className="grid-2">
        <div className="panel">
          <div className="muted">Значения состояний</div>
          <b>
            a = {a}, b = {b}, c = {c}
          </b>
        </div>
        <div className="panel">
          <div className="muted">Рендеров компонента всего</div>
          <b style={{ fontSize: 24 }}>{renders.current}</b>
        </div>
      </div>

      <LogView entries={entries} empty="Нажмите любую кнопку и посмотрите число рендеров" />

      <p className="muted">
        В каждом сценарии вызвано <b>три</b> сеттера, а рендер — <b>один</b>: React 18+ объединяет
        (батчит) обновления независимо от места вызова. В React 17 картина была бы другой: в таймере и
        промисе получили бы три рендера. Последнее обновление каждого кадра React называет
        «упакованным» (batched).
      </p>
    </div>
  )
}
