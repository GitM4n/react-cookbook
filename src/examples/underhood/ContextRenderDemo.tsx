import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import { RenderCount } from '../../lib/demo-kit'

interface Settings {
  theme: string
  user: string
  noise: number
}

const SettingsContext = createContext<Settings | null>(null)
const ThemeContext = createContext('light')
const UserContext = createContext('guest')

function CombinedThemeConsumer() {
  const settings = useContext(SettingsContext)
  return (
    <div className="panel row" style={{ justifyContent: 'space-between' }}>
      <b>Читает только тему</b>
      <span className="row">
        <span className="muted">theme = {settings?.theme}</span>
        <RenderCount label="рендеров" />
      </span>
    </div>
  )
}

function CombinedUserConsumer() {
  const settings = useContext(SettingsContext)
  return (
    <div className="panel row" style={{ justifyContent: 'space-between' }}>
      <b>Читает только user</b>
      <span className="row">
        <span className="muted">user = {settings?.user}</span>
        <RenderCount label="рендеров" />
      </span>
    </div>
  )
}

function SplitThemeConsumer() {
  const theme = useContext(ThemeContext)
  return (
    <div className="panel row" style={{ justifyContent: 'space-between' }}>
      <b>Читает только тему</b>
      <span className="row">
        <span className="muted">theme = {theme}</span>
        <RenderCount label="рендеров" />
      </span>
    </div>
  )
}

function SplitUserConsumer() {
  const user = useContext(UserContext)
  return (
    <div className="panel row" style={{ justifyContent: 'space-between' }}>
      <b>Читает только user</b>
      <span className="row">
        <span className="muted">user = {user}</span>
        <RenderCount label="рендеров" />
      </span>
    </div>
  )
}

function Controls({
  theme,
  user,
  noise,
  onTheme,
  onUser,
  onNoise,
}: {
  theme: string
  user: string
  noise: number
  onTheme: () => void
  onUser: () => void
  onNoise: () => void
}) {
  return (
    <div className="row">
      <button type="button" className="btn btn--ghost" onClick={onTheme}>
        сменить тему ({theme})
      </button>
      <button type="button" className="btn btn--ghost" onClick={onUser}>
        сменить user ({user})
      </button>
      <button type="button" className="btn btn--ghost" onClick={onNoise}>
        мусорное состояние: {noise}
      </button>
    </div>
  )
}

export default function ContextRenderDemo() {
  const [mode, setMode] = useState<'combined' | 'split'>('combined')
  const [theme, setTheme] = useState('light')
  const [user, setUser] = useState('Alice')
  const [noise, setNoise] = useState(0)

  const combinedValue: Settings = { theme, user, noise }

  const controls = (
    <Controls
      theme={theme}
      user={user}
      noise={noise}
      onTheme={() => setTheme((value) => (value === 'light' ? 'dark' : 'light'))}
      onUser={() => setUser((value) => (value === 'Alice' ? 'Bob' : 'Alice'))}
      onNoise={() => setNoise((value) => value + 1)}
    />
  )

  let body: ReactNode
  if (mode === 'combined') {
    body = (
      <SettingsContext.Provider value={combinedValue}>
        {controls}
        <div className="panel stack" key="combined">
          <CombinedThemeConsumer />
          <CombinedUserConsumer />
        </div>
      </SettingsContext.Provider>
    )
  } else {
    body = (
      <ThemeContext.Provider value={theme}>
        <UserContext.Provider value={user}>
          {controls}
          <div className="panel stack" key="split">
            <SplitThemeConsumer />
            <SplitUserConsumer />
          </div>
        </UserContext.Provider>
      </ThemeContext.Provider>
    )
  }

  return (
    <div className="stack">
      <div className="row">
        <button
          type="button"
          className={`chip${mode === 'combined' ? ' chip--active' : ''}`}
          onClick={() => setMode('combined')}
        >
          ❌ один контекст, объект-литерал
        </button>
        <button
          type="button"
          className={`chip${mode === 'split' ? ' chip--active' : ''}`}
          onClick={() => setMode('split')}
        >
          ✅ отдельные контексты
        </button>
      </div>

      {body}

      <div className="panel">
        <div className="muted">Как это работает</div>
        React сравнивает новое значение контекста со старым через <code>Object.is</code> и перерисовывает
        потребителей, только если ссылка изменилась. В «плохом» режиме значение — объект-литерал, который
        создаётся заново при <b>любом</b> состоянии провайдера, включая «мусорное», — и оба потребителя
        перерисовываются, хотя данные, которые они читают, не менялись. Раздельные контексты дают точечные
        подписки: тема трогает только читателя темы.
      </div>

      <p className="muted">
        Важно: потребитель перерисовывается <b>всегда</b>, когда меняется значение его контекста, даже если
        он обёрнут в <code>React.memo</code> и читает только одно поле из объекта. Поэтому объект значения
        мемоизируют (<code>useMemo</code>) и делят контексты по сферам ответственности.
      </p>
    </div>
  )
}
