import { useState } from 'react'
import { Highlight, themes } from 'prism-react-renderer'

function detectLang(code: string): string {
  if (code.includes('import ') || code.includes('export ')) return 'tsx'
  if (code.includes('=>') || code.includes('function ')) return 'tsx'
  return 'tsx'
}

export function CodeBlock({ code, title }: { code: string; title?: string }) {
  const [copied, setCopied] = useState(false)
  const source = code.replace(/^\n/, '').replace(/\s+$/, '')
  const lang = detectLang(source)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="code">
      <div className="code__bar">
        <span className="code__title">{title ?? 'Код'}</span>
        <div className="code__bar-right">
          <span className="code__lang">{lang.toUpperCase()}</span>
          <button type="button" className="btn btn--ghost btn--sm" onClick={copy}>
            {copied ? 'Скопировано' : 'Копировать'}
          </button>
        </div>
      </div>
      <Highlight theme={themes.nightOwl} code={source} language={lang}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${className} code__pre`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="code__ln">{i + 1}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
