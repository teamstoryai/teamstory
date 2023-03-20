import { API } from '@/api'
import { config } from '@/config'

export type OrgData = {
  id: any
  login: string
  avatar_url: string
  type: 'user' | 'org'
}

export type RepoData = {
  id: any
  full_name: string
  fork: boolean
  private: boolean
}

class ConnectStore {
  // --- stores

  // --- actions

  getOrgs = async (service: string) => {
    const response = await API.connectOrgs(service)
    return response as OrgData[]
  }

  getRepos = async (service: string, org: { login: string; type?: string }) => {
    const orgId = org.type == 'user' ? '<user>' : org.login
    const response = await API.connectRepos(service, orgId)
    return response as RepoData[]
  }
}

export const connectStore = new ConnectStore()
if (config.dev) (window as any)['connectStore'] = connectStore
