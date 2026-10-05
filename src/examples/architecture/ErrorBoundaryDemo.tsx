import { Component, useState } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

interface BoundaryProps {
  children: ReactNode
  resetKey?: unknown
  fallback: (error: Error, reset: () => void) => ReactNode
}

interface BoundaryState {
  error: Error | null
  errorKey: unknown
}

export class ErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { error: null, errorKey: undefined }

  static getDerivedStateFromError(error: Error): Partial<BoundaryState> {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error.message, info.componentStack)
    // Запоминаем, с каким resetKey ошибка произошла: иначе смена ключа
    // сразу же «лечила» бы границу и ошибка не успевала бы показаться.
    this.setState({ error, errorKey: this.props.resetKey })
  }

  componentDidUpdate(prev: BoundaryProps) {
    if (
      this.state.error &&
      prev.resetKey !== this.props.resetKey &&
      this.state.errorKey !== this.props.resetKey
    ) {
      this.setState({ error: null, errorKey: undefined })
    }
  }

  render() {
    if (this.state.error) {
      return this.props.fallback(this.state.error, () =>
        this.setState({ error: null, errorKey: undefined }),
      )
    }
    return this.props.children
  }
}

function Bomb({ armed }: { armed: boolean }) {
  if (armed) throw new Error('Ошибка в рендере: Bomb разминирована')
  return <div className="panel panel--good">Bomb в порядке — рендер прошёл успешно.</div>
}

export default function ErrorBoundaryDemo() {
  const [armed, setArmed] = useState(false)
  const [handlerError, setHandlerError] = useState<string | null>(null)

  return (
    <div className="stack">
      <div className="row">
        <button type="button" className="btn btn--ghost" onClick={() => setArmed(true)}>
          Ошибка в рендере
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => {
            try {
              throw new Error('Ошибка внутри onClick не попадает в ErrorBoundary')
            } catch (error) {
              setHandlerError(error instanceof Error ? error.message : String(error))
            }
          }}
        >
          Ошибка в обработчике
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setHandlerError(null)}>
          Снять сообщение
        </button>
      </div>

      {handlerError ? (
        <div className="panel panel--bad">
          <b>Поймано вручную:</b> {handlerError}. Если бы мы не написали try/catch, приложение упало бы —
          ErrorBoundary такое не ловит.
        </div>
      ) : null}

      <ErrorBoundary
        resetKey={armed}
        fallback={(error, reset) => (
          <div className="panel panel--bad stack">
            <b>ErrorBoundary показывает запасной UI</b>
            <code>{error.message}</code>
            <div className="row">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => {
                  reset()
                  setArmed(false)
                }}
              >
                Сбросить и вернуть детей
              </button>
            </div>
          </div>
        )}
      >
        <Bomb armed={armed} />
      </ErrorBoundary>

      <p className="muted">
        Ошибка в рендере всплывает вверх по дереву до ближайшего ErrorBoundary: React размонтирует упавшее
        поддерево и отрисует запасной UI. Остальное приложение продолжает работать.
      </p>
    </div>
  )
}
