import { QueryPullRequest, QueryUser } from '@/query/types'

export type PRFilters = {
  open?: boolean
  merged?: boolean
  createdAfter?: string
  createdBefore?: string
  updatedAfter?: string
  updatedBefore?: string
  mergedAfter?: string
  mergedBefore?: string
  draft?: boolean
}
export interface CodeService {
  setToken(token: string): void

  pulls(repo: string, filters: PRFilters): Promise<QueryPullRequest[]>

  teamMembers(): Promise<QueryUser[]>
}
