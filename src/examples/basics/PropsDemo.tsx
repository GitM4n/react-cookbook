import { useState } from 'react'

type Role = 'admin' | 'user' | 'guest'

interface UserBadgeProps {
  name: string
  role: Role
  online?: boolean
  onToggleOnline?: () => void
}

function UserBadge({ name, role, online = false, onToggleOnline }: UserBadgeProps) {
  return (
    <div className="panel row" style={{ justifyContent: 'space-between' }}>
      <span className="row">
        <span
          aria-hidden
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: online ? 'var(--good)' : '#c3c8d6',
          }}
        />
        <b>{name}</b>
        <span className="badge">{role}</span>
        {online ? <span className="muted">в сети</span> : <span className="muted">не в сети</span>}
      </span>
      <button type="button" className="btn btn--sm btn--ghost" onClick={onToggleOnline}>
        Сменить статус
      </button>
    </div>
  )
}

export default function PropsDemo() {
  const [name, setName] = useState('Alice')
  const [role, setRole] = useState<Role>('admin')
  const [online, setOnline] = useState(true)

  return (
    <div className="stack">
      <div className="row">
        <input
          className="input"
          style={{ maxWidth: 180 }}
          value={name}
          aria-label="Имя"
          onChange={(e) => setName(e.target.value)}
        />
        <select
          className="select"
          style={{ maxWidth: 160 }}
          value={role}
          aria-label="Роль"
          onChange={(e) => setRole(e.target.value as Role)}
        >
          <option value="admin">admin</option>
          <option value="user">user</option>
          <option value="guest">guest</option>
        </select>
      </div>

      <UserBadge name={name} role={role} online={online} onToggleOnline={() => setOnline((v) => !v)} />

      <table className="table">
        <thead>
          <tr>
            <th>Пропс</th>
            <th>Значение</th>
            <th>Кто владеет данными</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <code>name</code>
            </td>
            <td>
              <code>&quot;{name}&quot;</code>
            </td>
            <td>родитель</td>
          </tr>
          <tr>
            <td>
              <code>role</code>
            </td>
            <td>
              <code>&quot;{role}&quot;</code>
            </td>
            <td>родитель</td>
          </tr>
          <tr>
            <td>
              <code>online</code>
            </td>
            <td>
              <code>{String(online)}</code> (по умолчанию <code>false</code>, если пропс не передан)
            </td>
            <td>родитель</td>
          </tr>
          <tr>
            <td>
              <code>onToggleOnline</code>
            </td>
            <td>
              <code>function</code>
            </td>
            <td>родитель, ребёнок только вызывает</td>
          </tr>
        </tbody>
      </table>

      <p className="muted">
        Данные текут <b>только вниз</b>: родитель передаёт пропсы, ребёнок не может их изменить напрямую — он
        может лишь попросить родителя через колбэк. Так и возникает однонаправленный поток данных.
      </p>
    </div>
  )
}
