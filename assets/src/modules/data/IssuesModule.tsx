import BaseModule from '@/modules/data/BaseModule'
import IssuesCard from '@/modules/ui/IssuesCard'
import linear, { IssueFilters, LinearIssueFields } from '@/query/linear'
import { QueryIssue } from '@/query/types'
import { dataStore } from '@/stores/dataStore'

export type IssuesModuleProps = {
  id?: string
  title?: string
  filters: IssueFilters
  fields?: LinearIssueFields
}

const defaultFields: LinearIssueFields = {
  labels: true,
  assignee: true,
}

export default class IssuesModule extends BaseModule<IssuesModuleProps, QueryIssue[]> {
  fetchData = (clearCache?: boolean) => {
    const filters = this.props.filters
    const fields = this.props.fields || defaultFields
    const key = 'issues:' + JSON.stringify(filters)
    if (clearCache) dataStore.clear(key)
    return dataStore.cacheRead(key, () => linear.issues(filters, fields))
  }

  render = () => {
    return <IssuesCard title={this.props.title} module={this} />
  }
}
