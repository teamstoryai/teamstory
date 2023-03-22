import { QueryPullRequest } from '@/query/types'
import axios from 'axios'

export type PaginatedResult<T> = {
  incomplete_results: boolean
  items: T[]
  total_count: number
}

class Github {
  token: string = ''

  setToken = (token: string) => {
    this.token = token
  }

  pulls = async (repo: string, query: string): Promise<PaginatedResult<QueryPullRequest>> => {
    const q = encodeURIComponent(`repo:${repo} type:pr ${query}`)
    const response = await axios.get('https://api.github.com/search/issues?q=' + q, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.token}`,
      },
    })

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

export default new Github()
