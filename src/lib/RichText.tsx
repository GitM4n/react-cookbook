import type { ReactNode } from 'react'

function renderInline(text: string, key: string): ReactNode[] {
  return text
    .split(/(\*\*[^*]+\*\*|`[^`]+`|~[^~]+~)/g)
    .filter((part) => part !== '')
    .map((part, i) => {
      const k = `${key}-${i}`
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
        return <strong key={k}>{part.slice(2, -2)}</strong>
      }
      if (part.length > 2 && (part.startsWith('`') || part.startsWith('~'))) {
        return <code key={k}>{part.slice(1, -1)}</code>
      }
      return <span key={k}>{part}</span>
    })
}

type Chunk = { type: 'p' | 'ul' | 'h'; lines: string[] }

function parse(text: string): Chunk[] {
  const chunks: Chunk[] = []
  for (const raw of text.split('\n')) {
    const line = raw.trimEnd()
    const last = chunks[chunks.length - 1]

    if (line.trim() === '') {
      chunks.push({ type: 'p', lines: [] })
      continue
    }
    if (line.startsWith('### ')) {
      chunks.push({ type: 'h', lines: [line.slice(4)] })
      continue
    }
    if (line.startsWith('- ')) {
      if (!last || last.type !== 'ul') chunks.push({ type: 'ul', lines: [] })
      chunks[chunks.length - 1].lines.push(line.slice(2))
      continue
    }
    if (!last || last.type !== 'p') chunks.push({ type: 'p', lines: [] })
    chunks[chunks.length - 1].lines.push(line.trim())
  }
  return chunks.filter((c) => c.lines.length > 0)
}

export function RichText({ text }: { text: string }) {
  return (
    <div className="prose">
      {parse(text).map((chunk, i) => {
        if (chunk.type === 'h') {
          return <h4 key={i}>{renderInline(chunk.lines.join(' '), `h${i}`)}</h4>
        }
        if (chunk.type === 'ul') {
          return (
            <ul key={i}>
              {chunk.lines.map((line, j) => (
                <li key={j}>{renderInline(line, `l${i}-${j}`)}</li>
              ))}
            </ul>
          )
        }
        return <p key={i}>{renderInline(chunk.lines.join(' '), `p${i}`)}</p>
      })}
    </div>
  )
}
