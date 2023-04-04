import BaseModule from '@/modules/data/BaseModule'
import PullRequestsCard from '@/modules/ui/PullRequestsCard'
import StatsCard from '@/modules/ui/StatsCard'
import github from '@/query/github'
import linear, { IssueFilters } from '@/query/linear'
import { QueryPullRequest } from '@/query/types'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'

export type StatsModuleProps = {
  title: string
  currentPeriod: IssueFilters
  prevPeriod: IssueFilters
}

type StatsMap = {
  [label: string]: number
}

export type Stat = {
  label: string
  count: number
  prev: number
  color: string
}

export const STATS_NO_LABEL = '(none)'

export default class StatsModule extends BaseModule<StatsModuleProps, Stat[]> {
  fetchData = (clearCache?: boolean) => {
    return Promise.all([getStats(this.props.prevPeriod), getStats(this.props.currentPeriod)]).then(
      ([prevStats, stats]) => {
        const statsArray: Stat[] = []
        for (const [label, count] of Object.entries(stats)) {
          const prev = prevStats[label] || 0
          statsArray.push({
            label,
            count,
            prev,
            color: count == prev ? 'gray' : count > prev ? 'green' : 'red',
          })
        }
        return statsArray.sort((a, b) => b.count - a.count).slice(0, 4)
      }
    )
  }

  render = () => {
    return <StatsCard title={this.props.title} module={this} />
  }
}

const getStats = async (filters: IssueFilters) => {
  const stats: StatsMap = {}
  const key = 'issues:' + JSON.stringify(filters)
  const issues = await dataStore.cacheRead(key, () => linear.issues(filters, { labels: true }))
  for (const issue of issues) {
    const labels = issue.labels
    labels?.forEach((label) => {
      stats[label.name] = (stats[label.name] || 0) + 1
    })
    if (!labels || !labels.length) {
      stats[STATS_NO_LABEL] = (stats[STATS_NO_LABEL] || 0) + 1
    }
  }
  return stats
}
