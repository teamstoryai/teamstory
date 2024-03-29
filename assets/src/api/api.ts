import axios, { AxiosError, AxiosInstance } from 'axios'

import { config, OAuthProvider } from '@/config'
import {
  AuthToken,
  AuthTokenPair,
  IssueTracker,
  Learning,
  LearningKey,
  OAuthToken,
  Project,
  ProjectRole,
  Repository,
  User,
} from '@/models'
import { AsyncPromise, logger } from '@/utils'

import * as R from './types'
import { Resource, ResourceWithParent, SingleResource } from '@/api/resource'

class APIService {
  endpoint = config.apiUrl

  axios: AxiosInstance = axios

  tokens?: AuthTokenPair

  // token management

  setAuthToken(refreshToken: string) {
    if (refreshToken) {
      return this.exchangeAndSetAuthToken({ refresh: { token: refreshToken } })
    } else {
      return new Promise<AuthTokenPair>((res) => {
        return {}
      })
    }
  }

  clearAuthToken() {
    this.tokens = {}
  }

  setAuthTokens(tokens: AuthTokenPair) {
    if (!tokens?.refresh?.token) {
      logger.warn('No refresh token in tokens -- something went wrong', tokens)
      return
    }

    logger.debug('Setting tokens in API', tokens)
    this.tokens = tokens
    this.axios = axios.create()

    let updating: Promise<void> | null = null

    const refreshTokens = async () => {
      if (!this.tokens?.refresh?.token) {
        logger.error('No refresh token to refresh', this.tokens)
        this.clearAuthToken()
        return
      }

      try {
        updating = AsyncPromise<void>(async (res) => {
          const { token } = this.tokens?.refresh || {}
          if (!token) return
          const newTokens = await this.exchangeToken(token)

          newTokens.refresh = newTokens.refresh || tokens.refresh
          this.tokens = newTokens

          // authActions.updateTokens(newTokens, 'api')
          res()
        })
        await updating
      } finally {
        updating = null
      }
    }

    this.axios.interceptors.request?.use(async (request) => {
      if (updating) await updating

      if (
        !this.tokens?.access?.token ||
        (this.tokens?.refresh?.token != 'guest' && isTokenExpired(this.tokens.access))
      ) {
        await refreshTokens()
      }

      if (request.url?.startsWith(this.endpoint)) {
        if (this.tokens?.access?.token) {
          request.headers!['Authorization'] = 'Bearer ' + this.tokens?.access?.token
          request.headers!['X-Req-ID'] = 'api-' + Date.now()
        } else {
          delete request.headers!['Authorization']
        }
      }
      return request
    })
  }

  async exchangeAndSetAuthToken(
    { refresh, access }: AuthTokenPair,
    { force, fork }: { force?: boolean; fork?: boolean } = {}
  ): Promise<AuthTokenPair | undefined> {
    if (!refresh) return this.tokens

    if (force || fork || !access || isTokenExpired(access)) {
      const tokens = await this.exchangeToken(refresh.token, fork)
      this.setAuthTokens(tokens)
    } else {
      this.setAuthTokens({ refresh, access })
    }

    return this.tokens
  }

  async exchangeToken(token: string, fork?: boolean): Promise<AuthTokenPair> {
    try {
      const response = await axios.post(`${this.endpoint}/exchange_token`, { token, fork })
      return response.data
    } catch (e: any) {
      logger.error(e)
      if (isAxiosError(e) && e.response?.status === 401) {
        this.clearAuthToken()
      }
      return {}
    }
  }

  // auth
  async signIn(email: string, password: string): Promise<R.SignInResponse> {
    const response = await axios.post(`${this.endpoint}/sign_in`, {
      email,
      password,
    })
    return response.data
  }

  async createAccount(
    name: string,
    email: string,
    password: string,
    invite?: string,
    originType?: string
  ): Promise<R.SignInResponse> {
    const response = await axios.post(`${this.endpoint}/create_account`, {
      name,
      email,
      password,
      invite,
      origin_type: originType,
    })
    return response.data
  }

