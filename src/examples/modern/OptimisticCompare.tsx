import { useRef, useState } from 'react'
import type { ReactNode } from 'react'

function fakeServer(fail: boolean): Promise<void> {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => (fail ? reject(new Error('сервер ответил 500')) : resolve()), 900)
  })
}

function Shell({
  title,
  likes,
  status,
  latency,
  fail,
  setFail,
  onLike,
  children,
}: {
  title: string
  likes: number
  status: 'idle' | 'saving' | 'error'
  latency: number
  fail: boolean
  setFail: (value: boolean) => void
  onLike: () => void
  children?: ReactNode
}) {
  return (
    <div className="stack">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <b>{title}</b>
        <span className={`badge ${status === 'error' ? 'badge--bad' : status === 'saving' ? '' : 'badge--good'}`}>
          {status === 'idle' ? 'покой' : status === 'saving' ? 'сохраняем…' : 'ошибка'}
        </span>
      </div>
      <div className="row">
        <button type="button" className="btn btn--primary" onClick={onLike}>
          ❤️ Лайк · {likes}
        </button>
        <span className="muted">UI обновился через: {latency} мс</span>
      </div>
      {children}
      <label className="row">
        <input type="checkbox" checked={fail} onChange={(e) => setFail(e.target.checked)} />
        сервер отвечает ошибкой
      </label>
    </div>
  )
}

export function PessimisticLike() {
  const [likes, setLikes] = useState(12)
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [fail, setFail] = useState(false)
  const [latency, setLatency] = useState(0)
  const startedAt = useRef(0)

  const onLike = () => {
    startedAt.current = performance.now()
    setStatus('saving')
    void fakeServer(fail)
      .then(() => {
        setLikes((value) => value + 1)
        setStatus('idle')
        setLatency(Math.round(performance.now() - startedAt.current))
      })
      .catch(() => {
        setStatus('error')
        setLatency(Math.round(performance.now() - startedAt.current))
      })
  }

  return (
    <Shell
      title="Пессимистичное обновление"
      likes={likes}
      status={status}
      latency={latency}
      fail={fail}
      setFail={setFail}
      onLike={onLike}
    >
      <span className="muted">
        Клик → ждём ответ сервера → рисуем лайк. Пользователь видит «сохраняем…» и только потом результат.
      </span>
    </Shell>
  )
}

export function OptimisticLike() {
  const [likes, setLikes] = useState(12)
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle')
  const [fail, setFail] = useState(false)
  const [latency, setLatency] = useState(0)
  const startedAt = useRef(0)

  const onLike = () => {
    const snapshot = likes
    startedAt.current = performance.now()
    setLikes((value) => value + 1)
    setStatus('saving')
    setLatency(Math.round(performance.now() - startedAt.current))

    void fakeServer(fail)
      .then(() => setStatus('idle'))
      .catch(() => {
        setLikes(snapshot)
        setStatus('error')
      })
  }

  return (
    <Shell
      title="Оптимистичное обновление"
      likes={likes}
      status={status}
      latency={latency}
      fail={fail}
      setFail={setFail}
      onLike={onLike}
    >
      <span className="muted">
        Клик → сразу показываем +1 → уходит на сервер. При ошибке откатываемся к снимку и сообщаем о проблеме.
      </span>
    </Shell>
  )
}
