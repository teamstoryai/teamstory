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
}

class Linear {
  client: LinearClient = new LinearClient({ apiKey: 'nothing' })

  setToken = (token: string) => {
    this.client = new LinearClient({ accessToken: token })
  }

  issues = async (props: IssueFilters = {}): Promise<QueryIssue[]> => {
    const filter: IssueFilter = {}
    if (props.open) {
      filter.completedAt = { null: true }
    }
    if (props.started) {
      filter.startedAt = { null: false }
    }
    if (props.createdBefore) {
      filter.createdAt = { lte: new Date(props.createdBefore) }
    }
    if (props.createdAfter) {
      filter.createdAt = { gte: new Date(props.createdAfter) }
    }
    if (props.completedBefore) {
      filter.completedAt = { lte: new Date(props.completedBefore) }
    }
    if (props.completedAfter) {
      filter.completedAt = { gte: new Date(props.completedAfter) }
    }
    if (props.label) {
      filter.labels = { some: { name: { eqIgnoreCase: props.label } } }
    }

    const result = await this.client.issues({
      after: props.after,
      before: props.before,
      filter,
    })
    return result.nodes
  }
}

export default new Linear()
