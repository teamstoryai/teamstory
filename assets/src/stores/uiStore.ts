import { atom } from 'nanostores'

import { config } from '@/config'
import { User } from '@/models'
import { authStore } from '@/stores/authStore'
import { topicStore } from '@/stores/topicStore'
import tracker from '@/stores/tracker'
import { tokenStore } from '@/stores/tokenStore'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'

const SLEEP_CHECK_INTERVAL = 30_000

export const REFRESH_INTERVAL = 86400000

type BeforeInstallPromptEvent = Event & {
  prompt: () => void
}

class UIStore {
  // --- stores

  sidebarMenuOpen = atom<boolean>(false)

  sidebarHidden = atom<boolean>(false)

  calendarDate = atom<Date>(new Date())

  initialized = atom<boolean>(false)

  loadedAt: number = Date.now()

  // --- actions

  initLoggedInUser = (user: User) => {
    tracker.init(user)

    if (authStore.debugMode()) (window as any)['uiStore'] = uiStore
    topicStore.initTopicflow()

    if (!user.timezone) {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      authStore.updateUser({ timezone })
    }

    Promise.all([
      tokenStore.fetchTokens().then(() => dataStore.initTokens()),
      connectStore.loadConnectedRepos(),
    ]).then(() => this.initialized.set(true))
  }
}

export const uiStore = new UIStore()
if (config.dev) (window as any)['uiStore'] = uiStore
