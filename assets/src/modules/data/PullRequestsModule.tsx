import BaseModule from '@/modules/data/BaseModule'
import PullRequestsCard from '@/modules/ui/PullRequestsCard'
import github from '@/query/github'
import { QueryPullRequest } from '@/query/types'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'

export type PullRequestsModuleProps = {
  id?: string
  title?: string
  query: string
}

const keyFunction = (repo: string, query: string) => `${repo}:pr:${query}`

export default class PullRequestsModule extends BaseModule<
  PullRequestsModuleProps,
  QueryPullRequest[]
> {
  fetchData = (clearCache?: boolean) => {
    const repos = connectStore.repos.get()
    const query = this.props.query

    const result = Promise.all(
      repos.map(async (repo) => {
        const key = keyFunction(repo.name, query)
        if (clearCache) dataStore.clear(key)
        const result = await dataStore.cacheRead(key, () => github.pulls(repo.name, query))
        return result.items.map((i) => ({ ...i, repo: repo.name }))
      })
    )

    return result.then((results) => results.flat())
  }

  render = () => {
    return <PullRequestsCard title={this.props.title} module={this} />
  }
}
