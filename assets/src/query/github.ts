import { config } from '@/config'
import { QueryPullRequest } from '@/query/types'
import axios, { AxiosInstance } from 'axios'

export type PaginatedResult<T> = {
  incomplete_results: boolean
  items: T[]
  total_count: number
}

class Github {
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

  pulls = async (repo: string, query: string): Promise<PaginatedResult<QueryPullRequest>> => {
    const q = encodeURIComponent(`repo:${repo} type:pr ${query}`)
    const response = await this.axios.get('https://api.github.com/search/issues?q=' + q)

    const data: QueryPullRequest[] = response.data.items.map((item: any) => ({
      ...item,
      user: {
        id: item.user?.login,
        name: item.user?.login,
      },
      repo,
    }))
    response.data.items = data
    return response.data
  }
}

const github = new Github()
if (config.dev) (window as any).github = github
export default github
