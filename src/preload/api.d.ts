import type { WordlitApi } from '../shared/ipc'

declare global {
  interface Window {
    wordlit: WordlitApi
  }
}

export {}
