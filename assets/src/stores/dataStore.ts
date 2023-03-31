import { config } from '@/config'
import github from '@/query/github'
import linear from '@/query/linear'
import { tokenStore } from '@/stores/tokenStore'
import { add, format, isMonday, isSameYear, previousMonday, sub } from 'date-fns'
import { atom } from 'nanostores'
import { get, set, del } from 'idb-keyval'
import { projectStore } from '@/stores/projectStore'
import { logger } from '@/utils'

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

type Cache<T> = { [key: string]: T }

type IDBCacheEntry = {
  d: any
  t: number
}

const IDB_CACHE_TTL = 1000 * 60 * 10 // 10 minutes

class DataStore {
  // --- stores

  initialized = atom(false)

  cache: Cache<any> = {}

  inProgress: Cache<Promise<any>> = {}

  dataById: Cache<any> = {}

  // --- variables

  fakeMode = false

  // --- actions

  cacheRead = async <T>(key: string, fetch: () => Promise<T>, ttl?: number): Promise<T> => {
    if (this.cache[key]) {
      return this.cache[key]
    } else if (this.inProgress[key] != undefined) {
      return await this.inProgress[key]
    } else {
      if (this.fakeMode) throw new Error('unhandled fake data ' + key)

      const project = projectStore.currentProject.get()!
      const idbKey = `${project.id}:${key}`

      const readHelper = async () => {
        const cached = await get<IDBCacheEntry>(idbKey)
        logger.debug('read', idbKey, cached, cached ? Date.now() - cached.t : '-')
        if (cached) {
          const now = Date.now()
          if (now - cached.t < (ttl || IDB_CACHE_TTL)) {
            return cached.d
          }
        }
        try {
          const result = await fetch()
          logger.debug('fetch returned', key, result)
          set(idbKey, { d: result, t: Date.now() })
        } catch (e) {
          logger.error(e)
          // if we fail to fetch, return the cached value
          if (cached?.d) return cached.d
          throw e
        }
      }

      try {
        const promise = (this.inProgress[key] = readHelper())
        const result = await promise
        this.cache[key] = result
        return result
      } finally {
        delete this.inProgress[key]
      }
    }
  }

  clear = (key: string) => {
    if (this.fakeMode) return
    delete this.cache[key]

    const project = projectStore.currentProject.get()!
    const idbKey = `${project.id}:${key}`
    del(idbKey)
  }

  clearAll = () => {
    this.cache = {}
    this.inProgress = {}
  }

  initTokens = () => {
    const tokens = tokenStore.tokens.get()
    tokens.forEach((token) => {
      if (token.name == 'github') {
        github.setToken(token.access)
      } else if (token.name == 'linear') {
        linear.setToken(token.access)
      }
    })
    this.initialized.set(true)
  }

  storeData = (key: string | undefined, data: any) => {
    if (key) this.dataById[key] = data
  }
}

export const dataStore = new DataStore()
if (config.dev) (window as any)['dataStore'] = dataStore

export function pastTwoWeeksDates(start: Date) {
  const keyMonday = isMonday(start) ? start : previousMonday(start)
  const startDate = sub(keyMonday, { weeks: 2 })
  const endDate = add(startDate, { days: 14 })
  return { startDate, endDate }
}

export function dateToYMD(date: Date) {
  return format(date, 'yyyy-MM-dd')
}

export function dateToHumanDate(date: Date, referenceDate: Date) {
  const localeFormat = 'ccc MMM d' + (isSameYear(date, referenceDate) ? '' : ', yyyy')
  return format(date, localeFormat)
}

export function renderDates(startDate: Date, endDate: Date, today: Date) {
  const [startDateStr, endDateStr] = [startDate, endDate].map(dateToYMD)
  const startDateHuman = dateToHumanDate(startDate, endDate)
  const endDateHuman = dateToHumanDate(endDate, today)
  return { startDateStr, endDateStr, startDateHuman, endDateHuman }
}
