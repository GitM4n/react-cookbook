import type { Section } from '../content/types'

export function Home({ sections }: { sections: Section[] }) {
  const total = sections.reduce((sum, s) => sum + s.topics.length, 0)

  return (
    <div className="home">
      <section className="hero">
        <span className="hero__badge">React 19 · TypeScript · Vite</span>
        <h1 className="hero__title">
          React Ecosystem <span className="hero__accent">Cookbook</span>
        </h1>
        <p className="hero__subtitle">
          Практический справочник по React: {total} тем в {sections.length} разделах. В каждой теме — короткое
          объяснение по-русски, живой интерактивный пример, его исходный код, разбор работы, типичные ловушки и
          рекомендации. Код и термины — на английском, всё объяснение — на русском.
        </p>
        <div className="hero__actions">
          <a className="btn btn--primary" href={`#/basics/${sections[0].topics[0].id}`}>
            Начать с основ →
          </a>
          <a className="btn btn--ghost" href="#/traps/traps-intro">
            Сразу к ловушкам
          </a>
        </div>
        <div className="hero__stats">
          <div className="stat">
            <b>{total}</b>
            <span>тем с примерами</span>
          </div>
          <div className="stat">
            <b>{sections.length}</b>
            <span>разделов</span>
          </div>
          <div className="stat">
            <b>100%</b>
            <span>примеров можно менять руками</span>
          </div>
        </div>
      </section>

      <section className="cards">
        {sections.map((section) => (
          <a className="card" key={section.id} href={`#/${section.id}/${section.topics[0].id}`}>
            <span className="card__icon">{section.icon}</span>
            <span className="card__title">{section.title}</span>
            <span className="card__desc">{section.description}</span>
            <span className="card__count">{section.topics.length} тем →</span>
          </a>
        ))}
      </section>

      <section className="block">
        <h3 className="block__title">
          <span className="block__dot" />
          Как пользоваться
        </h3>
        <div className="prose">
          <ul>
            <li>
              Темы идут по нарастающей: от <code>JSX</code> и state до <code>Suspense</code>, RSC и concurrent
              rendering.
            </li>
            <li>
              У каждого примера есть кнопка <b>«↺ Сбросить»</b> — она заново монтирует компонент и возвращает
              начальное состояние.
            </li>
            <li>
              Раздел <b>«Под капотом»</b> объясняет, почему React перерисовывает дерево, как работает
              reconciliation и что такое батчинг.
            </li>
            <li>
              Раздел <b>«Ловушки React»</b> — намеренно сломанные примеры и их исправленные версии с
              объяснением, когда разница действительно заметна.
            </li>
          </ul>
        </div>
      </section>
    </div>
  )
}
