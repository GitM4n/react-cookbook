import { useState } from 'react'
import { createPortal } from 'react-dom'
import { LogView, useLog } from '../../lib/demo-kit'

export default function PortalsDemo() {
  const [open, setOpen] = useState(false)
  const [toasts, setToasts] = useState<number[]>([])
  const { entries, push, clear } = useLog()

  const addToast = () => {
    const id = Date.now()
    setToasts((prev) => [...prev, id])
    window.setTimeout(() => setToasts((prev) => prev.filter((item) => item !== id)), 2600)
  }

  return (
    <div
      className="stack"
      onClick={() => push('клик внутри #root → всплыл к родителю по React-дереву')}
    >
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={() => setOpen(true)}>
          Открыть модалку
        </button>
        <button type="button" className="btn btn--ghost" onClick={addToast}>
          Показать тост
        </button>
        <button type="button" className="btn btn--ghost" onClick={clear}>
          Очистить журнал
        </button>
      </div>

      <div className="panel">
        <div className="muted">Куда попадает DOM</div>
        <code>{'#root > div.stack (демо)   |   body > div.modal-root / div.toast-box (порталы)'}</code>
        <div className="muted">
          Модалка и тосты физически лежат в <code>document.body</code> (чтобы их не перекрывали
          <code> overflow: hidden</code> и <code>z-index</code> родителей), но остаются частью React-дерева.
        </div>
      </div>

      <LogView entries={entries} empty="Кликните куда-нибудь" />

      <p className="muted">
        Клик в модалке обрабатывается обработчиком этого блока: событие всплывает по <b>React</b>-дереву, а не
        по DOM. Это удобно (контекст и колбэки работают) и неожиданно (stopPropagation нужно ставить в
        модалке).
      </p>

      {open
        ? createPortal(
            <div className="modal-overlay" onClick={() => setOpen(false)}>
              <div
                className="modal"
                role="dialog"
                aria-modal="true"
                onClick={(event) => event.stopPropagation()}
              >
                <h4 style={{ margin: '0 0 8px' }}>Модалка через createPortal</h4>
                <p className="muted" style={{ margin: 0 }}>
                  Она отрендерена в <code>document.body</code>, но контекст и всплытие событий сохраняются:
                  родительские обработчики и провайдеры продолжают работать.
                </p>
                <div className="row" style={{ marginTop: 14 }}>
                  <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => {
                      push('кнопка внутри модалки сработала — React-дерево цело')
                      setOpen(false)
                    }}
                  >
                    Понятно, закрыть
                  </button>
                  <button type="button" className="btn btn--ghost" onClick={() => setOpen(false)}>
                    Закрыть крестиком
                  </button>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}

      {toasts.length > 0
        ? createPortal(
            <div className="toast-box">
              {toasts.map((id) => (
                <div key={id} className="toast">
                  Тост {String(id).slice(-4)} — всплывает поверх любого слоя
                </div>
              ))}
            </div>,
            document.body,
          )
        : null}
    </div>
  )
}
