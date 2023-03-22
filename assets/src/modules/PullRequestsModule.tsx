import ErrorMessage from '@/components/core/ErrorMessage'
import { Repository } from '@/models'
import github, { PullRequest } from '@/query/github'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'
import { logger, unwrapError } from '@/utils'
import { useStore } from '@nanostores/preact'
import axios from 'axios'
import { useEffect, useState } from 'preact/hooks'

type Props = {
  title: string
  query: string
}

const PullRequestsModule = (props: Props) => {
  const [error, setError] = useState('')
  const [prData, setPrData] = useState<PullRequest[]>([])
  const repos = useStore(connectStore.repos)

  useEffect(() => {
    if (!repos.length) return

    setPrData([])
    repos.forEach((repo) => {
      const key = `${repo.name}:pr:${props.query}`
      dataStore
        .cacheRead(key, async () => {
          const response = await github.issues(repo.name, props.query)
          const items = response.items
          logger.debug(key, items)
          setPrData((prData) => [...prData, ...items])
        })
        .catch((e) => {
          logger.error(e)
          setError(unwrapError(e))
        })
    })
  }, [repos, props.query])

  return (
    <div class="flex flex-col m-2 p-2 border border-gray-400 rounded-md flex-1 min-w-[400px]">
      <h1 class="text-lg font-semibold my-2">{props.title || 'Pull Requests'}</h1>

      <div class="flex flex-col w-full">
        {prData.map((pr, i) => (
          <div class="flex flex-row items-center gap-2 my-2" key={i}>
            {pr.title}
          </div>
        ))}
      </div>
      <ErrorMessage error={error} />
    </div>
  )
}

export default PullRequestsModule
