import { IssueConnection, LinearClient } from '@linear/sdk'
import { QueryIssue, QueryUser } from '@/query/types'
import { IssueFilter, TeamFilter, UserFilter } from '@linear/sdk/dist/_generated_documents'
import { config } from '@/config'
import { IssueFields, IssueFilters, IssueService } from '@/query/issueService'

class Linear implements IssueService {
  client: LinearClient = new LinearClient({ apiKey: 'nothing' })

  teamFilter: string[] = []

  setToken = (token: string) => {
    this.client = new LinearClient({ accessToken: token })
  }

  issues = async (props: IssueFilters = {}, fields: IssueFields): Promise<QueryIssue[]> => {
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
    if (props.updatedAfter) {
      filter.updatedAt = { ...filter.updatedAt, gte: new Date(props.updatedAfter) }
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
      title
      createdAt
      url
      identifier
      priorityLabel
      completedAt
      startedAt
      id
      ${
        fields.nonEssentials
          ? `
      trashed
      branchName
      dueDate
      estimate
      description
      number
      updatedAt
      priority
      archivedAt
      canceledAt
      `
          : ''
      }
      ${
        fields.labels
          ? `labels {
        nodes {
          id
          name
          color
        }
      }`
          : ''
      }
      ${
        fields.assignee
          ? `assignee {
        id
        name
      }`
          : ''
      }
      ${
        fields.creator
          ? `creator {
        id
        name
      }`
          : ''
      }
      ${
        fields.state
          ? `state {
        id
        name
      }`
          : ''
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
      labels: issue.labels?.nodes,
    }))
  }

  users = async () => {
    return this.client.users()
  }

  teams = async () => {
    const filter: TeamFilter = {}
    if (this.teamFilter.length) {
      filter.id = { in: this.teamFilter }
    }
    return this.client.teams({ filter })
  }

  teamMembers = async (): Promise<QueryUser[]> => {
    const filter: TeamFilter = {}
    if (this.teamFilter.length) {
      filter.id = { in: this.teamFilter }
    }

    const response: any = await this.client.client.request(
      `
    query teams($after: String, $before: String, $filter: TeamFilter, $first: Int, $includeArchived: Boolean, $last: Int, $orderBy: PaginationOrderBy) {
      teams(
        after: $after
        before: $before
        filter: $filter
        first: $first
        includeArchived: $includeArchived
        last: $last
        orderBy: $orderBy
      ) {
        ...TeamConnection
      }
    }

    fragment TeamConnection on TeamConnection {
      __typename
      nodes {
        ...Team
      }
      pageInfo {
        ...PageInfo
      }
    }

    fragment Team on Team {
      __typename
      members {
        nodes {
          id
          name
          avatarUrl
          email
        }
        pageInfo {
          ...PageInfo
        }
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
      { filter }
    )

    const teams = response.teams.nodes
    const members = teams.map((t: any) => t.members.nodes).flat()

    return members.map((member: any) => ({
      ...member,
      avatar: member.avatarUrl,
    }))
  }
}

const linear = new Linear()
if (config.dev) (window as any).linear = linear
export default linear
