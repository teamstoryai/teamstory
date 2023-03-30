import { IssueConnection, LinearClient } from '@linear/sdk'
import { QueryIssue } from '@/query/types'
import { IssueFilter } from '@linear/sdk/dist/_generated_documents'
import { config } from '@/config'

export type IssueFilters = {
  before?: string
  after?: string
  started?: boolean
  open?: boolean
  createdBefore?: string
  createdAfter?: string
  completedAfter?: string
  completedBefore?: string
  label?: string
  priority?: number // 1 = urgent, 2 = high, 3 = medium, 4 = low
  custom?: IssueFilter
}

class Linear {
  client: LinearClient = new LinearClient({ apiKey: 'nothing' })

  teamFilter: string[] = []

  setToken = (token: string) => {
    this.client = new LinearClient({ accessToken: token })
  }

  issues = async (props: IssueFilters = {}): Promise<QueryIssue[]> => {
    const filter: IssueFilter = {}
    if (props.open !== undefined) {
      filter.completedAt = { ...filter.completedAt, null: props.open }
    }
    if (props.started !== undefined) {
      filter.startedAt = { ...filter.startedAt, null: !props.started }
    }
    if (props.createdBefore) {
      filter.createdAt = { ...filter.createdAt, lte: new Date(props.createdBefore) }
    }
    if (props.createdAfter) {
      filter.createdAt = { ...filter.createdAt, gte: new Date(props.createdAfter) }
    }
    if (props.completedBefore) {
      filter.completedAt = {
        ...filter.completedAt,
        lte: new Date(props.completedBefore),
      }
    }
    if (props.completedAfter) {
      filter.completedAt = { ...filter.completedAt, gte: new Date(props.completedAfter) }
    }
    if (props.label) {
      filter.labels = { ...filter.labels, some: { name: { eqIgnoreCase: props.label } } }
    }
    if (props.priority !== undefined) {
      filter.priority = { lte: props.priority, gt: 0 }
    }
    if (this.teamFilter.length) {
      filter.team = { id: { in: this.teamFilter } }
    }
    if (props.custom) {
      Object.assign(filter, props.custom)
    }

    const response: any = await this.client.client.request(
      `
    query issues($after: String, $before: String, $filter: IssueFilter, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) {
      issues(
        after: $after
        before: $before
        filter: $filter
        first: $first
        includeArchived: $includeArchived
        last: $last
        orderBy: $orderBy
      ) {
        ...IssueConnection
      }
    }

    fragment IssueConnection on IssueConnection {
      __typename
      nodes {
        ...Issue
      }
      pageInfo {
        ...PageInfo
      }
    }

    fragment Issue on Issue {
      __typename
      trashed
      url
      identifier
      priorityLabel
      branchName
      cycle {
        id
      }
      dueDate
      estimate
      description
      title
      number
      updatedAt
      parent {
        id
      }
      priority
      project {
        id
        name
      }
      team {
        id
      }
      archivedAt
      createdAt
      canceledAt
      completedAt
      startedAt
      id
      labels {
        nodes {
          id
          name
          color
        }
      }
      assignee {
        id
        name
      }
      state {
        id
        name
      }
    }

    fragment PageInfo on PageInfo {
      __typename
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
    `,
      {
        after: props.after,
        before: props.before,
        filter,
      }
    )

    const result = response.issues

    ;(window as any)['issues'] = result

    return result.nodes.map((issue: any) => ({
      ...issue,
      labels: issue.labels.nodes,
    }))
  }
}

const linear = new Linear()
if (config.dev) (window as any).linear = linear
export default linear
