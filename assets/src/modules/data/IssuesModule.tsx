import BaseModule from '@/modules/data/BaseModule'
import IssuesCard from '@/modules/ui/IssuesCard'
import { IssueFields, IssueFilters } from '@/query/issueService'
import linear from '@/query/linear'
import { QueryIssue } from '@/query/types'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'

export type IssuesModuleProps = {
  id?: string
  title?: string
  filters: IssueFilters
  fields?: IssueFields
}

const defaultFields: IssueFields = {
  labels: true,
  assignee: true,
}

export default class IssuesModule extends BaseModule<IssuesModuleProps, QueryIssue[]> {
  fetchData = (clearCache?: boolean) => {
    const filters = this.props.filters
    const fields = this.props.fields || defaultFields
    const key = 'issues:' + JSON.stringify(filters)
    if (clearCache) dataStore.clear(key)
    return dataStore.cacheRead(key, () => connectStore.issueService.issues(filters, fields))
  }

  render = () => {
    return <IssuesCard title={this.props.title} module={this} />
  }
}
