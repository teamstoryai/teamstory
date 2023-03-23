import axios from 'axios'

import { LinearClient } from '@linear/sdk'
import { QueryIssue } from '@/query/types'

export type IssueFilters = {
  before?: string
  after?: string
  open?: boolean
  completedAfter?: string
}

class Linear {
  client: LinearClient = new LinearClient({ apiKey: 'nothing' })

  setToken = (token: string) => {
    this.client = new LinearClient({ accessToken: token })
  }

  issues = async (props: IssueFilters = {}): Promise<QueryIssue[]> => {
    const filter = props.open
      ? {
          startedAt: {
            null: false,
          },
          completedAt: {
            null: true,
          },
        }
      : props.completedAfter
      ? {
          completedAt: {
            gte: new Date(props.completedAfter),
          },
        }
      : undefined

    const result = await this.client.issues({
      after: props.after,
      before: props.before,
      filter,
    })
    return result.nodes
  }
}

export default new Linear()
