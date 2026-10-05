import type { Section } from './types'
import { basicsSection } from './basics'
import { formsSection } from './forms'
import { hooksSection } from './hooks'
import { architectureSection } from './architecture'
import { modernSection } from './modern'
import { qualitySection } from './quality'
import { underhoodSection } from './underhood'
import { trapsSection } from './traps'

export const sections: Section[] = [
  basicsSection,
  formsSection,
  hooksSection,
  architectureSection,
  modernSection,
  qualitySection,
  underhoodSection,
  trapsSection,
]
