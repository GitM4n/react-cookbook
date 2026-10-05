import { BlockView } from './BlockView'
import type { Section, Topic } from '../content/types'

export function TopicView({
  section,
  topic,
  prev,
  next,
}: {
  section: Section
  topic: Topic
  prev: { section: Section; topic: Topic } | null
  next: { section: Section; topic: Topic } | null
}) {
  return (
    <article className="topic">
      <header className="topic__header">
        <div className="breadcrumb">
          <a href="#/">Главная</a>
          <span>/</span>
          <a href={`#/${section.id}/${section.topics[0].id}`}>{section.title}</a>
          <span>/</span>
          <span className="breadcrumb__current">{topic.title}</span>
        </div>
        <h1 className="topic__title">{topic.title}</h1>
        <p className="topic__summary">{topic.summary}</p>
      </header>

      <div className="topic__body">
        {topic.blocks.map((block, i) => (
          <BlockView key={i} block={block} />
        ))}
      </div>

      <nav className="topic__nav">
        {prev ? (
          <a className="topic__nav-link topic__nav-link--prev" href={`#/${prev.section.id}/${prev.topic.id}`}>
            <span className="topic__nav-label">← Предыдущая тема</span>
            <span className="topic__nav-title">{prev.topic.title}</span>
          </a>
        ) : (
          <span />
        )}
        {next ? (
          <a className="topic__nav-link topic__nav-link--next" href={`#/${next.section.id}/${next.topic.id}`}>
            <span className="topic__nav-label">Следующая тема →</span>
            <span className="topic__nav-title">{next.topic.title}</span>
          </a>
        ) : (
          <span />
        )}
      </nav>
    </article>
  )
}
