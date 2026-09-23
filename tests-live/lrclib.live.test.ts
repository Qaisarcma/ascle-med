// Opt-in check against the real lrclib.net service: `npm run check:lrclib`.
// Asserts on metadata only (found / line count / timing type) and never prints lyric text.
import { mkdtempSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LyricsCache } from '../src/main/lyrics/cache'
import { LocalLyrics } from '../src/main/lyrics/local'
import { LrclibClient } from '../src/main/lyrics/lrclib'
import type { TrackQuery } from '../src/main/lyrics/match'
import { LyricsService } from '../src/main/lyrics/service'

const base = mkdtempSync(join(tmpdir(), 'wordlit-live-'))
const service = new LyricsService({
  local: new LocalLyrics(join(base, 'none')),
  cache: new LyricsCache(join(base, 'cache')),
  client: new LrclibClient({ userAgent: 'Wordlit/0.1.0 (Windows lyrics overlay; live check)' }),
  log: () => {}
})

const popular: (TrackQuery & { label: string })[] = [
  { label: 'Blinding Lights', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', durationMs: 200_000 },
  { label: 'Shape of You', title: 'Shape of You', artist: 'Ed Sheeran', album: '÷ (Deluxe)', durationMs: 233_700 },
  { label: 'Levitating (feat. credit, remaster noise)', title: 'Levitating (feat. DaBaby)', artist: 'Dua Lipa, DaBaby', album: '', durationMs: 203_000 }
]

describe('lrclib.net (live)', () => {
  for (const track of popular) {
    it(`finds synced lyrics: ${track.label}`, async () => {
      const result = await service.get(track)
      console.log(
        `${track.label}: ${result.status}${result.lyrics ? `, ${result.lyrics.lines.length} lines, ${result.lyrics.wordTiming} word timing` : ''}`
      )
      expect(result.status).toBe('found')
      expect(result.lyrics!.lines.length).toBeGreaterThan(10)
      for (const line of result.lyrics!.lines) {
        expect(line.words.length).toBeGreaterThan(0)
        expect(line.words[0]!.start).toBe(line.start)
      }
    }, 60_000)
  }

  it('reports a clearly unknown song as not-found', async () => {
    const result = await service.get({ title: 'Zzqx Wordlit Nonexistent Song', artist: 'Nobody Qqz', album: '', durationMs: 123_000 })
    expect(result.status).toBe('not-found')
  }, 60_000)
})
