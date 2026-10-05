import type { ComponentType } from 'react'

export interface Side {
  label: string
  Demo: ComponentType
  why: string
}

export interface Compare {
  title?: string
  /** Оба варианта живут в одном файле — он показывается под парой демо. */
  source: string
  bad: Side
  good: Side
}

export type Block =
  | { kind: 'prose'; title: string; text: string; tone?: 'info' | 'warning' }
  | { kind: 'demo'; title: string; Demo: ComponentType; caption?: string }
  | { kind: 'code'; title: string; source: string }
  | { kind: 'compare'; title: string; compare: Compare }

export interface Topic {
  id: string
  title: string
  summary: string
  blocks: Block[]
}

export interface Section {
  id: string
  title: string
  icon: string
  description: string
  topics: Topic[]
}

interface CommonInput {
  id: string
  title: string
  summary: string
  /** 1. Короткое объяснение по-русски */
  intro: string
  /** 4. Как устроено/работает код */
  how: string
  /** 5. Типичные ошибки и ловушки */
  mistakes: string
  /** 6. Нюансы и лучшие практики */
  nuances: string
  /** 7. Зачем и когда использовать */
  when: string
  /** 8. Простой и продвинутый варианты */
  alternatives?: string
  compare?: Compare
  demoTitle?: string
  demoCaption?: string
}

type DemoPart =
  | { Demo: ComponentType; source: string }
  | { Demo?: undefined; source?: undefined }

export type TopicInput = CommonInput & DemoPart

export function topic(input: TopicInput): Topic {
  const blocks: Block[] = [{ kind: 'prose', title: 'Кратко', text: input.intro }]

  if (input.Demo) {
    blocks.push({
      kind: 'demo',
      title: input.demoTitle ?? 'Живой пример',
      Demo: input.Demo,
      caption: input.demoCaption,
    })
  }
  if (input.source) {
    blocks.push({ kind: 'code', title: 'Исходный код примера', source: input.source })
  }  // Если живого примера нет — пару ❌/✅ показываем сразу после объяснения.
  if (input.compare && !input.Demo) {
    blocks.push({
      kind: 'compare',
      title: input.compare.title ?? 'Частая ошибка vs рекомендуемый подход',
      compare: input.compare,
    })
  }
  blocks.push({ kind: 'prose', title: 'Как это работает', text: input.how })
  if (input.compare && input.Demo) {
    blocks.push({
      kind: 'compare',
      title: input.compare.title ?? 'Частая ошибка vs рекомендуемый подход',
      compare: input.compare,
    })
  }
  blocks.push({ kind: 'prose', title: 'Типичные ошибки и ловушки', text: input.mistakes, tone: 'warning' })
  blocks.push({ kind: 'prose', title: 'Нюансы и лучшие практики', text: input.nuances })
  blocks.push({ kind: 'prose', title: 'Зачем и когда использовать', text: input.when })
  if (input.alternatives) {
    blocks.push({ kind: 'prose', title: 'Простой вариант и продвинутый подход', text: input.alternatives })
  }

  return { id: input.id, title: input.title, summary: input.summary, blocks }
}
