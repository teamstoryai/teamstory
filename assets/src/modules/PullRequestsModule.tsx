import DataModule from '@/modules/ModuleCard'
import github from '@/query/github'
import { QueryPullRequest } from '@/query/types'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'
import { logger, unwrapError } from '@/utils'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { useStore } from '@nanostores/preact'
import { formatDistance } from 'date-fns'
import { StateUpdater, useCallback, useEffect, useRef, useState } from 'preact/hooks'

export type PullRequestsModuleProps = {
  id?: string
  title: string
  query: string
}

const PullRequestsModule = (props: PullRequestsModuleProps) => {
  const [error, setError] = useState<Error>()
  const repos = useStore(connectStore.repos)
  const { data, refresh } = usePullRequests(props.query, setError, props.id)

  return (
    <DataModule title={props.title} refresh={refresh} error={error} count={data.length}>
      <div class="flex flex-col w-full gap-2">
        {data.map((pr) => (
          <a
            href={pr.html_url}
            target="_blank"
            rel="noreferrer"
            key={pr.number}
            class="hover:bg-gray-100 cursor-pointer rounded-md -m-1 p-1 flex items-center"
          >
            <div class="flex-1">
              {repos.length > 1 && <div class="text-sm text-teal-500">{pr.repo}</div>}
              <div class="text-gray-800">{pr.title}</div>
              {!pr.closed_at && (
                <div class="text-gray-500 text-xs">
                  #{pr.number} opened {formatDistance(new Date(pr.created_at), new Date())} ago by{' '}
                  {pr.user.name}
                </div>
              )}
              {pr.closed_at && (
                <div class="text-gray-500 text-xs">
                  #{pr.number} by {pr.user.name} was merged{' '}
                  {formatDistance(new Date(pr.closed_at), new Date())} ago
                </div>
              )}
            </div>
            {pr.comments > 0 && (
              <div class="flex text-gray-400">
                <ChatBubbleLeftIcon class="h-4 w-4 mr-2" />
                <div class="text-xs">{pr.comments}</div>
              </div>
            )}
          </a>
        ))}
        {!data.length && <div class="my-8 self-center text-gray-400">Nothing to show</div>}
      </div>
    </DataModule>
  )
}

export function usePullRequests(
  query: string,
  setError: StateUpdater<Error | undefined>,
  storeDataKey?: string
) {
  const prData = useRef<{ [repo: string]: QueryPullRequest[] }>({})
  const [allPRs, setAllPRs] = useState<QueryPullRequest[]>([])
  const repos = useStore(connectStore.repos)

  const fetchData = (clear?: boolean) => {
    repos.forEach((repo) => {
      const key = `${repo.name}:pr:${query}`
      if (clear) dataStore.clear(key)
      dataStore
        .cacheRead(key, () => github.pulls(repo.name, query))
        .then((response) => {
          const items = response.items.map((i) => ({ ...i, repo: repo.name }))
          dataStore.storeData(storeDataKey, items)

          prData.current = { ...prData.current, [repo.name]: items }
          setAllPRs(Object.values(prData.current).flat())
        })
        .catch(setError)
    })
  }

  useEffect(() => {
    if (!repos.length) return
    fetchData()
  }, [repos, query])

  const refresh = useCallback(() => fetchData(true), [])

  return { data: allPRs, refresh }
}

export default PullRequestsModule
