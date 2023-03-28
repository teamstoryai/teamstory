import DataModule from '@/modules/ModuleCard'
import linear, { IssueFilters } from '@/query/linear'
import { QueryIssue } from '@/query/types'
import { dataStore, dateToYMD } from '@/stores/dataStore'
import { logger } from '@/utils'

import Gantt, { Task } from '@/gantt'
import { useEffect, useRef, useState } from 'preact/hooks'

export type GanttModuleProps = {
  title: string
  viewMode?: 'Day' | 'Week' | 'Month'
  filters: IssueFilters
}

const GanttModule = (props: GanttModuleProps) => {
  const [error, setError] = useState<Error>()
  const divRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!divRef.current) return

    const { filters } = props
    const key = 'issues:' + JSON.stringify(filters)

    dataStore
      .cacheRead(key, () => linear.issues(filters))
      .then((issues) => {
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
        if (tasks.length == 0) return
        logger.info('GanttModule', 'tasks', tasks)

        const gantt = new Gantt(divRef.current, tasks, {
          view_mode: props.viewMode || 'Day',
          read_only: true,
          popup_trigger: 'mouseover',
          footer_padding: 0,
        })
        ;(window as any)['gantt'] = gantt
      })
      .catch((e) => {
        logger.error(e)
        setError(e)
      })
  }, [divRef.current])

  return (
    <DataModule title={props.title} className="lg:col-span-2" error={error}>
      <div ref={divRef}></div>
    </DataModule>
  )
}

export default GanttModule

const duration = (issue: QueryIssue) =>
  issue.startedAt ? (issue.completedAt || new Date()).getTime() - issue.startedAt.getTime() : 0

const issueToTask = (issue: QueryIssue): Task => ({
  id: issue.id,
  name: `${issue.identifier} - ${issue.title}`,
  start: dateToYMD(issue.startedAt || issue.createdAt),
  end: dateToYMD(issue.completedAt || new Date()),
  progress: issue.completedAt ? 100 : 0,
})
