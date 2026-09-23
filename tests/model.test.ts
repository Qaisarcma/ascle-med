import { describe, expect, it } from 'vitest'
import { activeLineIndex, activeWordIndex, buildModel } from '../src/renderer/src/stage/model'
import type { TimedLyrics } from '../src/shared/types'

const lyrics: TimedLyrics = {
  wordTiming: 'estimated',
  lines: [
    {
      text: 'one two',
      start: 1000,
      end: 2000,
      words: [
        { text: 'one', start: 1000, end: 1500 },
        { text: 'two', start: 1500, end: 2000 }
      ]
    },
    {
      text: 'three',
      start: 5000,
      end: 6000,
      words: [{ text: 'three', start: 5000, end: 6000 }]
    }
  ]
}

describe('buildModel', () => {
  it('flattens words with line and global indices', () => {
    const model = buildModel(lyrics)
    expect(model.words.map((w) => [w.text, w.line, w.indexInLine, w.global])).toEqual([
      ['one', 0, 0, 0],
      ['two', 0, 1, 1],
      ['three', 1, 0, 2]
    ])
  })
})

describe('activeWordIndex', () => {
  const model = buildModel(lyrics)
  it('is -1 before the first word', () => {
    expect(activeWordIndex(model, 999)).toBe(-1)
  })
  it('switches exactly at word starts', () => {
    expect(activeWordIndex(model, 1000)).toBe(0)
    expect(activeWordIndex(model, 1499)).toBe(0)
    expect(activeWordIndex(model, 1500)).toBe(1)
  })
  it('holds the last sung word through gaps and after the end', () => {
    expect(activeWordIndex(model, 4000)).toBe(1)
    expect(activeWordIndex(model, 99_000)).toBe(2)
  })
  it('handles an empty model', () => {
    expect(activeWordIndex(buildModel({ lines: [], wordTiming: 'estimated' }), 5)).toBe(-1)
  })
})

describe('activeLineIndex', () => {
  const model = buildModel(lyrics)
  it('follows line starts', () => {
    expect(activeLineIndex(model, 500)).toBe(-1)
    expect(activeLineIndex(model, 1200)).toBe(0)
    expect(activeLineIndex(model, 4999)).toBe(0)
    expect(activeLineIndex(model, 5000)).toBe(1)
  })
})
