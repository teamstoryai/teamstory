import DataModule from '@/modules/DataModule'
import github, { PullRequest } from '@/query/github'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'
import { logger, unwrapError } from '@/utils'
import { useStore } from '@nanostores/preact'
import { formatDistance } from 'date-fns'
import { useEffect, useState } from 'preact/hooks'

type Props = {
  title: string
  query: string
}

type PR = PullRequest & { repo: string }

const PullRequestsModule = (props: Props) => {
  const [error, setError] = useState('')
  const [prData, setPrData] = useState<{ [repo: string]: PR[] }>({})
  const repos = useStore(connectStore.repos)

  const fetchData = (clear?: boolean) => {
    repos.forEach((repo) => {
      const key = `${repo.name}:pr:${props.query}`
      if (clear) dataStore.clear(key)
      dataStore
        .cacheRead(key, () => github.pulls(repo.name, props.query))
        .then((response) => {
          const items = response.items.map((i) => ({ ...i, repo: repo.name }))
          logger.debug(key, items)
          setPrData((prData) => ({ ...prData, [repo.name]: items }))
        })
        .catch((e) => {
          logger.error(e)
          setError(unwrapError(e))
        })
    })
  }

  useEffect(() => {
    if (!repos.length) return
    fetchData()
  }, [repos, props.query])

  const refresh = () => fetchData(true)

  return (
    <DataModule title={props.title} refresh={refresh} error={error}>
      <div class="flex flex-col w-full gap-2">
        {Object.values(prData)
          .flat()
          .map((pr) => (
            <a
              href={pr.html_url}
              target="_blank"
              rel="noreferrer"
              key={pr.id}
              class="hover:bg-gray-100 cursor-pointer rounded-md -m-1 p-1"
            >
              {repos.length > 1 && <div class="text-sm text-teal-500">{pr.repo}</div>}
              <div class="text-gray-800">{pr.title}</div>
              {!pr.closed_at && (
                <div class="text-gray-500 text-xs">
                  #{pr.number} opened {formatDistance(new Date(pr.created_at), new Date())} ago by{' '}
                  {pr.user?.login}
                </div>
              )}
              {pr.closed_at && (
                <div class="text-gray-500 text-xs">
                  #{pr.number} by {pr.user?.login} was merged{' '}
                  {formatDistance(new Date(pr.closed_at), new Date())} ago
                </div>
              )}
            </a>
          ))}
      </div>
    </DataModule>
  )
}

export default PullRequestsModule
