import { useState } from 'react'

interface Case {
  id: string
  code: string
  question: string
  answer: string
}

const CASES: Case[] = [
  {
    id: 'key',
    code: `const [items, setItems] = useState(['a', 'b', 'c'])\nconst removeFirst = () => setItems(items.slice(1))\n\nitems.map((item, i) => <Row key={i} />)`,
    question: 'Удалили первый элемент. Что увидит пользователь?',
    answer:
      'React сопоставит позиции: оставшиеся строки получат ключи 0 и 1 вместо 1 и 2. Всё «переедет» на позиции, а локальное состояние строк (раскрытые аккордеоны, введённый текст) останется на старых позициях и окажется не у тех данных.',
  },
  {
    id: 'stale',
    code: `const [count, setCount] = useState(0)\n\nconst plus3 = () => {\n  for (let i = 0; i < 3; i++) {\n    setTimeout(() => setCount(count + 1), 100)\n  }\n}`,
    question: 'Три отложенных инкремента. На сколько вырастет count?',
    answer:
      'На 1. Все три колбэка захватили одно и то же значение count, созданное в момент вызова plus3, и каждый установит count + 1 — одно и то же число. Лечится функциональным сеттером setCount(prev => prev + 1).',
  },
  {
    id: 'deps',
    code: `useEffect(() => {\n  const id = setInterval(() => fetch(status), 2000)\n  return () => clearInterval(id)\n}, [])`,
    question: 'Пользователь переключил status. Что будет делать эффект?',
    answer:
      'Ничего не заметит: массив зависимостей пуст, эффект выполнится один раз при монтировании и всегда будет опрашивать старый status. При этом ESLint сразу подсветит пропущенную зависимость — чаще всего её действительно нужно добавить, а не глушить.',
  },
]

export default function TrapsIntro() {
  const [opened, setOpened] = useState<string[]>([])

  const toggle = (id: string) =>
    setOpened((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))

  return (
    <div className="stack">
      {CASES.map((item) => {
        const isOpen = opened.includes(item.id)
        return (
          <div key={item.id} className="panel stack">
            <pre className="log">{item.code}</pre>
            <b>{item.question}</b>
            <div className="row">
              <button type="button" className="btn btn--sm btn--primary" onClick={() => toggle(item.id)}>
                {isOpen ? 'Скрыть ответ' : 'Показать, что сломается'}
              </button>
              {isOpen ? <span className="badge badge--bad">вот эта ловушка</span> : null}
            </div>
            {isOpen ? <div className="panel panel--bad">{item.answer}</div> : null}
          </div>
        )
      })}

      <p className="muted">
        Дальше каждая тема раздела устроена одинаково: слева — ❌ рабочий, но проблемный вариант, справа — ✅
        исправленный, ниже — исходный код обоих и объяснение, когда разница действительно заметна.
      </p>
    </div>
  )
}
