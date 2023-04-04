import linear, { IssueFilters } from '@/query/linear'
import { QueryIssue } from '@/query/types'
import { dataStore } from '@/stores/dataStore'
import { logger } from '@/utils'

import { Task } from '@/gantt'
import GanttCard from '@/modules/ui/GanttCard'
import BaseModule from '@/modules/data/BaseModule'

export type GanttModuleProps = {
  title: string
  viewMode?: 'Day' | 'Week' | 'Month'
  filters: IssueFilters
}

export default class GanttModule extends BaseModule<GanttModuleProps, Task[]> {
  fetchData = async (clearCache?: boolean) => {
    const { filters } = this.props
    const key = 'issues:' + JSON.stringify(filters)
    if (clearCache) dataStore.clear(key)

    const issues = await dataStore.cacheRead(key, () => linear.issues(filters, {}))
    issues.sort((a, b) => duration(b) - duration(a))

    const tasks = issues
      .slice(0, 10)
      .map((issue) => {
        try {
          return issueToTask(issue)
        } catch (e) {
          logger.error('error processing', issue, e)
          return null
        }
      })
      .filter(Boolean) as Task[]
    return tasks
  }

  render = () => {
    return <GanttCard title={this.props.title} module={this} />
  }
}

const duration = (issue: QueryIssue) =>
  issue.startedAt
    ? new Date(issue.completedAt || Date.now()).getTime() - new Date(issue.startedAt).getTime()
    : 0

const issueToTask = (issue: QueryIssue): Task => ({
  id: issue.id,
  name: `${issue.identifier} - ${issue.title}`,
  start: issue.startedAt || issue.createdAt,
  end: issue.completedAt || new Date().toISOString(),
  progress: issue.completedAt ? 100 : 0,
})
