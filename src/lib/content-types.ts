// Shapes of the generated JSON in public/data/ (SCHEMA §6).
// Shared by scripts/build-content.ts (writer) and the app (reader).

export type EntryType = 'concept' | 'technique' | 'technology' | 'system' | 'workflow' | 'parameter'
export type Adoption = 'foundational' | 'established' | 'emerging' | 'experimental'
export type Trend = 'rising' | 'steady' | 'cooling'
export type RelationshipType = 'prerequisite-of' | 'part-of' | 'alternative-to' | 'used-in' | 'implemented-by'

// How a resolved edge reads from the entry it's shown on (SCHEMA §2.1).
export type RelationKind =
  | 'leads-to' | 'learn-first'
  | 'part-of' | 'components'
  | 'alternatives'
  | 'used-in' | 'uses'
  | 'implementations' | 'implements'

export interface ResolvedRelation {
  kind: RelationKind
  type: RelationshipType
  target: string
  note?: string
}

export interface Video {
  id: string
  title: string
  channel: string
  verified: string
}

export interface Entry {
  id: string
  term: string
  aliases: string[]
  type: EntryType
  domains: string[]
  industries: string[]
  workflows: string[]
  adoption: Adoption
  trend: Trend
  trendNote?: string
  summary: string
  relations: ResolvedRelation[]
  videos: Video[]
  /** Inline SVG markup from content/diagrams/, or undefined */
  diagram?: string
  added: string
  lastReviewed: string
  /** Rendered HTML. Wiki-links are <a class="wikilink" data-entry="id" href="/term/id">. */
  plain: string
  technical: string
  examples?: string
  /** Plain text of both explanations, for search */
  text: string
}

export interface Taxonomy {
  domains: string[]
  types: EntryType[]
  industries: string[]
}

export interface Glossary {
  buildTime: string
  entryCount: number
  entries: Entry[]
  taxonomy: Taxonomy
}

export interface GraphNode {
  id: string
  cluster: string
  domains: string[]
  degree: number
  prerequisiteDepth: number
}

export interface GraphEdge {
  source: string
  target: string
  type: RelationshipType
  note?: string
}

export interface Graph {
  buildTime: string
  nodes: GraphNode[]
  edges: GraphEdge[]
}

export interface QuizOption {
  text: string
  correct?: boolean
  /** Entry this option refers to, for generated questions */
  entry?: string
}

export interface QuizQuestion {
  id: string
  entry: string
  /** The entry's first domain (SCHEMA §3.1) */
  category: string
  difficulty: 1 | 2 | 3
  kind: 'definition' | 'application' | 'relationship' | 'distinction'
  prompt: string
  options: QuizOption[]
  explanation: string
  generated: boolean
  template?: 'prerequisite' | 'component' | 'alternative'
}

export interface Quiz {
  buildTime: string
  questions: QuizQuestion[]
}

export type PathStep =
  | { entry: string; note?: string }
  | { checkpoint: 'quiz'; category?: string }

export interface LearningPath {
  id: string
  title: string
  description: string
  audience: 'beginner' | 'practical' | 'technical' | 'decision-maker'
  estimatedMinutes: number
  steps: PathStep[]
  assumesKnown: string[]
}

export interface Paths {
  buildTime: string
  paths: LearningPath[]
}
