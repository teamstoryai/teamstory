import BaseModule from '@/modules/data/BaseModule'
import PullRequestsCard from '@/modules/ui/PullRequestsCard'
import { PRFilters } from '@/query/codeService'
import { QueryPullRequest } from '@/query/types'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'

export type PullRequestsModuleProps = {
  id?: string
  title?: string
  filters: PRFilters
}

const keyFunction = (repo: string, filters: PRFilters) => `${repo}:pr:${JSON.stringify(filters)}`

export default class PullRequestsModule extends BaseModule<
  PullRequestsModuleProps,
  QueryPullRequest[]
> {
  fetchData = (clearCache?: boolean) => {
    const repos = connectStore.repos.get()
    const filters = this.props.filters

    const result = Promise.all(
      repos.map(async (repo) => {
        const key = keyFunction(repo.name, filters)
        if (clearCache) dataStore.clear(key)
        const result = await dataStore.cacheRead(key, () =>
          connectStore.codeService.pulls(repo.name, filters)
        )
        return result.map((i) => ({ ...i, repo: repo.name }))
      })
    )

    return result.then((results) => results.flat())
  }

  render = () => {
    return <PullRequestsCard title={this.props.title} module={this} />
  }
}
