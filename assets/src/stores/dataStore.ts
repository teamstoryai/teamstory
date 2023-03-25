import { API } from '@/api'
import { config } from '@/config'
import { Repository } from '@/models'
import github from '@/query/github'
import linear from '@/query/linear'
import { connectStore } from '@/stores/connectStore'
import { initFakeData } from '@/stores/fakeData'
import { projectStore } from '@/stores/projectStore'
import { tokenStore } from '@/stores/tokenStore'
import { assertIsDefined } from '@/utils'
import { add, format, isMonday, isSameYear, previousMonday, sub } from 'date-fns'
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

type Cache<T> = { [key: string]: T }

class DataStore {
  // --- stores

  initialized = atom(false)

  cache: Cache<any> = {}

  inProgress: Cache<Promise<any>> = {}

  // --- variables

  fakeMode = false

  // --- actions

  cacheRead = async <T>(key: string, fetch: () => Promise<T>): Promise<T> => {
    if (this.cache[key]) {
      return this.cache[key]
    } else if (this.inProgress[key] != undefined) {
      return await this.inProgress[key]
    } else {
      if (this.fakeMode) throw new Error('unhandled fake data ' + key)
      try {
        const promise = (this.inProgress[key] = fetch())
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
  }

  initTokens = async () => {
    projectStore.addListener(() => {
      const shouldSetInitialized = this.initialized.get()
      if (shouldSetInitialized) this.initialized.set(false)
      this.cache = {}
      this.inProgress = {}
      if (shouldSetInitialized) setTimeout(() => this.initialized.set(true), 10)
    })
    initFakeData()

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
}

export const dataStore = new DataStore()
if (config.dev) (window as any)['dataStore'] = dataStore

export function pastTwoWeeksDates(start: Date) {
  const keyMonday = isMonday(start) ? start : previousMonday(start)
  const startDate = sub(keyMonday, { weeks: 2 })
  const endDate = add(startDate, { days: 13 })
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