  async logInElseSignUpOAuth(
    provider: OAuthProvider,
    token: string,
    name?: string,
    email?: string
  ): Promise<R.OAuthSignInResponse> {
    const response = await axios.post(`${this.endpoint}/log_in_else_sign_up_oauth`, {
      provider,
      token,
      name,
      email,
    })
    logger.info('logInElseSignUpOAuth response', response.data)
    return response.data
  }

  async forgotPassword(email: string): Promise<R.SuccessResponse> {
    const response = await axios.post(`${this.endpoint}/forgot_password`, { email })
    return response.data
  }

  async resetPassword(token: string, password: string, code?: string): Promise<R.SignInResponse> {
    const response = await axios.post(`${this.endpoint}/reset_password`, { token, password, code })
    return response.data
  }

  async joinInvite(invite: string): Promise<{ existing: boolean; id: string }> {
    const response = await this.axios.post(`${this.endpoint}/join_invite`, { invite })
    return response.data
  }

  async loginSuccess(code: string, payload?: any): Promise<R.SuccessResponse> {
    const response = await this.axios.post(`${this.endpoint}/login_success`, { code, payload })
    return response.data
  }

  // user management

  public user = new SingleResource<User>(this, 'user')

  // projects

  public projects = new Resource<Project>(this, 'projects')

  async projectAddMember(
    project: Project,
    email: string,
    role: ProjectRole
  ): Promise<R.ProjectWithMembersResponse> {
    const response = await this.axios.post(`${this.endpoint}/projects/${project.id}/add_member`, {
      email,
      role,
    })
    return response.data
  }

  async projectRemoveMember(
    project: Project,
    email: string | undefined,
    user: string | undefined
  ): Promise<R.ProjectWithMembersResponse> {
    const response = await this.axios.post(
      `${this.endpoint}/projects/${project.id}/remove_member`,
      { email, user }
    )
    return response.data
  }

  // user data

  async getUserData(key: string, projectId?: string): Promise<any> {
    const projectParam = projectId ? `project=${projectId}&` : ''
    const response = await this.axios.get(
      `${this.endpoint}/users/data?${projectParam}key=${encodeURIComponent(key)}`
    )
    return response.data.data
  }

  async setUserData(key: string, data: any, projectId?: string): Promise<R.SuccessResponse> {
    const projectParam = projectId ? `project=${projectId}&` : ''
    const response = await this.axios.post(
      `${this.endpoint}/users/data?${projectParam}key=${encodeURIComponent(key)}`,
      { data }
    )
    return response.data
  }

  // project data

  async getProjectData(projectId: string, key: string): Promise<any> {
    const response = await this.axios.get(
      `${this.endpoint}/projects/${projectId}/data?key=${encodeURIComponent(key)}`
    )
    return response.data.data
  }

  async setProjectData(projectId: string, key: string, data: any): Promise<R.SuccessResponse> {
    const response = await this.axios.post(
      `${this.endpoint}/projects/${projectId}/data?key=${encodeURIComponent(key)}`,
      { data }
    )
    return response.data
  }

  // other resources

  public repos = new ResourceWithParent<Project, Repository>(this, 'project_id', 'connect/repos')

  public issue_trackers = new ResourceWithParent<Project, IssueTracker>(
    this,
    'project_id',
    'connect/issues'
  )

  // tokens

  async getOAuthTokens(service: string): Promise<R.ItemsResponse<OAuthToken>> {
    const response = await this.axios.get(`${this.endpoint}/oauth/token?service=${service}`)
    return response.data
  }

  async getMultipleOAuthTokens(
    project: Project,
    services: string[]
  ): Promise<R.ItemsResponse<OAuthToken>> {
    const query = services.map((s) => `services[]=${s}`).join('&')
    const response = await this.axios.get(
      `${this.endpoint}/oauth/token?project_id=${project.id}&${query}`
    )
    return response.data
  }

