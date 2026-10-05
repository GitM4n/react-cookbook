import { useState } from 'react'
import type { FormEvent } from 'react'
import { LogView, useLog } from '../../lib/demo-kit'

interface FormState {
  email: string
  password: string
  agree: boolean
}

type FieldErrors = Partial<Record<keyof FormState, string>>

function validate(values: FormState): FieldErrors {
  const errors: FieldErrors = {}
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = 'Нужен корректный email, например user@mail.ru'
  }
  if (values.password.length < 8) {
    errors.password = 'Пароль от 8 символов'
  }
  if (!values.agree) {
    errors.agree = 'Нужно согласие с условиями'
  }
  return errors
}

export default function SignupForm() {
  const [values, setValues] = useState<FormState>({ email: '', password: '', agree: false })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [done, setDone] = useState(false)
  const { entries, push, clear } = useLog()

  const update = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length > 0) {
      push(`отправка отклонена: ${Object.keys(found).join(', ')}`)
      return
    }
    setDone(true)
    push(`отправлено: ${values.email}, согласие: ${values.agree}`)
  }

  const reset = () => {
    setValues({ email: '', password: '', agree: false })
    setErrors({})
    setDone(false)
    clear()
  }

  return (
    <div className="stack">
      <form className="stack" noValidate onSubmit={handleSubmit}>
        <div className="field">
          <span className="field__label">Email</span>
          <input
            className="input"
            type="text"
            value={values.email}
            placeholder="user@mail.ru"
            aria-invalid={Boolean(errors.email)}
            onChange={(e) => update('email', e.target.value)}
          />
          {errors.email ? <span className="badge badge--bad">{errors.email}</span> : null}
        </div>

        <div className="field">
          <span className="field__label">Пароль</span>
          <input
            className="input"
            type="password"
            value={values.password}
            placeholder="минимум 8 символов"
            aria-invalid={Boolean(errors.password)}
            onChange={(e) => update('password', e.target.value)}
          />
          {errors.password ? <span className="badge badge--bad">{errors.password}</span> : null}
        </div>

        <label className="row">
          <input
            type="checkbox"
            checked={values.agree}
            onChange={(e) => update('agree', e.target.checked)}
          />
          Согласен с условиями
          {errors.agree ? <span className="badge badge--bad">{errors.agree}</span> : null}
        </label>

        <div className="row">
          <button type="submit" className="btn btn--primary">
            Зарегистрироваться
          </button>
          <button type="button" className="btn btn--ghost" onClick={reset}>
            Очистить
          </button>
          {done ? <span className="badge badge--good">Форма валидна ✅</span> : null}
        </div>
      </form>

      <div className="panel">
        <div className="muted">Живое состояние формы (оно же то, что уйдёт на сервер)</div>
        <code>{JSON.stringify(values, null, 2)}</code>
      </div>

      <LogView entries={entries} empty="Попробуйте отправить форму" />
    </div>
  )
}
