import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { RenderCount } from '../../lib/demo-kit'

type Theme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function useTheme(): ThemeContextValue {
  const value = useContext(ThemeContext)
  if (!value) throw new Error('useTheme должен вызываться внутри <ThemeContext.Provider>')
  return value
}

function Level({
  name,
  theme,
  children,
}: {
  name: string
  theme?: Theme
  children?: ReactNode
}) {
  return (
    <div className="panel stack" style={{ marginLeft: 18, borderLeft: '3px solid var(--accent)' }}>
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <b>{name}</b>
        <span className="muted">{theme ? `theme="${theme}" в пропсах` : 'про пропс не знает'}</span>
      </div>
      <RenderCount label="Рендеров" />
      {children}
    </div>
  )
}

function ThemeAwareButton({ themeFromProps }: { themeFromProps?: Theme }) {
  const { theme, toggle } = useTheme()
  const visible = themeFromProps ?? theme

  return (
    <button type="button" className="btn btn--primary" onClick={toggle}>
      Тема: {visible} — переключить
    </button>
  )
}

export default function ContextTheme() {
  const [mode, setMode] = useState<'drill' | 'context'>('context')
  const [theme, setTheme] = useState<Theme>('light')

  const value: ThemeContextValue = { theme, toggle: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')) }

  return (
    <ThemeContext.Provider value={value}>
      <div className="stack">
        <div className="row">
          <button
            type="button"
            className={`chip${mode === 'drill' ? ' chip--active' : ''}`}
            onClick={() => setMode('drill')}
          >
            ❌ theme через пропсы (4 уровня)
          </button>
          <button
            type="button"
            className={`chip${mode === 'context' ? ' chip--active' : ''}`}
            onClick={() => setMode('context')}
          >
            ✅ theme через useContext
          </button>
          <RenderCount label="Рендеров Provider" />
        </div>

        <div className="panel stack">
          <b>{mode === 'drill' ? 'Page (получает theme пропсом)' : 'Page (про theme не знает)'}</b>
          <Level name="Layout" theme={mode === 'drill' ? theme : undefined}>
            <Level name="Sidebar" theme={mode === 'drill' ? theme : undefined}>
              <Level name="UserMenu" theme={mode === 'drill' ? theme : undefined}>
                <ThemeAwareButton themeFromProps={mode === 'drill' ? theme : undefined} />
              </Level>
            </Level>
          </Level>
        </div>

        <div className="panel">
          <div className="muted">Что меняется между режимами</div>
          {mode === 'drill' ? (
            <span>
              Каждый уровень обязан принимать <code>theme</code>, чтобы передать его ниже, — даже если сам
              им не пользуется. Это и есть prop drilling.
            </span>
          ) : (
            <span>
              Кнопка сама берёт значение через <code>useTheme()</code>. Средние уровни вообще не видят темы
              и не получают лишних пропсов.
            </span>
          )}
        </div>

        <p className="muted">
          Поменяйте тему и посмотрите на счётчики: в обоих режимах перерисовывается всё поддерево провайдера,
          потому что состояние лежит в самом верху. Реальную разницу в рендерах даёт стабильная ссылка
          значения контекста — тема «Под капотом → Как Context влияет на рендеринг».
        </p>
      </div>
    </ThemeContext.Provider>
  )
}