  async connectOAuthToken(
    redirectUri: string,
    code: string,
    service: string,
    project?: Project
  ): Promise<R.ItemResponse<OAuthToken>> {
    const response = await this.axios.post(`${this.endpoint}/oauth/connect`, {
      service,
      code,
      redirect_uri: redirectUri,
      project_id: project?.id,
    })
    return response.data
  }

  async updateOAuthToken(token: OAuthToken): Promise<R.ItemResponse<OAuthToken>> {
    const response = await this.axios.put(
      `${this.endpoint}/oauth/token?service=${token.name}`,
      token
    )
    return response.data
  }

  async refreshOAuthToken(service: string, email: string): Promise<R.ItemResponse<OAuthToken>> {
    let response = await this.axios.post(`${this.endpoint}/oauth/refresh`, { service, email })
    return response.data
  }

  async deleteOAuthToken(service: string, email: string): Promise<R.SuccessResponse> {
    const response = await this.axios.delete(
      `${this.endpoint}/oauth/token?service=${service}&email=${email}`
    )
    return response.data
  }

  // api connection

  async fetchOrgs(service: string): Promise<any> {
    const response = await this.axios.get(
      `${this.endpoint}/connect/repos/fetch_orgs?service=${service}`
    )
    return response.data
  }

  async fetchRepos(service: string, org: string): Promise<any> {
    const response = await this.axios.get(
      `${this.endpoint}/connect/repos/fetch_repos?service=${service}&org=${encodeURIComponent(org)}`
    )
    return response.data
  }

  // learning

  async listLearnings(project: Project, key: LearningKey): Promise<R.ItemsResponse<Learning>> {
    const params = new URLSearchParams({ project_id: project.id, ...key })
    const response = await this.axios.get(`${this.endpoint}/learnings?${params.toString()}`)
    return response.data
  }

  async listAllLearnings(project: Project, offset?: number): Promise<R.ItemsResponse<Learning>> {
    const params = new URLSearchParams({ project_id: project.id })
    if (offset) params.set('offset', offset.toString())
    const response = await this.axios.get(`${this.endpoint}/learnings?${params.toString()}`)
    return response.data
  }

  async updateLearning(
    project: Project,
    item: Partial<Learning>
  ): Promise<R.ItemResponse<Learning>> {
    const params = new URLSearchParams({ project_id: project.id, ...item.key })
    const response = await this.axios.post(`${this.endpoint}/learnings?${params.toString()}`, {
      content: item.content,
      private: item.private,
    })
    return response.data
  }

  // misc

  async githash(): Promise<{ hash: string }> {
    const response = await this.axios.get(`${this.endpoint}/githash`)
    return response.data
  }

  async clientId(service: string): Promise<{ client_id: string }> {
    const response = await this.axios.get(`${this.endpoint}/client_id?service=${service}`)
    return response.data
  }

  // ai

  async generateSummary(
    project: Project,
    messages: { role: string; content: string }[],
    model?: string,
    maxTokens?: number
  ): Promise<{ response: string; status: number }> {
    const response = await this.axios.post(`${this.endpoint}/ai/summary`, {
      project_id: project.id,
      messages,
      model,
      tokens: maxTokens,
    })
    return { response: response.data, status: response.status }
  }

  // for storybooks, put API into a stub state

  stubMode() {
    // disable actual axios by returning unresolved promises
    axios.get = () => new Promise(() => {})
    axios.post = () => new Promise(() => {})
    axios.put = () => new Promise(() => {})
    axios.delete = () => new Promise(() => {})
    this.axios = axios
  }
}

export const API = new APIService()

export const isAxiosError = (item: Error): item is AxiosError => (item as AxiosError).isAxiosError

export const isTokenExpired = (token: AuthToken): boolean | undefined =>
  token?.exp !== undefined && token.exp * 1000 < Date.now() + 500
