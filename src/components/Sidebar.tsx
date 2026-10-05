import { useMemo, useState } from 'react'
import type { Section } from '../content/types'
import type { Route } from '../lib/hashRouter'

export function Sidebar({
  sections,
  route,
  onNavigate,
}: {
  sections: Section[]
  route: Route
  onNavigate: () => void
}) {
  const [query, setQuery] = useState('')
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sections
    return sections
      .map((section) => ({
        ...section,
        topics: section.topics.filter(
          (t) =>
            t.title.toLowerCase().includes(q) ||
            t.summary.toLowerCase().includes(q) ||
            section.title.toLowerCase().includes(q),
        ),
      }))
      .filter((section) => section.topics.length > 0)
  }, [sections, query])

  const total = sections.reduce((sum, s) => sum + s.topics.length, 0)

  return (
    <aside className="sidebar">
      <a className="brand" href="#/" onClick={onNavigate}>
        <span className="brand__mark">⚛</span>
        <span className="brand__text">
          <span className="brand__title">React Cookbook</span>
          <span className="brand__subtitle">Интерактивный справочник</span>
        </span>
      </a>

      <div className="search">
        <span className="search__icon">⌕</span>
        <input
          className="search__input"
          type="search"
          placeholder="Поиск по темам…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Поиск по темам"
        />
      </div>

      <nav className="nav" aria-label="Разделы">
        {visible.length === 0 ? (
          <p className="nav__empty">Ничего не найдено</p>
        ) : (
          visible.map((section) => {
            const isOpen = !collapsed[section.id] || section.id === route.sectionId
            return (
              <div className="nav__section" key={section.id}>
                <button
                  type="button"
                  className="nav__section-btn"
                  onClick={() => setCollapsed((prev) => ({ ...prev, [section.id]: !collapsed[section.id] }))}
                  aria-expanded={isOpen}
                >
                  <span className="nav__section-title">
                    <span className="nav__icon">{section.icon}</span>
                    {section.title}
                  </span>
                  <span className="nav__chevron">{isOpen ? '−' : '+'}</span>
                </button>
                {isOpen && (
                  <ul className="nav__list">
                    {section.topics.map((t) => {
                      const active = route.sectionId === section.id && route.topicId === t.id
                      return (
                        <li key={t.id}>
                          <a
                            className={`nav__link${active ? ' nav__link--active' : ''}`}
                            href={`#/${section.id}/${t.id}`}
                            onClick={onNavigate}
                          >
                            {t.title}
                          </a>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            )
          })
        )}
      </nav>

      <div className="sidebar__footer">
        <span>
          {total} тем · {sections.length} разделов
        </span>
        <a href="#/" onClick={onNavigate}>
          На главную
        </a>
      </div>
    </aside>
  )
}
