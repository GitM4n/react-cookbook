import { CodeBlock } from '../lib/CodeBlock'
import { RichText } from '../lib/RichText'
import { DemoShell, CompareBlock } from './DemoShell'
import type { Block } from '../content/types'

export function BlockView({ block }: { block: Block }) {
  switch (block.kind) {
    case 'prose':
      return (
        <section className={`block${block.tone === 'warning' ? ' block--warning' : ''}`}>
          <h3 className="block__title">
            <span className="block__dot" />
            {block.title}
          </h3>
          <RichText text={block.text} />
        </section>
      )

    case 'demo':
      return (
        <section className="block">
          <h3 className="block__title">
            <span className="block__dot" />
            {block.title}
          </h3>
          <DemoShell title="Живой пример" caption={block.caption}>
            <block.Demo />
          </DemoShell>
        </section>
      )

    case 'code':
      return (
        <section className="block">
          <h3 className="block__title">
            <span className="block__dot" />
            {block.title}
          </h3>
          <CodeBlock code={block.source} title="Пример" />
        </section>
      )

    case 'compare':
      return <CompareBlock title={block.title} compare={block.compare} />
  }
}
