import { useState } from 'react'
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import Counter from './Counter'

interface TestResult {
  name: string
  passed: boolean
  detail?: string
}

type ActEnvironment = { IS_REACT_ACT_ENVIRONMENT?: boolean }

function clickByText(container: HTMLElement, text: string): boolean {
  const button = Array.from(container.querySelectorAll('button')).find(
    (element) => element.textContent === text,
  )
  if (!button) return false
  button.click()
  return true
}

function runTests(container: HTMLElement): TestResult[] {
  const results: TestResult[] = []
  const check = (name: string, passed: boolean, detail?: string) => results.push({ name, passed, detail })

  const root: Root = createRoot(container)
  // Флаг «мы в тестовой среде» включаем только на время прогонов,
  // иначе React начнёт требовать act() для обычных кликов в приложении.
  const globals = globalThis as ActEnvironment
  const previousEnvironment = globals.IS_REACT_ACT_ENVIRONMENT
  globals.IS_REACT_ACT_ENVIRONMENT = true

  try {
    act(() => {
      root.render(<Counter initial={3} />)
    })
    check('рендер: показано начальное значение', container.textContent?.includes('Значение: 3') ?? false)

    act(() => {
      clickByText(container, 'Увеличить')
      clickByText(container, 'Увеличить')
    })
    check('два клика: 3 → 5', container.textContent?.includes('Значение: 5') ?? false)

    act(() => {
      clickByText(container, 'Сбросить')
    })
    check('сброс возвращает начальные 3', container.textContent?.includes('Значение: 3') ?? false)

    check('бейдж порога не показан при значениях ≤ 5', !container.textContent?.includes('перешёл порог'))

    act(() => {
      for (let i = 0; i < 4; i += 1) clickByText(container, 'Увеличить')
    })
    check('после 4 кликов значение становится > 5 — бейдж появляется',
      container.textContent?.includes('перешёл порог') ?? false,
    )
  } catch (error) {
    results.push({
      name: 'тест упал с исключением',
      passed: false,
      detail: error instanceof Error ? error.message : String(error),
    })
  } finally {
    act(() => root.unmount())
    globals.IS_REACT_ACT_ENVIRONMENT = previousEnvironment
  }

  return results
}

export default function TestingDemo() {
  const [results, setResults] = useState<TestResult[] | null>(null)
  const [duration, setDuration] = useState(0)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  const run = () => {
    if (!container) return
    const started = performance.now()
    setResults(runTests(container))
    setDuration(Math.round(performance.now() - started))
  }

  const passed = results?.filter((result) => result.passed).length ?? 0

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={run} disabled={!container}>
          ▶ Запустить тесты в браузере
        </button>
        {results ? (
          <span className={`badge ${passed === results.length ? 'badge--good' : 'badge--bad'}`}>
            {passed} / {results.length} прошли · {duration} мс
          </span>
        ) : (
          <span className="muted">Тесты отрендерят Counter в изолированный контейнер и проверят DOM</span>
        )}
      </div>

      <div ref={setContainer} style={{ display: 'none' }} aria-hidden />

      {results ? (
        <div className="panel stack">
          {results.map((result, index) => (
            <div key={index} className="row" style={{ justifyContent: 'space-between' }}>
              <span>
                {result.passed ? '✅' : '❌'} {result.name}
              </span>
              {result.detail ? <code>{result.detail}</code> : null}
            </div>
          ))}
        </div>
      ) : null}

      <p className="muted">
        Это тот же принцип, что у Testing Library: монтируем компонент, дёргаем события через{' '}
        <code>act</code>, проверяем DOM. Только раннер живёт прямо в браузере, а настоящие тесты из файла{' '}
        <code>Counter.test.tsx</code> запускаются командой <code>npm test</code> на Node + jsdom.
      </p>
    </div>
  )
}
