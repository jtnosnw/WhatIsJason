import type { Adoption, EntryType, LearningPath, RelationKind, Trend } from './content-types.ts'

export const domainLabel = (d: string) => d.charAt(0).toUpperCase() + d.slice(1)

export const TYPE_LABEL: Record<EntryType, string> = {
  concept: 'Concept',
  technique: 'Technique',
  technology: 'Technology',
  system: 'System',
  workflow: 'Workflow',
  parameter: 'Parameter',
}

export const ADOPTION_LABEL: Record<Adoption, string> = {
  foundational: 'Foundational',
  established: 'Established',
  emerging: 'Emerging',
  experimental: 'Experimental',
}

export const TREND_LABEL: Record<Trend, string> = {
  rising: 'Rising',
  steady: 'Steady',
  cooling: 'Cooling',
}

// SCHEMA §2.1 display labels, in the order groups appear on an entry page:
// what to learn first, what it's made of, then what it connects to.
export const RELATION_GROUPS: { kind: RelationKind; label: string }[] = [
  { kind: 'learn-first', label: 'Learn first' },
  { kind: 'part-of', label: 'Part of' },
  { kind: 'components', label: 'Components' },
  { kind: 'alternatives', label: 'Alternatives' },
  { kind: 'uses', label: 'Uses' },
  { kind: 'used-in', label: 'Used in' },
  { kind: 'implements', label: 'Implements' },
  { kind: 'implementations', label: 'Implementations' },
  { kind: 'leads-to', label: 'Leads to' },
]

/** A YYYY-MM-DD content date, read as a calendar date in the user's timezone. */
function calendarDate(ymd: string) {
  const [y, m, d] = ymd.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const formatDate = (ymd: string) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' }).format(calendarDate(ymd))

/** A UTC ISO timestamp, rendered in the user's local timezone (SPEC §4.8). */
export const formatDateTime = (iso: string | Date) =>
  new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

export function formatDuration(ms: number) {
  const s = Math.round(ms / 1000)
  return s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`
}

/** SPEC §4.8: entries unreviewed for 6+ months get a quiet marker. */
export function isStale(lastReviewed: string, now = new Date()) {
  const cutoff = new Date(now)
  cutoff.setMonth(cutoff.getMonth() - 6)
  return calendarDate(lastReviewed) <= cutoff
}

export const AUDIENCE_LABEL: Record<LearningPath['audience'], string> = {
  'beginner': 'Beginner',
  'practical': 'Practical',
  'technical': 'Technical',
  'decision-maker': 'Decision-maker',
}
