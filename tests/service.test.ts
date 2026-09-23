import { copyFileSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { LyricsCache, cacheKey } from '../src/main/lyrics/cache'
import { LocalLyrics } from '../src/main/lyrics/local'
import type { FindResult, LrclibClient } from '../src/main/lyrics/lrclib'
import type { LrclibRecord, TrackQuery } from '../src/main/lyrics/match'
import { LyricsService, recordToTimedLyrics } from '../src/main/lyrics/service'

const fixtures = join(__dirname, 'fixtures')
const lrc = readFileSync(join(fixtures, 'original-song.lrc'), 'utf8')
const yamlDoc = readFileSync(join(fixtures, 'original-song.lyricsfile.yaml'), 'utf8')
const query: TrackQuery = { title: 'Paper Lanterns', artist: 'Wordlit Test Band', album: 'Fixtures', durationMs: 32_000 }

const record = (over: Partial<LrclibRecord> = {}): LrclibRecord => ({
  id: 1,
  trackName: 'Paper Lanterns',
  artistName: 'Wordlit Test Band',
  albumName: 'Fixtures',
  duration: 32,
  instrumental: false,
  plainLyrics: 'x',
  syncedLyrics: lrc,
  lyricsfile: null,
  ...over
})

function setup(find: () => Promise<FindResult>) {
  const base = mkdtempSync(join(tmpdir(), 'wordlit-service-'))
  const local = new LocalLyrics(join(base, 'local'))
  const cache = new LyricsCache(join(base, 'cache'))
  const client = { find: vi.fn(find) } as unknown as LrclibClient & { find: ReturnType<typeof vi.fn> }
  const service = new LyricsService({ local, cache, client, log: () => {} })
  return { base, local, cache, client, service }
}

describe('recordToTimedLyrics', () => {
  it('prefers the lyricsfile, then synced lyrics', () => {
    const fromYaml = recordToTimedLyrics(record({ lyricsfile: yamlDoc }), 32_000)
    expect(fromYaml?.lines).toHaveLength(3)
    const fromLrc = recordToTimedLyrics(record(), 32_000)
    expect(fromLrc?.lines).toHaveLength(8)
  })

  it('falls back to synced lyrics when the lyricsfile is broken', () => {
    expect(recordToTimedLyrics(record({ lyricsfile: 'lines: [' }), 32_000)?.lines).toHaveLength(8)
  })

  it('returns null without timed text', () => {
    expect(recordToTimedLyrics(record({ syncedLyrics: null }), 32_000)).toBeNull()
  })
})

describe('LyricsService.get', () => {
  it('uses a local .lrc file before the network', async () => {
    const s = setup(async () => ({ status: 'not-found' }))
    await s.local.ensureDir()
    copyFileSync(join(fixtures, 'original-song.lrc'), join(s.base, 'local', 'Wordlit Test Band - Paper Lanterns.lrc'))
    const result = await s.service.get(query)
    expect(result).toMatchObject({ status: 'found', source: 'local' })
    expect(s.client.find).not.toHaveBeenCalled()
  })

  it('fetches, caches and then serves from the cache', async () => {
    const s = setup(async () => ({ status: 'found', record: record() }))
    expect(await s.service.get(query)).toMatchObject({ status: 'found', source: 'lrclib' })
    expect(await s.service.get(query)).toMatchObject({ status: 'found', source: 'cache' })
    expect(s.client.find).toHaveBeenCalledTimes(1)
  })

  it('remembers not-found without asking again', async () => {
    const s = setup(async () => ({ status: 'not-found' }))
    expect((await s.service.get(query)).status).toBe('not-found')
    expect((await s.service.get(query)).status).toBe('not-found')
    expect(s.client.find).toHaveBeenCalledTimes(1)
  })

  it('reports instrumental tracks', async () => {
    const s = setup(async () => ({ status: 'found', record: record({ instrumental: true, syncedLyrics: null }) }))
    expect(await s.service.get(query)).toMatchObject({ status: 'instrumental', lyrics: null })
  })

  it('does not cache errors', async () => {
    const s = setup(async () => ({ status: 'error', message: 'busy' }))
    expect((await s.service.get(query)).status).toBe('error')
    expect(await s.cache.get(cacheKey(query))).toBeNull()
    await s.service.get(query)
    expect(s.client.find).toHaveBeenCalledTimes(2)
  })

  it('treats a found record without usable timing as not-found', async () => {
    const s = setup(async () => ({ status: 'found', record: record({ syncedLyrics: '[ar:only metadata]' }) }))
    expect((await s.service.get(query)).status).toBe('not-found')
  })
})
