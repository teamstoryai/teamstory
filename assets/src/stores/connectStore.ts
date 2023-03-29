import { API } from '@/api'
import { config } from '@/config'
import { IssueTracker, Project, Repository } from '@/models'
import linear from '@/query/linear'
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

  trackers = atom<IssueTracker[]>([])

  fakeMode = false

  // --- actions

  clearData = () => {
    this.repos.set([])
    this.trackers.set([])
  }

  loadConnections = async (project?: Project) => {
    await Promise.all([this.loadConnectedRepos(project), this.loadConnectedTrackers(project)])
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

  loadConnectedTrackers = async (project?: Project) => {
    if (this.fakeMode) return this.trackers.get()
    if (!project) project = projectStore.currentProject.get()
    assertIsDefined(project, 'project')
    const response = await API.issue_trackers.list(project)
    const trackers = response.items.map((i) => IssueTracker.fromJSON(i))
    this.trackers.set(trackers)
    this.updateTeamFilters(trackers)
    return trackers
  }

  addTracker = async (service: string, data: Partial<IssueTracker>) => {
    const project = projectStore.currentProject.get()
    assertIsDefined(project, 'project')
    const response = await API.issue_trackers.create(project, data)
    const proj = IssueTracker.fromJSON(response.item)
    const newTrackers = [...this.trackers.get(), proj]
    this.trackers.set(newTrackers)
    this.updateTeamFilters(newTrackers)
    return proj
  }

  updateTeamFilters = (trackers: IssueTracker[]) => {
    const ids = trackers.map((t) => t.base_url!)
    linear.teamFilter = ids
  }

  deleteTracker = async (tracker: IssueTracker) => {
    await API.issue_trackers.update(tracker.id, { deleted_at: new Date().toISOString() })
    const newTrackers = this.trackers.get().filter((i) => i.id !== tracker.id)
    this.trackers.set(newTrackers)
    this.updateTeamFilters(newTrackers)
  }
}

export const connectStore = new ConnectStore()
if (config.dev) (window as any)['connectStore'] = connectStore
