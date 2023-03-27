import { API } from '@/api'
import { config } from '@/config'
import { Project, Repository } from '@/models'
import { projectStore } from '@/stores/projectStore'
import { assertIsDefined } from '@/utils'
import { atom } from 'nanostores'

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
  url: string
}

class ConnectStore {
  // --- stores

  repos = atom<Repository[]>([])

  fakeMode = false

  // --- actions

  fetchOrgs = async (service: string) => {
    const response = await API.fetchOrgs(service)
    return response as OrgData[]
  }

  fetchRepos = async (service: string, org: { login: string; type?: string }) => {
    const orgId = org.type == 'user' ? '<user>' : org.login
    const response = await API.fetchRepos(service, orgId)
    return response as RepoData[]
  }

  clearRepos = () => {
    this.repos.set([])
  }

  loadConnectedRepos = async (project?: Project) => {
    if (this.fakeMode) return this.repos.get()
    if (!project) project = projectStore.currentProject.get()
    assertIsDefined(project, 'project')
    const response = await API.repos.list(project)
    const repos = response.items.map((i) => Repository.fromJSON(i))
    this.repos.set(repos)
    return repos
  }

  addRepo = async (service: string, orgData: OrgData, repoData: RepoData) => {
    const project = projectStore.currentProject.get()
    assertIsDefined(project, 'project')
    const response = await API.repos.create(project, {
      service,
      name: repoData.full_name,
      avatar_url: orgData.avatar_url,
      base_url: repoData.url,
    })
    const repo = Repository.fromJSON(response.item)
    this.repos.set([...this.repos.get(), repo])
    return repo
  }
}

export const connectStore = new ConnectStore()
if (config.dev) (window as any)['connectStore'] = connectStore
