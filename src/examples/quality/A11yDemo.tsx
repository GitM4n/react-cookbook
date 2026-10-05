import { useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

const TABS = [
  { id: 'home', label: 'Главная', body: 'Контент главной: приветствие и сводка.' },
  { id: 'profile', label: 'Профиль', body: 'Контент профиля: имя, аватар, почта.' },
  { id: 'settings', label: 'Настройки', body: 'Контент настроек: уведомления, тема, язык.' },
]

function Check({ ok, children }: { ok: boolean; children?: ReactNode }) {
  return (
    <div className="row" style={{ justifyContent: 'space-between' }}>
      <span>{children}</span>
      <span className={`badge ${ok ? 'badge--good' : 'badge--bad'}`}>{ok ? 'есть' : 'нет'}</span>
    </div>
  )
}

export default function A11yDemo() {
  const [accessible, setAccessible] = useState(true)
  const [active, setActive] = useState('home')
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([])

  const activeIndex = TABS.findIndex((tab) => tab.id === active)
  const current = TABS[activeIndex]

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!accessible) return
    let next = activeIndex
    if (event.key === 'ArrowRight') next = (activeIndex + 1) % TABS.length
    else if (event.key === 'ArrowLeft') next = (activeIndex - 1 + TABS.length) % TABS.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = TABS.length - 1
    else return

    event.preventDefault()
    setActive(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  const activate = (index: number) => {
    setActive(TABS[index].id)
    if (accessible) tabRefs.current[index]?.focus()
  }

  return (
    <div className="stack">
      <div className="row">
        <button
          type="button"
          className={`chip${accessible ? ' chip--active' : ''}`}
          onClick={() => setAccessible(true)}
        >
          ✅ Доступный вариант
        </button>
        <button
          type="button"
          className={`chip${!accessible ? ' chip--active' : ''}`}
          onClick={() => setAccessible(false)}
        >
          ❌ Только клик мышью
        </button>
      </div>

      {accessible ? (
        <div className="panel stack">
          <div role="tablist" aria-label="Разделы" className="row" onKeyDown={handleKeyDown}>
            {TABS.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={active === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={active === tab.id ? 0 : -1}
                className={`chip${active === tab.id ? ' chip--active' : ''}`}
                onClick={() => activate(index)}
                ref={(element) => {
                  tabRefs.current[index] = element
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${current.id}`} aria-labelledby={`tab-${current.id}`}>
            {current.body}
          </div>
        </div>
      ) : (
        <div className="panel stack">
          <div className="row">
            {TABS.map((tab, index) => (
              <span
                key={tab.id}
                className={`chip${active === tab.id ? ' chip--active' : ''}`}
                onClick={() => activate(index)}
                style={{ cursor: 'pointer' }}
              >
                {tab.label}
              </span>
            ))}
          </div>
          <div>{current.body}</div>
        </div>
      )}

      <div className="panel stack">
        <b>Чек-лист вкладок (ARIA APG)</b>
        <Check ok={accessible}>roles: tablist / tab / tabpanel</Check>
        <Check ok={accessible}>aria-selected на активной вкладке</Check>
        <Check ok={accessible}>aria-controls и aria-labelledby связывают кнопку и панель</Check>
        <Check ok={accessible}>стрелки ←/→ и Home/End, roving tabindex</Check>
        <Check ok={accessible}>фокус переходит на активную вкладку</Check>
      </div>

      <p className="muted">
        Проверьте руками: в доступном варианте нажмите <b>Tab</b> — фокус попадает на вкладки, затем{' '}
        <b>←/→</b> переключают их. В «мышином» варианте div'ы вообще не получают фокус, а скринридер не
        узнает, что это вкладки.
      </p>
    </div>
  )
}
