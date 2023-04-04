import { API } from '@/api'
import BaseModule, { AnyBaseModule } from '@/modules/data/BaseModule'
import IssuesModule from '@/modules/data/IssuesModule'
import PullRequestsModule from '@/modules/data/PullRequestsModule'
import { DataModuleProps } from '@/modules/DataModuleFactory'
import AISummaryCard from '@/modules/ui/AISummaryCard'
import { QueryUser } from '@/query/types'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'
import { projectStore } from '@/stores/projectStore'
import { formatDistance } from 'date-fns'

type ModuleGroup = {
  description: string
  modules: DataModuleProps[]
}

export type AISummaryModuleProps = {
  title: string
  instructions: string
}

export default class AISummaryModule extends BaseModule<AISummaryModuleProps, string> {
  fetchData = async (clearCache?: boolean) => {
    const modules = dataStore.currentDashboard
    const moduleString = modules.map((m) => m.props.module).join(',')
    const key = 'summary:' + moduleString
    if (clearCache) dataStore.clear(key)

    return dataStore.cacheRead(key, async () => {
      const content = await Promise.all(modules.map((m) => moduleToText(m)).filter(Boolean))
      if (content.length == 0) return 'Nothing to summarize.'

      const prompt = content.join('\n\n').trim() + '\n\n' + this.props.instructions

      const result = await API.generateSummary(
        projectStore.currentProject.get()!,
        [{ role: 'user', content: prompt }],
        undefined,
        200
      )
      return result.response
    })
  }

  render = () => {
    return <AISummaryCard title={this.props.title} module={this} />
  }
}

const moduleToText = async (module: AnyBaseModule): Promise<string | null> => {
  const idToName = connectStore.idToName.get()
  const getName = (user: QueryUser) => {
    if (idToName[user.id] !== undefined) return idToName[user.id]
    return user.name
  }

  if (module instanceof IssuesModule) {
    const issues = await module.fetchData()
    if (issues.length == 0) return null
    return (
      module.props.title +
      ':\n' +
      issues
        .map((issue) => {
          const props = [issue.title]

          if (!issue.completedAt && issue.startedAt) {
            const started = new Date(issue.startedAt)
            const daysAgo = Math.round((Date.now() - started.getTime()) / (1000 * 60 * 60 * 24))
            if (daysAgo > 30) return null
          }

          if (issue.completedAt)
            props.push(`completed ${formatDistance(new Date(issue.completedAt), Date.now())} ago`)
          else if (issue.startedAt)
            props.push(`started ${formatDistance(new Date(issue.startedAt), Date.now())} ago`)
          else if (issue.createdAt)
            props.push(`created ${formatDistance(new Date(issue.createdAt), Date.now())} ago`)

          if (issue.assignee) {
            const name = getName(issue.assignee)
            if (name === false) return null
            props.push(`by ${name}`)
          }
          if (issue.labels?.length)
            props.push(`labels: ${issue.labels.map((l) => l.name).join(', ')}`)
          if (issue.priority) props.push(`priority: ${issue.priorityLabel}`)

          return `* ${props.join(', ')}`
        })
        .filter(Boolean)
        .join('\n')
    )
  } else if (module instanceof PullRequestsModule) {
    const pulls = await module.fetchData()
    if (pulls.length == 0) return null
    return (
      module.props.title +
      ':\n' +
      pulls
        .map((pull) => {
          const props = [pull.title]

          if (pull.closed_at)
            props.push(`merged ${formatDistance(new Date(pull.closed_at), Date.now())} ago`)
          else if (pull.created_at)
            props.push(`created ${formatDistance(new Date(pull.created_at), Date.now())} ago`)

          if (pull.comments) props.push(`${pull.comments} comments`)
          if (pull.user) {
            const name = getName(pull.user)
            if (name === false) return null
            props.push(`by ${name}`)
          }

          return `* ${props.join(', ')}`
        })
        .filter(Boolean)
        .join('\n')
    )
  }

  return null
}
