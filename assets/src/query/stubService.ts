import { CodeService, PRFilters } from '@/query/codeService'
import { IssueFields, IssueFilters, IssueService } from '@/query/issueService'
import { QueryIssue, QueryPullRequest, QueryUser } from '@/query/types'

class StubService implements CodeService, IssueService {
  setToken(token: string): void {}
  async pulls(repo: string, filters: PRFilters): Promise<QueryPullRequest[]> {
    return []
  }
  async issues(props: IssueFilters, fields: IssueFields): Promise<QueryIssue[]> {
    return []
  }
  async teamMembers(): Promise<QueryUser[]> {
    return []
  }
}

export default new StubService()
