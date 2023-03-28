import DataModule from '@/modules/ModuleCard'
import { logger } from '@/utils'
import { StateUpdater, useEffect, useState } from 'preact/hooks'
import linear, { IssueFilters } from '@/query/linear'
import { dataStore } from '@/stores/dataStore'
import { QueryIssue, QueryLabel, QueryUser } from '@/query/types'

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
              {issue.user && (
                <>
                  <div>&bull;</div>
                  <div>
                    <DeferredUser promise={issue.user()} />
                  </div>
                </>
              )}
              {issue.labels && <Labels labels={issue.labels} />}
            </div>
            <div class="text-gray-800">{issue.title}</div>
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
    const key = 'issues:' + JSON.stringify(filters)
    if (clear) dataStore.clear(key)

    console.log('issues fetchin', key)
    dataStore
      .cacheRead(key, () => linear.issues(filters))
      .then((items) => {
        dataStore.storeData(storeDataKey, items)
        setIssues(items)
      })
      .catch(setError)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refresh = () => fetchData(true)

  return { issues, refresh }
}

const DeferredUser = ({ promise }: { promise: Promise<QueryUser> }) => {
  const [user, setUser] = useState<QueryUser>()
  useEffect(() => {
    promise.then(setUser).catch(logger.error)
  }, [promise])

  if (!user) return null
  return <>{user.name}</>
}

const Labels = ({ labels }: { labels: () => Promise<QueryLabel[]> }) => {
  const [labelsData, setLabelsData] = useState<QueryLabel[]>()
  useEffect(() => {
    labels().then(setLabelsData).catch(logger.error)
  }, [labels])

  if (!labelsData || labelsData.length == 0) return null

  return (
    <>
      <div>&bull;</div>
      {labelsData.map((label, i) => (
        <span key={i} style={{ color: label.color }}>
          {label.name}
        </span>
      ))}
    </>
  )
}

export default IssuesModule
