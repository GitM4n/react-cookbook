import { useState } from 'react'
import type { ComponentType, ReactNode } from 'react'
import { CodeBlock } from '../lib/CodeBlock'
import { RichText } from '../lib/RichText'
import type { Compare as CompareT, Side } from '../content/types'

export function DemoShell({
  title,
  caption,
  children,
}: {
  title: string
  caption?: string
  children: ReactNode
}) {
  const [seed, setSeed] = useState(0)

  return (
    <div className="demo">
      <div className="demo__bar">
        <span className="demo__badge">
          <span className="demo__dot" /> {title}
        </span>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSeed((s) => s + 1)}>
          ↺ Сбросить
        </button>
      </div>
      <div className="demo__body" key={seed}>
        {children}
      </div>
      {caption ? (
        <div className="demo__caption">
          <RichText text={caption} />
        </div>
      ) : null}
    </div>
  )
}

function SideColumn({ side, tone }: { side: Side; tone: 'bad' | 'good' }) {
  const [seed, setSeed] = useState(0)
  const Demo: ComponentType = side.Demo

  return (
    <div className={`compare__col compare__col--${tone}`}>
      <div className="compare__head">
        <span className="compare__badge">
          {tone === 'bad' ? '❌' : '✅'} {side.label}
        </span>
        <button type="button" className="btn btn--ghost btn--sm" onClick={() => setSeed((s) => s + 1)}>
          ↺ Сбросить
        </button>
      </div>
      <div className="compare__demo" key={seed}>
        <Demo />
      </div>
      <div className="compare__why">
        <RichText text={side.why} />
      </div>
    </div>
  )
}

export function CompareBlock({ title, compare }: { title: string; compare: CompareT }) {
  return (
    <section className="block">
      <h3 className="block__title">
        <span className="block__dot" />
        {title}
      </h3>
      <div className="compare">
        <SideColumn side={compare.bad} tone="bad" />
        <SideColumn side={compare.good} tone="good" />
      </div>
      <div className="compare__code">
        <CodeBlock code={compare.source} title="Оба варианта в одном файле" />
      </div>
    </section>
  )
}
