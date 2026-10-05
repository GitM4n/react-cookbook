import { useEffect, useState } from 'react'
import { sections } from './content'
import { useRoute } from './lib/hashRouter'
import { Sidebar } from './components/Sidebar'
import { Home } from './components/Home'
import { TopicView } from './components/TopicView'

const flat = sections.flatMap((section) => section.topics.map((topic) => ({ section, topic })))

export function App() {
  const route = useRoute()
  const [menuOpen, setMenuOpen] = useState(false)

  const index = flat.findIndex(
    (item) => item.section.id === route.sectionId && item.topic.id === route.topicId,
  )
  const current = index >= 0 ? flat[index] : null

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [route.sectionId, route.topicId])

  return (
    <div className="app">
      <header className="topbar">
        <button
          type="button"
          className="menu-btn"
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          ☰
        </button>
        <a className="topbar__brand" href="#/">
          ⚛ React Cookbook
        </a>
      </header>

      {menuOpen && <div className="backdrop" onClick={() => setMenuOpen(false)} />}

      <div className={`sidebar-wrap${menuOpen ? ' sidebar-wrap--open' : ''}`}>
        <Sidebar sections={sections} route={route} onNavigate={() => setMenuOpen(false)} />
      </div>

      <main className="main">
        {current ? (
          <TopicView
            section={current.section}
            topic={current.topic}
            prev={flat[index - 1] ?? null}
            next={flat[index + 1] ?? null}
          />
        ) : (
          <Home sections={sections} />
        )}
      </main>
    </div>
  )
}
