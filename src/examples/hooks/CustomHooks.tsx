import { useCallback, useState } from 'react'

function useCounter(initial: number, step = 1) {
  const [count, setCount] = useState(initial)
  const inc = useCallback(() => setCount((value) => value + step), [step])
  const dec = useCallback(() => setCount((value) => value - step), [step])
  const reset = useCallback(() => setCount(initial), [initial])
  return { count, inc, dec, reset }
}

function useLocalStorage<T>(key: string, initial: T): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  const set = useCallback(
    (next: T) => {
      setValue(next)
      try {
        window.localStorage.setItem(key, JSON.stringify(next))
      } catch {
        /* приватный режим — просто продолжаем без сохранения */
      }
    },
    [key],
  )

  return [value, set]
}

export default function CustomHooksDemo() {
  const counter = useCounter(0, 5)
  const [volume, setVolume] = useLocalStorage('cookbook.volume', 30)
  const [retries, setRetries] = useLocalStorage('cookbook.retries', 2)

  return (
    <div className="stack">
      <div className="panel stack">
        <b>useCounter(initial, step)</b>
        <div className="row">
          <button type="button" className="btn btn--ghost" onClick={counter.dec}>
            −5
          </button>
          <b style={{ fontSize: 24, minWidth: 60, textAlign: 'center' }}>{counter.count}</b>
          <button type="button" className="btn btn--primary" onClick={counter.inc}>
            +5
          </button>
          <button type="button" className="btn btn--ghost" onClick={counter.reset}>
            сброс
          </button>
        </div>
        <span className="muted">
          Хук вернул готовые колбэки: компонент не знает, как именно устроено состояние внутри.
        </span>
      </div>

      <div className="panel stack">
        <b>useLocalStorage(key, initial)</b>
        <div className="grid-2">
          <label className="field">
            <span className="field__label">Громкость: {volume}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
            />
          </label>
          <label className="field">
            <span className="field__label">Повторные попытки: {retries}</span>
            <input
              type="range"
              min={0}
              max={10}
              value={retries}
              onChange={(e) => setRetries(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="row">
          <span className="muted">
            Нажмите «↺ Сбросить» в шапке примера — компонент перемонтируется, а значения останутся: они
            лежат в localStorage.
          </span>
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            onClick={() => {
              setVolume(30)
              setRetries(2)
            }}
          >
            Вернуть по умолчанию
          </button>
        </div>
      </div>

      <p className="muted">
        Оба хука — обычные функции, которые используют <code>useState</code>/<code>useCallback</code>. Их
        можно переиспользовать в любом компоненте и покрывать тестами отдельно.
      </p>
    </div>
  )
}
