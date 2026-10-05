import { useRef, useState } from 'react'
import type { FormEvent } from 'react'

export default function ControlledVsUncontrolled() {
  return (
    <div className="grid-2">
      <div className="panel stack">
        <b>Контролируемый</b>
        <ControlledForm />
      </div>
      <div className="panel stack">
        <b>Неконтролируемый</b>
        <UncontrolledForm />
      </div>
    </div>
  )
}

export function ControlledForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sent, setSent] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSent(`email=${email}, длина пароля=${password.length}`)
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="field">
        <span className="field__label">Email (value + onChange)</span>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="field">
        <span className="field__label">Пароль (value + onChange)</span>
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="row">
        <button type="submit" className="btn btn--sm btn--primary">
          Отправить
        </button>
        <span className="muted">React-состояние всегда знает актуальные значения</span>
      </div>
      {sent ? <span className="badge badge--good">{sent}</span> : null}
    </form>
  )
}

export function UncontrolledForm() {
  const passwordRef = useRef<HTMLInputElement>(null)
  const [sent, setSent] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSent(`email=${String(data.get('email'))}, длина пароля=${String(data.get('password')).length}`)
  }

  return (
    <form className="stack" onSubmit={handleSubmit}>
      <div className="field">
        <span className="field__label">Email (defaultValue, значение живёт в DOM)</span>
        <input className="input" name="email" defaultValue="user@mail.ru" />
      </div>
      <div className="field">
        <span className="field__label">Пароль (чтение через ref)</span>
        <input className="input" name="password" type="password" ref={passwordRef} />
      </div>
      <div className="row">
        <button type="submit" className="btn btn--sm btn--primary">
          Отправить
        </button>
        <button
          type="button"
          className="btn btn--sm btn--ghost"
          onClick={() => passwordRef.current?.focus()}
        >
          Фокус в пароль
        </button>
        <span className="muted">FormData читает всё в момент submit</span>
      </div>
      {sent ? <span className="badge badge--good">{sent}</span> : null}
    </form>
  )
}
