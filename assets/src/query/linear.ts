import { LinearClient } from '@linear/sdk'
import { QueryIssue } from '@/query/types'
import { IssueFilter } from '@linear/sdk/dist/_generated_documents'

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
    if (props.custom) {
      Object.assign(filter, props.custom)
    }

    const result = await this.client.issues({
      after: props.after,
      before: props.before,
      filter,
    })

    return result.nodes.map((issue) => ({
      ...issue,
      user: !issue.assignee
        ? undefined
        : () =>
            issue.assignee!.then((assignee) => ({
              id: assignee.id,
              name: assignee.name,
            })),
      labels: async () =>
        (await issue.labels()).nodes.map((n) => ({
          name: n.name,
          color: n.color,
        })),
    }))
  }
}

export default new Linear()
