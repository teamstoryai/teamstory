import { atom } from 'nanostores'

import { API } from '@/api'
import { OAuthToken, Project } from '@/models'
import { authStore } from '@/stores/authStore'

class TokenStore {
  // --- stores

  tokens = atom<OAuthToken[]>([])

  // --- actions

  fetchTokens = async (project: Project) => {
    if (authStore.debugMode()) (window as any)['tokenStore'] = tokenStore

    const response = await API.getMultipleOAuthTokens(['github', 'gitlab', 'linear', 'jira'])
    this.tokens.set(response.items)
    return response.items
  }

  addToken = (token: OAuthToken) => {
    const tokens = this.tokens.get()
    this.tokens.set([...tokens, token])
  }

  connectToken = async (redirect: string, code: string, service: string) => {
    const response = await API.connectOAuthToken(redirect, code, service)
    this.addToken(response.item)
    return response.item
  }
}

export const tokenStore = new TokenStore()
