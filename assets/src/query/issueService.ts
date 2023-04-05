import { QueryIssue, QueryUser } from '@/query/types'

export type IssueFilters = {
  before?: string
  after?: string
  started?: boolean
  open?: boolean
  createdBefore?: string
  createdAfter?: string
  completedAfter?: string
  completedBefore?: string
  updatedAfter?: string
  label?: string
  priority?: number // 1 = urgent, 2 = high, 3 = medium, 4 = low
  custom?: any
}

export type IssueFields = {
  labels?: boolean
  creator?: boolean
  assignee?: boolean
  state?: boolean
  nonEssentials?: boolean
}

export interface IssueService {
  setToken(token: string): void

  issues(props: IssueFilters, fields: IssueFields): Promise<QueryIssue[]>

  teamMembers(): Promise<QueryUser[]>
}
