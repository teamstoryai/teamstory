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
  custom?: IssueFilter
}

class Linear {
  client: LinearClient = new LinearClient({ apiKey: 'nothing' })

  setToken = (token: string) => {
    this.client = new LinearClient({ accessToken: token })
  }

  issues = async (props: IssueFilters = {}): Promise<QueryIssue[]> => {
    const filter: IssueFilter = {}
    if (props.open) {
      filter.completedAt = { ...filter.completedAt, null: true }
    }
    if (props.started) {
      filter.startedAt = { ...filter.startedAt, null: false }
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
      labels: async () => (await issue.labels()).nodes.map((n) => n.name),
    }))
  }
}

export default new Linear()
