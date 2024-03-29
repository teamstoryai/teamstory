import { atom } from 'nanostores'

import { API } from '@/api'
import { OAuthToken, Project } from '@/models'
import { authStore } from '@/stores/authStore'
import { projectStore } from '@/stores/projectStore'

class TokenStore {
  // --- stores

  tokens = atom<OAuthToken[]>([])

  // --- actions

  fetchTokens = async (project: Project) => {
    if (authStore.debugMode()) (window as any)['tokenStore'] = tokenStore

    if (project.sample) {
      const token: OAuthToken = { name: 'fake', access: 'fake' }
      this.tokens.set([token])
      return [token]
    }

    const response = await API.getMultipleOAuthTokens(project, [
      'github',
      'gitlab',
      'linear',
      'jira',
    ])
    this.tokens.set(response.items)
    return response.items
  }

  addToken = (token: OAuthToken) => {
    const tokens = this.tokens.get()
    this.tokens.set([...tokens, token])
  }

  connectToken = async (redirect: string, code: string, service: string) => {
    const project = projectStore.currentProject.get()
    const response = await API.connectOAuthToken(redirect, code, service, project)
    this.addToken(response.item)
    return response.item
  }
}

export const tokenStore = new TokenStore()
