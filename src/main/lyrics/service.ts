import type { TimedLyrics } from '@shared/types'
import { LyricsCache, cacheKey, type CacheEntry } from './cache'
import type { LocalLyrics } from './local'
import { parseLrc } from './lrc'
import type { LrclibClient } from './lrclib'
import { parseLyricsfile } from './lyricsfile'
import type { LrclibRecord, TrackQuery } from './match'
import { buildTimedLyrics } from './word-timing'

export interface LyricsResult {
  status: 'found' | 'not-found' | 'instrumental' | 'error'
  lyrics: TimedLyrics | null
  source?: 'local' | 'cache' | 'lrclib'
}

/** Prefers the `lyricsfile` (it may carry real line ends or word timing), then LRC. */
export function recordToTimedLyrics(r: LrclibRecord, durationMs: number): TimedLyrics | null {
  const duration = durationMs > 0 ? durationMs : r.duration > 0 ? Math.round(r.duration * 1000) : undefined
  if (r.lyricsfile) {
    const lines = parseLyricsfile(r.lyricsfile)
    const timed = lines && buildTimedLyrics(lines, duration)
    if (timed) return timed
  }
  return r.syncedLyrics ? buildTimedLyrics(parseLrc(r.syncedLyrics), duration) : null
}

export interface LyricsServiceDeps {
  local: LocalLyrics
  cache: LyricsCache
  client: LrclibClient
  log: (message: string) => void
  now?: () => number
}

/** Local `.lrc` → disk cache → LRCLIB. Errors are never cached, so the next play retries. */
export class LyricsService {
  private readonly now: () => number

  constructor(private readonly deps: LyricsServiceDeps) {
    this.now = deps.now ?? Date.now
  }

  async get(q: TrackQuery): Promise<LyricsResult> {
    const local = await this.fromLocal(q)
    if (local) return local

    const key = cacheKey(q)
    const cached = await this.deps.cache.get(key)
    if (cached) return this.fromEntry(cached, q, 'cache')

    const found = await this.deps.client.find(q)
    if (found.status === 'error') {
      this.deps.log(`lyrics: lrclib error (${found.message})`)
      return { status: 'error', lyrics: null }
    }

    let entry: CacheEntry
    if (found.status === 'not-found') entry = { status: 'not-found', fetchedAt: this.now() }
    else if (found.record.instrumental) entry = { status: 'instrumental', record: found.record, fetchedAt: this.now() }
    else if (!recordToTimedLyrics(found.record, q.durationMs)) entry = { status: 'not-found', fetchedAt: this.now() }
    else entry = { status: 'found', record: found.record, fetchedAt: this.now() }

    await this.deps.cache.set(key, entry).catch((err: unknown) => this.deps.log(`lyrics: cache write failed (${String(err)})`))
    return this.fromEntry(entry, q, 'lrclib')
  }

  private async fromLocal(q: TrackQuery): Promise<LyricsResult | null> {
    try {
      const text = await this.deps.local.find(q)
      if (!text) return null
      const lyrics = buildTimedLyrics(parseLrc(text), q.durationMs > 0 ? q.durationMs : undefined)
      if (lyrics) return { status: 'found', lyrics, source: 'local' }
      this.deps.log('lyrics: local file had no timed lines, ignoring it')
    } catch (err) {
      this.deps.log(`lyrics: local lookup failed (${String(err)})`)
    }
    return null
  }

  private fromEntry(entry: CacheEntry, q: TrackQuery, source: 'cache' | 'lrclib'): LyricsResult {
    if (entry.status === 'instrumental') return { status: 'instrumental', lyrics: null, source }
    const lyrics = entry.status === 'found' && entry.record ? recordToTimedLyrics(entry.record, q.durationMs) : null
    return lyrics ? { status: 'found', lyrics, source } : { status: 'not-found', lyrics: null, source }
  }
}
