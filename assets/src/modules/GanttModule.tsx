import DataModule from '@/modules/ModuleCard'
import linear, { IssueFilters } from '@/query/linear'
import { QueryIssue } from '@/query/types'
import { dataStore, dateToYMD } from '@/stores/dataStore'
import { logger } from '@/utils'

import Gantt, { Task } from '@/gantt'
import { MutableRef, useEffect, useRef, useState } from 'preact/hooks'

export type GanttModuleProps = {
  title: string
  viewMode?: 'Day' | 'Week' | 'Month'
  filters: IssueFilters
}

const GanttModule = (props: GanttModuleProps) => {
  const [error, setError] = useState<Error>()
  const divRef = useRef<HTMLDivElement>(null)
  const gantt: MutableRef<Gantt | null> = useRef<Gantt | null>(null)

  const fetchData = (clear?: boolean) => {
    const { filters } = props
    const key = 'issues:' + JSON.stringify(filters)
    if (clear) dataStore.clear(key)

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
        logger.debug('GanttModule', 'tasks', tasks)

        if (!gantt.current) {
          gantt.current = new Gantt(divRef.current, tasks, {
            view_mode: props.viewMode || 'Day',
            read_only: true,
            popup_trigger: 'mouseover',
            footer_padding: 0,
          })
        } else {
          gantt.current.refresh(tasks)
        }
      })
      .catch((e) => {
        logger.error(e)
        setError(e)
      })
  }

  useEffect(() => {
    if (!divRef.current) return
    fetchData()
  }, [divRef.current])

  const refresh = () => fetchData(true)

  return (
    <DataModule title={props.title} className="lg:col-span-2" error={error} refresh={refresh}>
      <div ref={divRef}></div>
    </DataModule>
  )
}

export default GanttModule

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
