import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { LrclibRecord, TrackQuery } from './match'
import { cleanTitle, normalizeForMatch, primaryArtist } from './normalize'

export interface CacheEntry {
  status: 'found' | 'not-found' | 'instrumental'
  record?: LrclibRecord
  fetchedAt: number
}

const NOT_FOUND_TTL_MS = 3 * 24 * 60 * 60 * 1000

/** Same song → same key, even across players that format credits differently. */
export function cacheKey(q: TrackQuery): string {
  const durationBucket = q.durationMs > 0 ? Math.round(q.durationMs / 2000) : 0
  const identity = `${normalizeForMatch(primaryArtist(q.artist))}|${normalizeForMatch(cleanTitle(q.title))}|${durationBucket}`
  return createHash('sha1').update(identity).digest('hex')
}

const isEntry = (v: unknown): v is CacheEntry =>
  typeof v === 'object' &&
  v !== null &&
  ['found', 'not-found', 'instrumental'].includes((v as CacheEntry).status) &&
  typeof (v as CacheEntry).fetchedAt === 'number'

/** One JSON file per song in `dir`. Not-found answers expire so new uploads get picked up. */
export class LyricsCache {
  constructor(
    private readonly dir: string,
    private readonly now: () => number = Date.now
  ) {}

  async get(key: string): Promise<CacheEntry | null> {
    let entry: unknown
    try {
      entry = JSON.parse(await readFile(this.file(key), 'utf8'))
    } catch {
      return null
    }
    if (!isEntry(entry)) return null
    if (entry.status === 'not-found' && this.now() - entry.fetchedAt > NOT_FOUND_TTL_MS) return null
    return entry
  }

  async set(key: string, entry: CacheEntry): Promise<void> {
    await mkdir(this.dir, { recursive: true })
    const target = this.file(key)
    const tmp = `${target}.${process.pid}.tmp`
    await writeFile(tmp, JSON.stringify(entry), 'utf8')
    await rename(tmp, target)
  }

  private file(key: string): string {
    return join(this.dir, `${key.replace(/[^0-9a-z]/gi, '')}.json`)
  }
}
