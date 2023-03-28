import { API } from '@/api'
import { config } from '@/config'
import { IssueProject, Project, Repository } from '@/models'
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

  projects = atom<IssueProject[]>([])

  fakeMode = false

  // --- actions

  clearRepos = () => {
    this.repos.set([])
  }

  loadConnections = async () => {
    await Promise.all([this.loadConnectedRepos(), this.loadConnectedProjects()])
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

  loadConnectedProjects = async (project?: Project) => {
    if (this.fakeMode) return this.projects.get()
    if (!project) project = projectStore.currentProject.get()
    assertIsDefined(project, 'project')
    const response = await API.issue_projects.list(project)
    const projects = response.items.map((i) => IssueProject.fromJSON(i))
    this.projects.set(projects)
    return projects
  }

  addProject = async (service: string, data: IssueProject) => {
    const project = projectStore.currentProject.get()
    assertIsDefined(project, 'project')
    const response = await API.repos.create(project, data)
    const proj = IssueProject.fromJSON(response.item)
    this.projects.set([...this.projects.get(), proj])
    return proj
  }
}

export const connectStore = new ConnectStore()
if (config.dev) (window as any)['connectStore'] = connectStore
