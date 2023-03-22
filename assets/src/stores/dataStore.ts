import { API } from '@/api'
import { config } from '@/config'
import { Repository } from '@/models'
import github from '@/query/github'
import { connectStore } from '@/stores/connectStore'
import { projectStore } from '@/stores/projectStore'
import { tokenStore } from '@/stores/tokenStore'
import { assertIsDefined } from '@/utils'
import { atom } from 'nanostores'

type User = {
  avatar_url: string
  login: string
}

type PullRequest = {
  title: string
  user: User
  url: string
  closed_at: string
  updated_at: string
  created_at: string
  merged_at: string
  draft: boolean
  state: string
}

type Cache = { [key: string]: any }

class DataStore {
  // --- stores

  initialized = atom(false)

  cache: Cache = {}

  // --- actions

  cacheRead = async (key: string, fetch: () => Promise<any>) => {
    if (this.cache[key]) {
      return this.cache[key]
    } else {
      const result = await fetch()
      this.cache[key] = result
      return result
    }
  }

  clear = (key: string) => {
    delete this.cache[key]
  }

  initTokens = async () => {
    const tokens = tokenStore.tokens.get()
    console.log('init tokens', tokens)
    tokens.forEach((token) => {
      if (token.name == 'github') {
        github.setToken(token.access)
      }
    })
    this.initialized.set(true)
  }
}

export const dataStore = new DataStore()
if (config.dev) (window as any)['dataStore'] = dataStore
