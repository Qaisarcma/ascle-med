import { cleanTitle, normalizeForMatch, primaryArtist } from './normalize'

/** A record as returned by lrclib.net `/api/get` and `/api/search`. */
export interface LrclibRecord {
  id: number
  trackName: string
  artistName: string
  albumName: string | null
  /** Seconds. */
  duration: number
  instrumental: boolean
  plainLyrics: string | null
  syncedLyrics: string | null
  lyricsfile?: string | null
}

export interface TrackQuery {
  title: string
  artist: string
  album: string
  durationMs: number
}

/** Minimum score for a candidate to be trusted. */
export const MIN_SCORE = 0.55
const MAX_DURATION_GAP_S = 8
const EXACT_DURATION_S = 2

const words = (s: string): string[] => normalizeForMatch(s).split(' ').filter(Boolean)

function dice<T>(a: T[], b: T[]): number {
  if (!a.length || !b.length) return 0
  const pool = [...b]
  let common = 0
  for (const item of a) {
    const i = pool.indexOf(item)
    if (i >= 0) {
      common++
      pool.splice(i, 1)
    }
  }
  return (2 * common) / (a.length + b.length)
}

function bigrams(s: string): string[] {
  const chars = Array.from(normalizeForMatch(s).replace(/ /g, ''))
  if (chars.length < 2) return chars
  return chars.slice(1).map((c, i) => chars[i] + c)
}

/** Word overlap for Latin text, character bigrams for scripts written without spaces. */
const similarity = (a: string, b: string): number => Math.max(dice(words(a), words(b)), dice(bigrams(a), bigrams(b)))

export const hasTiming = (r: LrclibRecord): boolean =>
  !!r.syncedLyrics?.trim() || !!(r.lyricsfile && /start_ms\s*:/.test(r.lyricsfile))

/** 0…1 confidence that `r` is the queried recording; -Infinity when it cannot be used. */
export function scoreCandidate(q: TrackQuery, r: LrclibRecord): number {
  if (!r.instrumental && !hasTiming(r)) return Number.NEGATIVE_INFINITY

  let durationScore = 0.5
  if (q.durationMs > 0 && r.duration > 0) {
    const gap = Math.abs(q.durationMs / 1000 - r.duration)
    if (gap > MAX_DURATION_GAP_S) return Number.NEGATIVE_INFINITY
    durationScore = gap <= EXACT_DURATION_S ? 1 : 1 - (gap - EXACT_DURATION_S) / (MAX_DURATION_GAP_S - EXACT_DURATION_S)
  }

  const title = Math.max(similarity(q.title, r.trackName), similarity(cleanTitle(q.title), cleanTitle(r.trackName)))
  const artist = Math.max(
    similarity(q.artist, r.artistName),
    similarity(primaryArtist(q.artist), primaryArtist(r.artistName))
  )
  return 0.45 * title + 0.3 * artist + 0.25 * durationScore
}

export function pickBest(q: TrackQuery, records: LrclibRecord[]): LrclibRecord | null {
  let best: LrclibRecord | null = null
  let bestScore = MIN_SCORE
  for (const r of records) {
    const score = scoreCandidate(q, r)
    // Among equals, prefer a record that has timing over an instrumental placeholder.
    if (score > bestScore || (score === bestScore && best && !hasTiming(best) && hasTiming(r))) {
      best = r
      bestScore = score
    }
  }
  return best
}
