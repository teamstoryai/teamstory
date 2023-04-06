import { config } from '@/config'
import { CodeService, PRFilters } from '@/query/codeService'
import { QueryPullRequest, QueryUser } from '@/query/types'
import axios, { AxiosInstance } from 'axios'

export type PaginatedResult<T> = {
  incomplete_results: boolean
  items: T[]
  total_count: number
}

class Github implements CodeService {
  token: string = ''
  axios: AxiosInstance = axios.create()

  setToken = (token: string) => {
    this.token = token

    this.axios.defaults.headers.common['Accept'] = 'application/vnd.github+json'
    this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
  }

  orgs = async (): Promise<any> => {
    const response = await this.axios.get('https://api.github.com/user/orgs')
    return response.data
  }

  repos = async (org: string): Promise<any> => {
    if (org == '<user>') {
      const response = await this.axios.get('https://api.github.com/user/repos')
      return response.data
    } else {
      const response = await this.axios.get(`https://api.github.com/orgs/${org}/repos`)
      return response.data
    }
  }

  pulls = async (repo: string, filters: PRFilters): Promise<QueryPullRequest[]> => {
    const queryParts: string[] = []

    if (filters.merged) queryParts.push('is:merged')

    if (filters.createdAfter && filters.createdBefore)
      queryParts.push(`created:${filters.createdAfter}..${filters.createdBefore}`)
    else if (filters.createdAfter) queryParts.push(`created:>${filters.createdAfter}`)
    else if (filters.createdBefore) queryParts.push(`created:<${filters.createdBefore}`)

    if (filters.updatedAfter && filters.updatedBefore)
      queryParts.push(`updated:${filters.updatedAfter}..${filters.updatedBefore}`)
    else if (filters.updatedAfter) queryParts.push(`updated:>${filters.updatedAfter}`)
    else if (filters.updatedBefore) queryParts.push(`updated:<${filters.updatedBefore}`)

    if (filters.mergedAfter && filters.mergedBefore)
      queryParts.push(`merged:${filters.mergedAfter}..${filters.mergedBefore}`)
    else if (filters.mergedAfter) queryParts.push(`merged:>${filters.mergedAfter}`)
    else if (filters.mergedBefore) queryParts.push(`merged:<${filters.mergedBefore}`)

    if (filters.draft !== undefined) queryParts.push('draft:' + filters.draft)
    if (filters.open) queryParts.push('is:open')

    const query = queryParts.join(' ')
    const q = encodeURIComponent(`repo:${repo} type:pr ${query}`)
    const response = await this.axios.get('https://api.github.com/search/issues?q=' + q)

    const data: QueryPullRequest[] = response.data.items.map(
      (item: any) =>
        ({
          ...item,
          user: {
            id: item.user?.login,
            name: item.user?.login,
            username: item.user?.login,
            avatar: 'https://avatars.githubusercontent.com/' + item.user?.login,
          },
          repo,
        } as QueryPullRequest)
    )
    return data
  }

  teamMembers(): Promise<QueryUser[]> {
    throw new Error('Method not implemented.')
  }
}

const github = new Github()
if (config.dev) (window as any).github = github
export default github
