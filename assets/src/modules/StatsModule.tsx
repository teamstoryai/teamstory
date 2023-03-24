import DataModule from '@/modules/ModuleCard'
import linear, { IssueFilters } from '@/query/linear'
import { QueryIssue } from '@/query/types'
import { dataStore } from '@/stores/dataStore'
import { pluralize, toTitleCase } from '@/utils'
import { ArrowDownIcon, ArrowUpIcon, Bars2Icon } from '@heroicons/react/24/outline'
import { useEffect, useState } from 'preact/hooks'

export type StatsModuleProps = {
  title: string
  currentPeriod: IssueFilters
  prevPeriod: IssueFilters
}

type StatsMap = {
  [label: string]: number
}

type Stat = {
  label: string
  count: number
  prev: number
  color: string
}

const NO_LABEL = '(none)'

const StatsModule = (props: StatsModuleProps) => {
  const [error, setError] = useState<Error>()
  const [current, setCurrent] = useState<Stat[]>([])

  const fetchData = () => {
    Promise.all([getStats(props.prevPeriod), getStats(props.currentPeriod)])
      .then(([prevStats, stats]) => {
        console.log('meowy', props, prevStats, stats)
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
        setCurrent(statsArray.sort((a, b) => b.count - a.count).slice(0, 4))
      })
      .catch(setError)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <DataModule title={props.title} error={error}>
      {current.map((stat, i) => (
        <div class="py-2" key={i}>
          <dt class="text-base font-normal text-gray-900">
            {stat.label == NO_LABEL
              ? current.length > 1
                ? 'Other Issues'
                : 'Issues'
              : toTitleCase(stat.label) + 's'}
          </dt>
          <dd class="mt-1 flex items-baseline justify-between md:block lg:flex">
            <div class="flex items-baseline text-2xl font-semibold text-indigo-600">
              {stat.count}
              <span class="ml-2 text-sm font-medium text-gray-500">from {stat.prev}</span>
            </div>

            <div
              class={
                `inline-flex items-baseline rounded-full px-2.5 py-0.5 text-sm font-medium md:mt-2 lg:mt-0 ` +
                `bg-${stat.color}-100 text-${stat.color}-800`
              }
            >
              {stat.count < stat.prev ? (
                <ArrowDownIcon class="h-4 w-4" />
              ) : stat.count > stat.prev ? (
                <ArrowUpIcon class="h-4 w-4" />
              ) : (
                <Bars2Icon class="h-4 w-4" />
              )}
            </div>
          </dd>
        </div>
      ))}
    </DataModule>
  )
}

const getStats = async (filters: IssueFilters) => {
  const stats: StatsMap = {}
  const key = 'issues:' + JSON.stringify(filters)
  const issues = await dataStore.cacheRead(key, () => linear.issues(filters))
  for (const issue of issues) {
    const labels = await issue.labels?.()
    labels?.forEach((label) => {
      stats[label] = (stats[label] || 0) + 1
    })
    if (!labels || !labels.length) {
      stats[NO_LABEL] = (stats[NO_LABEL] || 0) + 1
    }
  }
  return stats
}

export default StatsModule
