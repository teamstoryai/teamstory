import axios from 'axios'

export type PullRequest = {
  id: number
  title: string
  user: {
    avatar_url: string
    login: string
  } | null
  html_url: string
  closed_at: string | null
  updated_at: string
  created_at: string
}

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

  issues = async (repo: string, query: string): Promise<PaginatedResult<PullRequest>> => {
    const q = encodeURIComponent(`repo:${repo} type:pr ${query}`)
    const response = await axios.get('https://api.github.com/search/issues?q=' + q, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${this.token}`,
      },
    })
    return response.data
  }
}

export default new Github()
