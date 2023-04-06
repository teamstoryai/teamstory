import { QueryIssue } from '@/query/types'
import { dataStore } from '@/stores/dataStore'
import { logger } from '@/utils'

import { Task } from '@/gantt'
import GanttCard from '@/modules/ui/GanttCard'
import BaseModule from '@/modules/data/BaseModule'
import { connectStore } from '@/stores/connectStore'
import { IssueFilters } from '@/query/issueService'

export type GanttModuleProps = {
  title: string
  viewMode?: 'Day' | 'Week' | 'Month'
  filters: IssueFilters
  startDate?: Date
  endDate?: Date
}

export default class GanttModule extends BaseModule<GanttModuleProps, Task[]> {
  fetchData = async (clearCache?: boolean) => {
    const { filters } = this.props
    const key = 'issues:' + JSON.stringify(filters)
    if (clearCache) dataStore.clear(key)

    const issues = await dataStore.cacheRead(key, () =>
      connectStore.issueService.issues(filters, { assignee: true })
    )
    issues.sort((a, b) => a.completedAt!.localeCompare(b.completedAt!))
    const issueToTask = (issue: QueryIssue): Task | null => {
      const assignee = issue.assignee ? connectStore.getName(issue.assignee) : undefined
      if (assignee === false) return null

      return {
        id: issue.id,
        name: `${issue.identifier} - ${issue.title}`,
        start: issue.startedAt || issue.createdAt,
        end: issue.completedAt || new Date().toISOString(),
        progress: issue.completedAt ? 100 : 0,
        subtitle: assignee || 'unassigned',
      }
    }

    const tasks = issues
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
