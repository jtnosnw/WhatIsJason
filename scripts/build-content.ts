// Content build: content/ → public/data/*.json (SPEC §2.3, SCHEMA §6–7).
// Run with `npm run build:content`. Exits 1 on any validation error.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'
import { Marked, type Tokens } from 'marked'
import type {
  Entry, EntryType, Glossary, Graph, GraphEdge, GraphNode, LearningPath, Paths, PathStep,
  Quiz, QuizQuestion, RelationKind, RelationshipType, ResolvedRelation, Taxonomy, Video,
} from '../src/lib/content-types.ts'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const CONTENT = path.join(ROOT, 'content')
const OUT = path.join(ROOT, 'public', 'data')

// ── Reporting ──────────────────────────────────────────────────────────────

const errors: string[] = []
const warnings = new Map<string, string[]>()
const fail = (msg: string) => errors.push(msg)
const warn = (group: string, msg: string) => {
  const list = warnings.get(group) ?? []
  list.push(msg)
  warnings.set(group, list)
}

// ── Vocabularies ───────────────────────────────────────────────────────────

const ADOPTION = ['foundational', 'established', 'emerging', 'experimental']
const TREND = ['rising', 'steady', 'cooling']
const REL_TYPES: RelationshipType[] = ['prerequisite-of', 'part-of', 'alternative-to', 'used-in', 'implemented-by']
const QUIZ_KINDS = ['definition', 'application', 'relationship', 'distinction']
const AUDIENCES = ['beginner', 'practical', 'technical', 'decision-maker']

// SCHEMA §2.1: how an edge reads from its source and from its target.
const SOURCE_KIND: Record<RelationshipType, RelationKind> = {
  'prerequisite-of': 'leads-to',
  'part-of': 'part-of',
  'alternative-to': 'alternatives',
  'used-in': 'used-in',
  'implemented-by': 'implementations',
}
const TARGET_KIND: Record<RelationshipType, RelationKind> = {
  'prerequisite-of': 'learn-first',
  'part-of': 'components',
  'alternative-to': 'alternatives',
  'used-in': 'uses',
  'implemented-by': 'implements',
}

const REVIEW_WARN_MONTHS = 6
const VIDEO_WARN_MONTHS = 12
const MIN_CLUSTER_SIZE = 3

// ── Helpers ────────────────────────────────────────────────────────────────

const readYaml = (file: string): unknown => YAML.parse(fs.readFileSync(file, 'utf8'))
const isKebab = (s: unknown): s is string => typeof s === 'string' && /^[a-z0-9]+(-[a-z0-9]+)*$/.test(s)
const isDate = (s: unknown): s is string => typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && !isNaN(Date.parse(s))
const str = (v: unknown): string | undefined => (typeof v === 'string' && v.trim() ? v.trim() : undefined)
const strList = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : [])

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

const htmlToText = (html: string) =>
  html.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, ' ').trim()

function monthsAgo(date: string, now: Date) {
  const d = new Date(date)
  return (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth())
}

