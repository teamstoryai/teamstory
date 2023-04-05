import { API } from '@/api'
import { config } from '@/config'
import { IssueTracker, Project, Repository } from '@/models'
import linear from '@/query/linear'
import { QueryUser } from '@/query/types'
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

// mapping of user to alias
export type ProjectUserInfo = {
  aliases?: string[]
  name?: string
  hidden?: boolean
}
export type ProjectUserMap = {
  [id: string]: ProjectUserInfo
}

type NameMap = { [id: string]: string | false }

class ConnectStore {
  // --- stores

  repos = atom<Repository[]>([])

  trackers = atom<IssueTracker[]>([])

  users = atom<ProjectUserMap>({})

  idToName = atom<NameMap>({})

  fakeMode = false

  // --- actions

  clearData = () => {
    this.repos.set([])
    this.trackers.set([])
    this.users.set({})
    this.idToName.set({})
  }

  loadConnections = async (project?: Project) => {
    await Promise.all([
      this.loadConnectedRepos(project),
      this.loadConnectedTrackers(project),
      this.loadUsers(project),
    ])
  }

  // --- repos

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

  // --- trackers

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
    const ids = trackers.filter((t) => t.service == 'linear').map((t) => t.base_url!)
    linear.teamFilter = ids
  }

  deleteTracker = async (tracker: IssueTracker) => {
    await API.issue_trackers.update(tracker.id, { deleted_at: new Date().toISOString() })
    const newTrackers = this.trackers.get().filter((i) => i.id !== tracker.id)
    this.trackers.set(newTrackers)
    this.updateTeamFilters(newTrackers)
  }

  // --- user data

  loadUsers = async (project?: Project) => {
    if (this.fakeMode) return this.users.get()
    if (!project) project = projectStore.currentProject.get()
    assertIsDefined(project, 'project')
    const response = (await API.getProjectData(project.id, 'users')) as ProjectUserMap
    if (response) {
      this.users.set(response)
      const idToName: NameMap = {}
      Object.keys(response).forEach((id) => {
        const info = response[id]
        const name = info.hidden ? false : info.name
        if (name !== undefined) {
          idToName[id] = name
          if (info.aliases) info.aliases.forEach((a) => (idToName[a] = name))
        }
      })
      this.idToName.set(idToName)
    }
    return response || {}
  }

  updateUsers = async (changes: ProjectUserMap) => {
    const updated = { ...this.users.get(), ...changes }
    this.users.set(updated)
    if (this.fakeMode) return

    const project = projectStore.currentProject.get()
    assertIsDefined(project, 'project')
    await API.setProjectData(project.id, 'users', updated)
  }

  getName = (user: QueryUser) => {
    const idToName = this.idToName.get()
    if (idToName[user.id] !== undefined) return idToName[user.id]
    return user.name
  }
}

export const connectStore = new ConnectStore()
if (config.dev) (window as any)['connectStore'] = connectStore
