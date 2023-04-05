import { QueryPullRequest, QueryUser } from '@/query/types'

export interface CodeService {
  setToken(token: string): void

  pulls(repo: string, query: string): Promise<QueryPullRequest[]>

  teamMembers(): Promise<QueryUser[]>
}