// Deterministic shuffle so generated questions are stable between builds.
function seededShuffle<T>(items: T[], seed: string): T[] {
  let h = 2166136261
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
  const rand = () => {
    h = Math.imul(h ^ (h >>> 15), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    return ((h ^= h >>> 16) >>> 0) / 4294967296
  }
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

// ── Taxonomy ───────────────────────────────────────────────────────────────

const taxRaw = readYaml(path.join(CONTENT, 'taxonomy.yaml')) as Partial<Taxonomy>
const taxonomy: Taxonomy = {
  domains: strList(taxRaw.domains),
  types: strList(taxRaw.types) as EntryType[],
  industries: strList(taxRaw.industries),
}

// ── Entries: parse frontmatter + sections ──────────────────────────────────

interface RawEdge { type: RelationshipType; target: string; note?: string }
interface ParsedEntry {
  file: string
  entry: Omit<Entry, 'relations' | 'plain' | 'technical' | 'examples' | 'text'>
  edges: RawEdge[]
  noGeneratedQuestions: boolean
  sections: Record<string, string>
}

const ENTRY_DIR = path.join(CONTENT, 'entries')
const DIAGRAM_DIR = path.join(CONTENT, 'diagrams')
const parsed = new Map<string, ParsedEntry>()
const nameOwner = new Map<string, string>() // lowercased id/alias → entry id

for (const file of fs.readdirSync(ENTRY_DIR).filter(f => f.endsWith('.md')).sort()) {
  const where = `entries/${file}`
  const raw = fs.readFileSync(path.join(ENTRY_DIR, file), 'utf8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) { fail(`${where}: missing YAML frontmatter`); continue }

  let fm: Record<string, unknown>
  try { fm = (YAML.parse(match[1]) ?? {}) as Record<string, unknown> }
  catch (e) { fail(`${where}: invalid YAML — ${(e as Error).message}`); continue }

  const sections: Record<string, string> = {}
  let current: string | null = null
  for (const line of match[2].split(/\r?\n/)) {
    const h = line.match(/^##\s+(.+?)\s*$/)
    if (h) { current = h[1]; sections[current] = '' }
    else if (current) sections[current] += line + '\n'
  }

  const id = fm.id
  if (!isKebab(id)) { fail(`${where}: id missing or not kebab-case`); continue }
  if (`${id}.md` !== file) fail(`${where}: id "${id}" doesn't match filename`)
  if (parsed.has(id)) { fail(`${where}: duplicate id "${id}"`); continue }

  for (const key of ['term', 'type', 'domains', 'adoption', 'trend', 'summary', 'added', 'lastReviewed']) {
    if (fm[key] == null || fm[key] === '') fail(`${where}: missing required field "${key}"`)
  }
  if (!sections.Plain?.trim()) fail(`${where}: missing "## Plain" section`)
  if (!sections.Technical?.trim()) fail(`${where}: missing "## Technical" section`)

  const type = fm.type as EntryType
  if (fm.type != null && !taxonomy.types.includes(type)) fail(`${where}: type "${fm.type}" not in taxonomy`)
  const domains = strList(fm.domains)
  if (fm.domains != null && (domains.length < 1 || domains.length > 3)) fail(`${where}: domains must list 1–3 values`)
  for (const d of domains) if (!taxonomy.domains.includes(d)) fail(`${where}: domain "${d}" not in taxonomy`)
  if (fm.adoption != null && !ADOPTION.includes(fm.adoption as string)) fail(`${where}: adoption "${fm.adoption}" invalid`)
  if (fm.trend != null && !TREND.includes(fm.trend as string)) fail(`${where}: trend "${fm.trend}" invalid`)
  if (fm.added != null && !isDate(fm.added)) fail(`${where}: added must be YYYY-MM-DD`)
  if (fm.lastReviewed != null && !isDate(fm.lastReviewed)) fail(`${where}: lastReviewed must be YYYY-MM-DD`)

  const industries = strList(fm.industries)
  for (const ind of industries) {
    if (!taxonomy.industries.includes(ind)) warn('industry not in taxonomy.yaml', `${where}: "${ind}"`)
  }

  const aliases = strList(fm.aliases)
  for (const name of [id, ...aliases]) {
    const key = name.toLowerCase()
    const owner = nameOwner.get(key)
    if (owner && owner !== id) fail(`${where}: "${name}" collides with an id or alias of "${owner}"`)
    nameOwner.set(key, id)
  }

  const edges: RawEdge[] = []
  for (const [i, r] of (Array.isArray(fm.relationships) ? fm.relationships : []).entries()) {
    const rel = r as Record<string, unknown>
    if (!REL_TYPES.includes(rel.type as RelationshipType)) { fail(`${where}: relationship ${i + 1} has invalid type "${rel.type}"`); continue }
    if (!isKebab(rel.target)) { fail(`${where}: relationship ${i + 1} has no valid target`); continue }
    edges.push({ type: rel.type as RelationshipType, target: rel.target, note: str(rel.note) })
  }

  const videos: Video[] = []
  for (const [i, v] of (Array.isArray(fm.videos) ? fm.videos : []).entries()) {
    const vid = v as Record<string, unknown>
    const video = { id: str(vid.id), title: str(vid.title), channel: str(vid.channel), verified: vid.verified }
    if (!video.id || !video.title || !video.channel || !isDate(video.verified)) {
      fail(`${where}: video ${i + 1} needs id, title, channel and verified (YYYY-MM-DD)`)
      continue
    }
    videos.push(video as Video)
  }

  let diagram: string | undefined
  if (fm.diagram != null) {
    const name = String(fm.diagram)
    const file = path.join(DIAGRAM_DIR, name)
    if (!name.endsWith('.svg') || !fs.existsSync(file)) {
      fail(`${where}: diagram "${name}" not found in content/diagrams/`)
    } else {
      const svg = fs.readFileSync(file, 'utf8').replace(/<\?xml[^>]*\?>/, '').replace(/<!DOCTYPE[^>]*>/i, '').trim()
      // DESIGN.md §5: diagrams take colour from tokens only.
      const literal = svg.match(/#[0-9a-f]{3,8}\b|\brgba?\(|\bhsla?\(/i)
      if (!svg.startsWith('<svg')) fail(`diagrams/${name}: not an SVG document`)
      else if (literal) fail(`diagrams/${name}: hardcoded colour "${literal[0]}" — use var(--…) tokens`)
      else diagram = svg
    }
  }

  parsed.set(id, {
    file: where,
    edges,
    sections,
    noGeneratedQuestions: fm.noGeneratedQuestions === true,
    entry: {
      id,
      term: String(fm.term ?? id),
      aliases,
      type,
      domains,
      industries,
      workflows: strList(fm.workflows),
      adoption: fm.adoption as Entry['adoption'],
      trend: fm.trend as Entry['trend'],
      trendNote: str(fm.trendNote),
      summary: String(fm.summary ?? '').trim(),
      videos,
      diagram,
      added: String(fm.added ?? ''),
      lastReviewed: String(fm.lastReviewed ?? ''),
    },
  })
}

const ids = new Set(parsed.keys())
const term = (id: string) => parsed.get(id)?.entry.term ?? id

// ── Relationships: validate, merge, resolve both directions ────────────────

const edges: GraphEdge[] = []
const edgeKeys = new Set<string>()

for (const [id, p] of parsed) {
  for (const e of p.edges) {
    if (!ids.has(e.target)) { fail(`${p.file}: ${e.type} target "${e.target}" doesn't exist`); continue }
    if (e.target === id) { fail(`${p.file}: ${e.type} points at itself`); continue }
    const key = `${e.type}|${id}|${e.target}`
    const reverse = `${e.type}|${e.target}|${id}`
    if (edgeKeys.has(key) || (e.type === 'alternative-to' && edgeKeys.has(reverse))) {
      warn('duplicate edge (merged)', `${p.file}: ${e.type} → ${e.target}`)
      continue
    }
    edgeKeys.add(key)
    edges.push({ source: id, target: e.target, type: e.type, note: e.note })
  }
}

const relations = new Map<string, ResolvedRelation[]>([...ids].map(id => [id, []]))
for (const e of edges) {
  relations.get(e.source)!.push({ kind: SOURCE_KIND[e.type], type: e.type, target: e.target, note: e.note })
  relations.get(e.target)!.push({ kind: TARGET_KIND[e.type], type: e.type, target: e.source, note: e.note })
}

// Directed adjacency for a single relationship type: source → targets.
function adjacency(type: RelationshipType) {
  const out = new Map<string, string[]>()
  for (const e of edges) if (e.type === type) out.set(e.source, [...(out.get(e.source) ?? []), e.target])
  return out
}
const prereqOf = adjacency('prerequisite-of') // A → things A is a prerequisite of
const prereqsFor = new Map<string, string[]>() // B → its direct prerequisites
for (const [a, bs] of prereqOf) for (const b of bs) prereqsFor.set(b, [...(prereqsFor.get(b) ?? []), a])

// prerequisite-of must be a DAG (SCHEMA §2.2).
{
  const state = new Map<string, 'visiting' | 'done'>()
  const visit = (id: string, trail: string[]) => {
    if (state.get(id) === 'done') return
    if (state.get(id) === 'visiting') {
      fail(`prerequisite cycle: ${[...trail.slice(trail.indexOf(id)), id].join(' → ')}`)
      return
    }
    state.set(id, 'visiting')
    for (const next of prereqOf.get(id) ?? []) visit(next, [...trail, id])
    state.set(id, 'done')
  }
  for (const id of ids) visit(id, [])
}
const hasCycle = errors.some(e => e.startsWith('prerequisite cycle'))

function closure(start: string, next: Map<string, string[]>) {
  const seen = new Set<string>()
  const stack = [...(next.get(start) ?? [])]
  while (stack.length) {
    const id = stack.pop()!
    if (seen.has(id)) continue
    seen.add(id)
    stack.push(...(next.get(id) ?? []))
  }
  return seen
}
const prereqAncestors = (id: string) => (hasCycle ? new Set<string>() : closure(id, prereqsFor))

const depthMemo = new Map<string, number>()
function prerequisiteDepth(id: string): number {
  if (hasCycle) return 0
  if (!depthMemo.has(id)) {
    const parents = prereqsFor.get(id) ?? []
    depthMemo.set(id, parents.length ? 1 + Math.max(...parents.map(prerequisiteDepth)) : 0)
  }
  return depthMemo.get(id)!
}

// ── Markdown with [[wiki-links]] ───────────────────────────────────────────

let currentFile = ''
const linked = new Set<string>()
const marked = new Marked({
  extensions: [{
    name: 'wikilink',
    level: 'inline',
    start: (src: string) => src.indexOf('[['),
    tokenizer(src: string) {
      const m = /^\[\[([^\]\s]+)\]\]/.exec(src)
      return m ? { type: 'wikilink', raw: m[0], id: m[1] } : undefined
    },
    renderer(token: Tokens.Generic) {
      const id = token.id as string
      if (!ids.has(id)) {
        fail(`${currentFile}: [[${id}]] links to an entry that doesn't exist`)
        return escapeHtml(token.raw)
      }
      linked.add(id)
      // App-relative href; the app prefixes the router base at render time.
      return `<a class="wikilink" data-entry="${id}" href="/term/${id}">${escapeHtml(term(id))}</a>`
    },
  }],
})
const render = (md: string) => marked.parse(md, { async: false }) as string

// ── Assemble entries ───────────────────────────────────────────────────────

const now = new Date()
const entries: Entry[] = []
const termPatterns = [...parsed.values()].map(p => ({
  id: p.entry.id,
  re: new RegExp(`\\b${p.entry.term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i'),
}))

for (const [id, p] of parsed) {
  currentFile = p.file
  linked.clear()
  const plain = render(p.sections.Plain ?? '')
  const plainLinks = new Set(linked)
  const technical = render(p.sections.Technical ?? '')
  const examples = p.sections.Examples?.trim() ? render(p.sections.Examples) : undefined

  // Missed cross-link: an unlinked mention of another entry's name in Plain.
  const plainText = htmlToText(plain)
  for (const { id: other, re } of termPatterns) {
    if (other !== id && !plainLinks.has(other) && re.test(plainText)) {
      warn('unlinked term in Plain (missed cross-link)', `${p.file}: mentions "${term(other)}" — link [[${other}]]?`)
    }
  }

  const rels = relations.get(id)!
  if (!rels.length) warn('no relationships', p.file)
  if (isDate(p.entry.lastReviewed) && monthsAgo(p.entry.lastReviewed, now) >= REVIEW_WARN_MONTHS) {
    warn(`lastReviewed older than ${REVIEW_WARN_MONTHS} months`, `${p.file}: ${p.entry.lastReviewed}`)
  }
  for (const v of p.entry.videos) {
    if (monthsAgo(v.verified, now) >= VIDEO_WARN_MONTHS) {
      warn(`video unverified for ${VIDEO_WARN_MONTHS}+ months`, `${p.file}: "${v.title}" (${v.verified})`)
    }
  }
  if (!p.entry.videos.length && !p.entry.diagram) warn('no video and no diagram', p.file)

  entries.push({
    ...p.entry,
    relations: rels,
    plain,
    technical,
    examples,
    text: `${plainText} ${htmlToText(technical)}`,
  })
}

entries.sort((a, b) => a.term.localeCompare(b.term))

for (const d of taxonomy.domains) {
  const n = entries.filter(e => e.domains.includes(d)).length
  if (n < MIN_CLUSTER_SIZE) warn(`domain with fewer than ${MIN_CLUSTER_SIZE} entries`, `${d}: ${n}`)
}

// ── Graph ──────────────────────────────────────────────────────────────────

const nodes: GraphNode[] = entries.map(e => ({
  id: e.id,
  cluster: e.domains[0],
  domains: e.domains,
  degree: e.relations.length,
  prerequisiteDepth: prerequisiteDepth(e.id),
}))

// ── Quiz: hand-written + generated (SCHEMA §3) ─────────────────────────────

const questions: QuizQuestion[] = []
const questionIds = new Set<string>()
const category = (entryId: string) => parsed.get(entryId)!.entry.domains[0]

const QUESTIONS_FILE = path.join(CONTENT, 'quizzes', 'questions.yaml')
if (fs.existsSync(QUESTIONS_FILE)) {
  const list = readYaml(QUESTIONS_FILE)
  if (list != null && !Array.isArray(list)) fail('quizzes/questions.yaml: must be a list of questions')
  for (const [i, raw] of (Array.isArray(list) ? list : []).entries()) {
    const q = raw as Record<string, unknown>
    const where = `quizzes/questions.yaml #${i + 1}${q.id ? ` (${q.id})` : ''}`
    const qid = str(q.id)
    if (!qid) { fail(`${where}: missing id`); continue }
    if (questionIds.has(qid)) { fail(`${where}: duplicate id`); continue }
    questionIds.add(qid)
    const entry = str(q.entry)
    if (!entry || !ids.has(entry)) { fail(`${where}: entry "${q.entry}" doesn't exist`); continue }
    const options = Array.isArray(q.options) ? q.options as Record<string, unknown>[] : []
    if (options.length < 2 || options.some(o => !str(o.text))) { fail(`${where}: needs at least 2 options, each with text`); continue }
    if (options.filter(o => o.correct === true).length !== 1) { fail(`${where}: needs exactly one option with correct: true`); continue }
    if (!str(q.prompt)) { fail(`${where}: missing prompt`); continue }
    if (!str(q.explanation)) { fail(`${where}: missing explanation`); continue }
    if (![1, 2, 3].includes(q.difficulty as number)) fail(`${where}: difficulty must be 1, 2 or 3`)
    if (!QUIZ_KINDS.includes(q.kind as string)) fail(`${where}: kind must be one of ${QUIZ_KINDS.join('|')}`)
    questions.push({
      id: qid,
      entry,
      category: category(entry),
      difficulty: q.difficulty as QuizQuestion['difficulty'],
      kind: q.kind as QuizQuestion['kind'],
      prompt: str(q.prompt)!,
      options: options.map(o => ({ text: str(o.text)!, ...(o.correct === true ? { correct: true } : {}) })),
      explanation: str(q.explanation)!,
      generated: false,
    })
  }
}

// Generated. Distractors share a domain with the correct answer but have no
// edge of the queried type to the subject (SCHEMA §3.2).
const suppressed = (id: string) => parsed.get(id)!.noGeneratedQuestions
const byId = new Map(entries.map(e => [e.id, e]))

function distractors(correct: string, exclude: Set<string>, seed: string): string[] | null {
  const domains = byId.get(correct)!.domains
  const pool = entries
    .filter(e => !exclude.has(e.id) && e.id !== correct && e.domains.some(d => domains.includes(d)))
    .map(e => e.id)
  if (pool.length < 3) return null
  return seededShuffle(pool, seed).slice(0, 3)
}

function addGenerated(
  template: NonNullable<QuizQuestion['template']>, qid: string, subject: string, correct: string,
  exclude: Set<string>, prompt: string, explanation: string,
) {
  if (suppressed(subject) || suppressed(correct) || questionIds.has(qid)) return
  const picks = distractors(correct, new Set([...exclude, subject]), qid)
  if (!picks) return
  questionIds.add(qid)
  questions.push({
    id: qid,
    entry: subject,
    category: category(subject),
    difficulty: 2,
    kind: 'relationship',
    prompt,
    options: seededShuffle([
      { text: term(correct), entry: correct, correct: true },
      ...picks.map(id => ({ text: term(id), entry: id })),
    ], `${qid}:order`),
    explanation,
    generated: true,
    template,
  })
}

const partsOf = new Map<string, string[]>() // whole → direct parts
for (const e of edges) if (e.type === 'part-of') partsOf.set(e.target, [...(partsOf.get(e.target) ?? []), e.source])
const alternativesOf = (id: string) =>
  new Set(edges.filter(e => e.type === 'alternative-to' && (e.source === id || e.target === id))
    .map(e => (e.source === id ? e.target : e.source)))
const withNote = (text: string, note?: string) => (note ? `${text} ${note}` : text)

for (const e of edges) {
  const a = byId.get(e.source)!
  const b = byId.get(e.target)!
  if (e.type === 'prerequisite-of') {
    // Anything upstream of B is also a correct answer, so never a distractor.
    addGenerated('prerequisite', `gen-prereq-${a.id}-${b.id}`, b.id, a.id, prereqAncestors(b.id),
      `Which should you understand before ${b.term}?`,
      withNote(`${a.term} comes first. ${a.summary}`, e.note))
  } else if (e.type === 'part-of') {
    addGenerated('component', `gen-part-${a.id}-${b.id}`, b.id, a.id, closure(b.id, partsOf),
      `Which of these is part of ${b.term}?`,
      withNote(`${a.term} is a component of ${b.term}. ${a.summary}`, e.note))
  } else if (e.type === 'alternative-to') {
    addGenerated('alternative', `gen-alt-${a.id}-${b.id}`, a.id, b.id, alternativesOf(a.id),
      `${a.term} is an alternative approach to which of these?`,
      withNote(`${a.term} and ${b.term} solve the same problem differently. ${b.summary}`, e.note))
  }
}

// ── Learning paths (SCHEMA §4) ─────────────────────────────────────────────

const paths: LearningPath[] = []
const PATH_DIR = path.join(CONTENT, 'paths')
for (const file of fs.existsSync(PATH_DIR) ? fs.readdirSync(PATH_DIR).filter(f => /\.ya?ml$/.test(f)).sort() : []) {
  const where = `paths/${file}`
  const p = (readYaml(path.join(PATH_DIR, file)) ?? {}) as Record<string, unknown>
  const id = p.id
  if (!isKebab(id) || id !== file.replace(/\.ya?ml$/, '')) { fail(`${where}: id must be kebab-case and match the filename`); continue }
  if (!str(p.title) || !str(p.description)) fail(`${where}: needs title and description`)
  if (!AUDIENCES.includes(p.audience as string)) fail(`${where}: audience must be one of ${AUDIENCES.join('|')}`)
  if (typeof p.estimatedMinutes !== 'number') fail(`${where}: estimatedMinutes must be a number`)
  const assumesKnown = strList(p.assumesKnown)
  for (const a of assumesKnown) if (!ids.has(a)) fail(`${where}: assumesKnown "${a}" doesn't exist`)

  const steps: PathStep[] = []
  const covered = new Set<string>(assumesKnown)
  for (const [i, raw] of (Array.isArray(p.steps) ? p.steps : []).entries()) {
    const s = raw as Record<string, unknown>
    if (s.checkpoint === 'quiz') {
      const cat = str(s.category)
      if (cat && !taxonomy.domains.includes(cat)) fail(`${where}: step ${i + 1} checkpoint category "${cat}" not in taxonomy`)
      steps.push({ checkpoint: 'quiz', ...(cat ? { category: cat } : {}) })
      continue
    }
    const entry = str(s.entry)
    if (!entry || !ids.has(entry)) { fail(`${where}: step ${i + 1} entry "${s.entry}" doesn't exist`); continue }
    const missing = [...prereqAncestors(entry)].filter(a => !covered.has(a))
    if (missing.length) {
      fail(`${where}: step ${i + 1} (${entry}) needs ${missing.join(', ')} earlier in the path or in assumesKnown`)
    }
    covered.add(entry)
    steps.push({ entry, ...(str(s.note) ? { note: str(s.note) } : {}) })
  }
  if (!steps.length) fail(`${where}: has no steps`)
  paths.push({
    id,
    title: str(p.title) ?? id,
    description: str(p.description) ?? '',
    audience: p.audience as LearningPath['audience'],
    estimatedMinutes: Number(p.estimatedMinutes) || 0,
    steps,
    assumesKnown,
  })
}

// ── Report and write ───────────────────────────────────────────────────────

for (const [group, list] of warnings) {
  console.warn(`⚠ ${group} (${list.length})`)
  for (const msg of list) console.warn(`    ${msg}`)
}

if (errors.length) {
  console.error(`\n✗ Content build failed with ${errors.length} error(s):`)
  for (const e of errors) console.error(`    ${e}`)
  process.exit(1)
}

const buildTime = now.toISOString().replace(/\.\d{3}Z$/, 'Z')
const glossary: Glossary = { buildTime, entryCount: entries.length, entries, taxonomy }
const graph: Graph = { buildTime, nodes, edges }
const quiz: Quiz = { buildTime, questions }
const pathsOut: Paths = { buildTime, paths }

fs.mkdirSync(OUT, { recursive: true })
for (const [name, data] of Object.entries({ glossary, graph, quiz, paths: pathsOut })) {
  fs.writeFileSync(path.join(OUT, `${name}.json`), JSON.stringify(data))
}

const generated = questions.filter(q => q.generated).length
console.log(
  `✓ ${entries.length} entries, ${edges.length} edges, ` +
  `${questions.length} questions (${questions.length - generated} hand-written, ${generated} generated), ` +
  `${paths.length} paths → public/data/`,
)
