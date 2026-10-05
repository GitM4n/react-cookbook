import { useSyncExternalStore, useState } from 'react'
import { RenderCount } from '../../lib/demo-kit'

interface AppState {
  count: number
  label: string
}

function createStore(initial: AppState) {
  let state = initial
  const listeners = new Set<() => void>()

  return {
    get: () => state,
    set: (updater: Partial<AppState>) => {
      state = { ...state, ...updater }
      listeners.forEach((listener) => listener())
    },
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
  }
}

const store = createStore({ count: 0, label: 'ноль' })

function useStore<S>(selector: (state: AppState) => S): S {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(store.get()),
  )
}

function CountView() {
  const count = useStore((state) => state.count)
  return (
    <div className="panel stack">
      <span className="muted">Читает только count</span>
      <b style={{ fontSize: 26 }}>{count}</b>
      <RenderCount label="Рендеров" />
    </div>
  )
}

function LabelView() {
  const label = useStore((state) => state.label)
  return (
    <div className="panel stack">
      <span className="muted">Читает только label</span>
      <b style={{ fontSize: 26 }}>{label}</b>
      <RenderCount label="Рендеров" />
    </div>
  )
}

export default function MiniStore() {
  const count = useStore((state) => state.count)
  const [viaContext, setViaContext] = useState(0)

  return (
    <div className="stack">
      <div className="grid-2">
        <CountView />
        <LabelView />
      </div>

      <div className="row">
        <button type="button" className="btn btn--primary" onClick={() => store.set({ count: count + 1 })}>
          Изменить count
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => store.set({ label: `метка ${store.get().count}` })}
        >
          Изменить label
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setViaContext((v) => v + 1)}>
          Свойство «контекстного» компонента: {viaContext}
        </button>
      </div>

      <div className="panel">
        <div className="muted">Правило подписки</div>
        Селектор возвращает <b>примитив</b> — и <code>useSyncExternalStore</code> перерисовывает компонент
        только при изменении своего куска. Нажмите «Изменить count»: счётчик слева обновился, а справа — нет.
        Селектор, возвращающий новый объект каждый вызов, заставит React перерисовывать компонент постоянно:
        он сравнивает значения через <code>Object.is</code>.
      </div>

      <p className="muted">
        Это тот же механизм, на котором работают Zustand, Jotai и Redux: состояние живёт снаружи React, а
        компоненты подписываются на нужные куски.
      </p>
    </div>
  )
}
