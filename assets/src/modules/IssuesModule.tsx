import DataModule from '@/modules/ModuleCard'
import { logger, unwrapError } from '@/utils'
import { useEffect, useState } from 'preact/hooks'
import type { Issue } from '@linear/sdk/dist/_generated_documents'
import linear, { IssueFilters } from '@/query/linear'
import { dataStore } from '@/stores/dataStore'
import { QueryIssue, QueryUser } from '@/query/types'

export type IssuesModuleProps = {
  title: string
  filters: IssueFilters
}

const IssuesModule = (props: IssuesModuleProps) => {
  const [error, setError] = useState<Error>()
  const [issues, setIssues] = useState<QueryIssue[]>([])

  const fetchData = (clear?: boolean) => {
    const { filters } = props
    const key = 'issues:' + JSON.stringify(filters)
    if (clear) dataStore.clear(key)

    dataStore
      .cacheRead(key, () => linear.issues(filters))
      .then(setIssues)
      .catch(setError)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const refresh = () => fetchData(true)

  return (
    <DataModule title={props.title} count={issues.length} refresh={refresh} error={error}>
      <div class="flex flex-col w-full gap-2">
        {Object.values(issues)
          .flat()
          .map((issue) => (
            <a
              href={issue.url}
              target="_blank"
              rel="noreferrer"
              key={issue.id}
              class="hover:bg-gray-100 cursor-pointer rounded-md -m-1 p-1"
            >
              <div class="text-sm flex gap-2">
                <div class="text-teal-500">{issue.identifier}</div>
                {issue.user && (
                  <div class="text-gray-500">
                    &bull; <DeferredUser promise={issue.user()} />
                  </div>
                )}
              </div>
              <div class="text-gray-800">{issue.title}</div>
            </a>
          ))}
      </div>
    </DataModule>
  )
}

const DeferredUser = ({ promise }: { promise: Promise<QueryUser> }) => {
  const [user, setUser] = useState<QueryUser>()
  useEffect(() => {
    promise.then(setUser).catch(logger.error)
  }, [promise])

  if (!user) return null
  return <>{user.name}</>
}

export default IssuesModule
