import DataModule from '@/modules/ModuleCard'
import { logger } from '@/utils'
import { StateUpdater, useCallback, useEffect, useState } from 'preact/hooks'
import linear, { IssueFilters, LinearIssueFields } from '@/query/linear'
import { dataStore } from '@/stores/dataStore'
import { QueryIssue, QueryLabel, QueryUser } from '@/query/types'
import { formatDistance } from 'date-fns'

export type IssuesModuleProps = {
  id?: string
  title: string
  filters: IssueFilters
}

const IssuesModule = (props: IssuesModuleProps) => {
  const [error, setError] = useState<Error>()

  const { issues, refresh } = useIssues(props.filters, setError, props.id)

  return (
    <DataModule title={props.title} count={issues.length} refresh={refresh} error={error}>
      <div class="flex flex-col w-full gap-2">
        {issues.map((issue) => (
          <a
            href={issue.url}
            target="_blank"
            rel="noreferrer"
            key={issue.id}
            class="hover:bg-gray-100 cursor-pointer rounded-md -m-1 p-1"
          >
            <div class="text-sm flex gap-2 text-gray-500">
              <div class="text-teal-500">{issue.identifier}</div>
              {issue.priority ? <Priority issue={issue} /> : null}
              {issue.assignee && (
                <>
                  <div>&bull;</div>
                  <div>{issue.assignee.name}</div>
                </>
              )}
              {issue.labels && <Labels labels={issue.labels} />}
            </div>
            <div class="text-gray-800">{issue.title}</div>
            <div class="text-gray-500 text-xs">
              {issue.completedAt
                ? `completed ${formatDistance(new Date(issue.completedAt!), new Date())} ago`
                : issue.startedAt
                ? `started ${formatDistance(new Date(issue.startedAt!), new Date())} ago`
                : `created ${formatDistance(new Date(issue.createdAt!), new Date())} ago`}
            </div>
          </a>
        ))}
        {!issues.length && <div class="my-8 self-center text-gray-400">Nothing to show</div>}
      </div>
    </DataModule>
  )
}

export function useIssues(
  filters: IssueFilters,
  setError: StateUpdater<Error | undefined>,
  storeDataKey?: string
) {
  const [issues, setIssues] = useState<QueryIssue[]>([])

  const fetchData = (clear?: boolean) => {
    issuesFetch(
      filters,
      {
        assignee: true,
        labels: true,
      },
      clear
    )
      .then((items) => {
        dataStore.storeData(storeDataKey, items)
        setIssues(items || [])
      })
      .catch(setError)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refresh = useCallback(() => fetchData(true), [filters])

  return { issues, refresh }
}

export function issuesFetch(
  filters: IssueFilters,
  fields: LinearIssueFields,
  clearCache?: boolean
) {
  const key = 'issues:' + JSON.stringify(filters)
  if (clearCache) dataStore.clear(key)
  return dataStore.cacheRead(key, () => linear.issues(filters, fields))
}

const Labels = ({ labels }: { labels: QueryLabel[] }) => {
  if (!labels || labels.length == 0) return null

  return (
    <>
      <div>&bull;</div>
      {labels.map((label, i) => (
        <span key={i} style={{ color: label.color }}>
          {label.name}
        </span>
      ))}
    </>
  )
}

const Priority = ({ issue }: { issue: QueryIssue }) => {
  const color = issue.priority == 1 ? 'red' : issue.priority == 2 ? 'orange' : 'green'
  return (
    <>
      <div>&bull;</div>
      <span style={{ color: color }}>{issue.priorityLabel}</span>
    </>
  )
}

export default IssuesModule
