import ErrorMessage from '@/components/core/ErrorMessage'
import Pressable from '@/components/core/Pressable'
import { Repository } from '@/models'
import github, { PullRequest } from '@/query/github'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'
import { logger, unwrapError } from '@/utils'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { useStore } from '@nanostores/preact'
import axios from 'axios'
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
        .cacheRead(key, () => github.issues(repo.name, props.query))
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
    <div class="flex flex-col m-2 p-4 border border-gray-200 rounded-md flex-1 min-w-[400px]">
      <div class="flex items-center mb-2">
        <h1 class="flex-1 text-lg font-semibold text-gray-800">{props.title || 'Pull Requests'}</h1>
        <Pressable onClick={refresh} tooltip="Refresh data">
          <ArrowPathIcon class="h-4 w-4 text-gray-400" />
        </Pressable>
      </div>

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
            </a>
          ))}
      </div>
      <ErrorMessage error={error} />
    </div>
  )
}

export default PullRequestsModule
