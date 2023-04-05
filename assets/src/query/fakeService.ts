import { CodeService } from '@/query/codeService'
import { IssueFields, IssueFilters, IssueService } from '@/query/issueService'
import { QueryIssue, QueryPullRequest, QueryUser } from '@/query/types'

class FakeService implements CodeService, IssueService {
  setToken(token: string): void {
    throw new Error('Method not implemented.')
  }
  pulls(repo: string, query: string): Promise<QueryPullRequest[]> {
    throw new Error('Method not implemented.')
  }
  issues(props: IssueFilters, fields: IssueFields): Promise<QueryIssue[]> {
    throw new Error('Method not implemented.')
  }
  teamMembers(): Promise<QueryUser[]> {
    throw new Error('Method not implemented.')
  }
}

export default new FakeService()
