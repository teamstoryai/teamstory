import { action, atom, map } from 'nanostores'
import { route } from 'preact-router'

import { API, ProjectResponse, ProjectWithMembersResponse } from '@/api'
import { paths } from '@/config'
import { OAuthToken, Project, User } from '@/models'
import { authStore } from '@/stores/authStore'
import { uiStore } from '@/stores/uiStore'
import { logger } from '@/utils'

class TokenStore {
  // --- stores

  tokens = atom<OAuthToken[]>([])

  // --- actions

  fetchTokens = async () => {
    if (authStore.debugMode()) (window as any)['tokenStore'] = tokenStore

    const response = await API.getMultipleOAuthTokens(['github', 'gitlab'])
    this.tokens.set(response.tokens)
    return response.tokens
  }

  addToken = (token: OAuthToken) => {
    const tokens = this.tokens.get()
    this.tokens.set([...tokens, token])
  }
}

export const tokenStore = new TokenStore()
