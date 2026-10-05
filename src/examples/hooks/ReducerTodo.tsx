import { useReducer, useState } from 'react'
import { LogView, useLog } from '../../lib/demo-kit'

interface Todo {
  id: number
  text: string
  done: boolean
}

type Filter = 'all' | 'active' | 'done'

interface State {
  todos: Todo[]
  filter: Filter
  past: Array<{ todos: Todo[]; filter: Filter }>
}

type Action =
  | { type: 'add'; text: string }
  | { type: 'toggle'; id: number }
  | { type: 'remove'; id: number }
  | { type: 'setFilter'; filter: Filter }
  | { type: 'undo' }

function snapshot(state: State) {
  return { todos: state.todos, filter: state.filter }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'add': {
      const text = action.text.trim()
      if (!text) return state
      return {
        ...state,
        past: [...state.past, snapshot(state)],
        todos: [...state.todos, { id: Date.now() + Math.floor(Math.random() * 1000), text, done: false }],
      }
    }
    case 'toggle':
      return {
        ...state,
        past: [...state.past, snapshot(state)],
        todos: state.todos.map((todo) => (todo.id === action.id ? { ...todo, done: !todo.done } : todo)),
      }
    case 'remove':
      return {
        ...state,
        past: [...state.past, snapshot(state)],
        todos: state.todos.filter((todo) => todo.id !== action.id),
      }
    case 'setFilter':
      return { ...state, filter: action.filter }
    case 'undo': {
      const prev = state.past[state.past.length - 1]
      if (!prev) return state
      return { ...prev, past: state.past.slice(0, -1) }
    }
    default:
      return state
  }
}

const initialState: State = {
  todos: [
    { id: 1, text: 'Прочитать про useReducer', done: false },
    { id: 2, text: 'Собрать список действий', done: true },
  ],
  filter: 'all',
  past: [],
}

export default function ReducerTodo() {
  const [state, dispatch] = useReducer(reducer, initialState)
  const [text, setText] = useState('')
  const { entries, push, clear } = useLog()

  const run = (action: Action) => {
    push(`dispatch({ type: '${action.type}' })`)
    dispatch(action)
  }

  const visible = state.todos.filter((todo) =>
    state.filter === 'all' ? true : state.filter === 'active' ? !todo.done : todo.done,
  )

  return (
    <div className="stack">
      <form
        className="row"
        onSubmit={(event) => {
          event.preventDefault()
          run({ type: 'add', text })
          setText('')
        }}
      >
        <input
          className="input"
          style={{ maxWidth: 300 }}
          value={text}
          placeholder="Что нужно сделать?"
          aria-label="Новая задача"
          onChange={(e) => setText(e.target.value)}
        />
        <button type="submit" className="btn btn--primary">
          Добавить
        </button>
        <button
          type="button"
          className="btn btn--ghost"
          disabled={state.past.length === 0}
          onClick={() => run({ type: 'undo' })}
        >
          ↶ Отменить ({state.past.length})
        </button>
      </form>

      <div className="row">
        {(['all', 'active', 'done'] as Filter[]).map((filter) => (
          <button
            key={filter}
            type="button"
            className={`chip${state.filter === filter ? ' chip--active' : ''}`}
            onClick={() => run({ type: 'setFilter', filter })}
          >
            {filter} ({state.todos.filter((t) => (filter === 'all' ? true : filter === 'active' ? !t.done : t.done)).length})
          </button>
        ))}
        <button type="button" className="btn btn--sm btn--ghost" onClick={clear}>
          Очистить журнал
        </button>
      </div>

      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {visible.map((todo) => (
          <li key={todo.id} className="panel row" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
            <label className="row" style={{ cursor: 'pointer' }}>
              <input type="checkbox" checked={todo.done} onChange={() => run({ type: 'toggle', id: todo.id })} />
              <span style={{ textDecoration: todo.done ? 'line-through' : 'none' }}>{todo.text}</span>
            </label>
            <button type="button" className="btn btn--sm btn--ghost" onClick={() => run({ type: 'remove', id: todo.id })}>
              удалить
            </button>
          </li>
        ))}
        {visible.length === 0 ? <li className="muted">Задач нет</li> : null}
      </ul>

      <LogView entries={entries} empty="Совершите действие — dispatch попадёт в журнал" />

      <p className="muted">
        Вся логика изменения данных — в чистой функции <code>reducer</code>: она получает состояние и действие
        и возвращает новое состояние. Компонент лишь отправляет <code>dispatch</code> и рисует результат.
      </p>
    </div>
  )
}
