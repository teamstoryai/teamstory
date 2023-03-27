import { action, atom, map } from 'nanostores'
import { route } from 'preact-router'

import { API, ItemResponse, ProjectWithMembersResponse } from '@/api'
import { paths } from '@/config'
import { Project, User } from '@/models'
import { authStore } from '@/stores/authStore'
import { logger } from '@/utils'
import { fakeProject, initFakeData } from '@/stores/fakeData'
import { dataStore } from '@/stores/dataStore'

export type ProjectMap = { [id: string]: Project }

export type ProjectSwitchListener = (project: Project) => void

class ProjectStore {
  // --- stores

  activeProjects = atom<Project[]>([])

  projects = atom<Project[]>([])

  projectMap = map<ProjectMap>({})

  currentProject = atom<Project | undefined>()

  // --- variables

  projectSwitchListeners: ProjectSwitchListener[] = []

  addListener = (listener: ProjectSwitchListener) => {
    if (this.projectSwitchListeners.includes(listener)) return
    this.projectSwitchListeners.push(listener)
  }

  // --- actions

  updateProjects = action(this.projects, 'updateProjects', (store, projects: Project[]) => {
    if (authStore.debugMode()) (window as any)['projectStore'] = projectStore

    logger.debug('PROJECTS - update', projects)
    store.set(projects)
    this.activeProjects.set(projects.filter((p) => !p.archived_at && !p.deleted_at))
    this.updateProjectMap(projects)
  })

  updateCurrentProject = action(
    this.currentProject,
    'updateCurrentProject',
    (store, user: User) => {
      const projects = this.projects.get()
      const lastProjectId = user.meta.lp
      let currentProject: Project | undefined
      if (lastProjectId) {
        currentProject = projects.find((p) => p.id == lastProjectId)
      }
      if (!currentProject && lastProjectId == 'fake') {
        initFakeData()
        currentProject = fakeProject
        setTimeout(() => dataStore.initTokens(), 500)
      }
      if (!currentProject) currentProject = projects[0]
      if (currentProject) this.projectSwitchListeners.forEach((l) => l(currentProject!))
      store.set(currentProject)
    }
  )

  setCurrentProject = action(
    this.currentProject,
    'setCurrentProject',
    (store, projectOrId: Project | string) => {
      const projectId = typeof projectOrId == 'string' ? projectOrId : projectOrId.id

      if (store.get()?.id != projectId) {
        const project: Project | undefined = this.activeProjects
          .get()
          .find((p) => p.id == projectId)
        if (project) {
          this.projectSwitchListeners.forEach((l) => l(project))
          store.set(project)
          const user = authStore.loggedInUser.get()
          if (user?.meta?.lp != project.id) {
            authStore.updateUser({ meta: { lp: project.id } })
          }

          return project
        }
      }
    }
  )

  fetchProjectDetails = async (id: string) => {
    const project = this.projectMap.get()[id]
    if (project) this.currentProject.set(project)

    const response = (await API.projects.get(id)) as ProjectWithMembersResponse
    logger.info('loaded project details', response)
    response.item.members = response.members
    this.currentProject.set(response.item)
  }

  updateProjectMap = action(this.projectMap, 'updateProjectMap', (store, projects: Project[]) => {
    const projectMap: ProjectMap = {}
    projects.forEach((p) => (projectMap[p.id] = p))
    store.set(projectMap)

    if (!this.currentProject.get()) this.currentProject.set(projects[0])
  })

  createProject = action(this.projects, 'createProject', async (store, attrs: Partial<Project>) => {
    const response = await API.projects.create(attrs)
    logger.info('PROJECTS - create', response)
    const project = Project.fromJSON(response.item)
    const projects = [...store.get(), project]
    this.updateProjects(projects)
    this.setCurrentProject(project)

    route(paths.SETUP)
  })

  deleteProject = async (project: Project) => {
    this.updateProject(project, { deleted_at: new Date().toISOString() })
    location.href = paths.PROJECTS
  }

  updateProject = async (project: Project, updates: Partial<Project>) => {
    const response = await API.projects.update(project.id, updates)
    this.onProjectUpdated(response)
  }

  onProjectUpdated = (response: ItemResponse<Project> | ProjectWithMembersResponse) => {
    logger.info('on project updated', response)
    const project = Project.fromJSON(response.item)

    this.projects.set(this.projects.get().map((p) => (p.id == project.id ? project : p)))

    const currentProject = this.currentProject.get()
    if (currentProject?.id == project.id) {
      if (hasMembers(response)) project.members = response.members
      else project.members = currentProject.members
      this.currentProject.set(project)
    }
  }
}

function hasMembers(
  response: ItemResponse<Project> | ProjectWithMembersResponse
): response is ProjectWithMembersResponse {
  return !!(response as ProjectWithMembersResponse).members
}

export const projectStore = new ProjectStore()

export const getProject = (projectId: string) => projectStore.projectMap.get()[projectId]
