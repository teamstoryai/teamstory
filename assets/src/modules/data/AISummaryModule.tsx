import { API } from '@/api'
import BaseModule, { AnyBaseModule } from '@/modules/data/BaseModule'
import IssuesModule from '@/modules/data/IssuesModule'
import PullRequestsModule from '@/modules/data/PullRequestsModule'
import { DataModuleProps } from '@/modules/DataModuleFactory'
import AISummaryCard from '@/modules/ui/AISummaryCard'
import fakeService from '@/query/fakeService'
import { QueryIssue, QueryLabel, QueryPullRequest, QueryUser } from '@/query/types'
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
  rememberKey?: string
}

const LS_LAST_VISIT = 'lastVisit:'

export default class AISummaryModule extends BaseModule<AISummaryModuleProps, string> {
  fetchData = async (clearCache?: boolean) => {
    const modules = dataStore.currentDashboard
    const moduleString = modules.map((m) => m.props.module).join(',')
    const key = 'summary:' + moduleString
    const project = projectStore.currentProject.get()!
    const lsKey = this.props.rememberKey
      ? LS_LAST_VISIT + this.props.rememberKey + ':' + project.id
      : undefined

    if (clearCache) {
      dataStore.clear(key)
      // if (lsKey) localStorage.removeItem(lsKey)
    }

    if (project.sample && !clearCache) {
      return fakeService.aiSummary(this.props.instructions)
    }

    return dataStore.cacheRead(key, async () => {
      const lastVisit = lsKey ? localStorage.getItem(lsKey) : null
      const lastVisitDate = lastVisit ? new Date(lastVisit) : undefined

      const content = (
        await Promise.all(modules.map((m) => moduleToText(m, lastVisitDate)).filter(Boolean))
      ).filter(Boolean)
      if (content.length == 0) return ''

      const prompt = content.join('\n\n').trim() + '\n\n' + this.props.instructions

      const result = await API.generateSummary(
        projectStore.currentProject.get()!,
        [{ role: 'user', content: prompt }],
        undefined,
        200
      )

      if (lsKey) localStorage.setItem(lsKey, new Date().toISOString())

      return result.response
    })
  }

  render = () => {
    return <AISummaryCard title={this.props.title} module={this} />
  }
}

const moduleToText = async (module: AnyBaseModule, updatedAfter?: Date): Promise<string | null> => {
  if (module instanceof IssuesModule) {
    const issues = await module.fetchData()
    if (issues.length == 0) return null

    const data = issues
      .map((issue: QueryIssue) => {
        const props = ['"' + issue.title + '"']

        if (!issue.completedAt && issue.startedAt) {
          const started = new Date(issue.startedAt)
          const daysAgo = Math.round((Date.now() - started.getTime()) / (1000 * 60 * 60 * 24))
          if (daysAgo > 30) return null
        }

        if (issue.completedAt) props.push(`completed`)
        else if (issue.startedAt) props.push(`started`)
        else if (issue.createdAt) props.push(`created`)

        const latestDate = issue.completedAt || issue.startedAt || issue.createdAt
        if (updatedAfter && new Date(latestDate) < updatedAfter) return null

        if (issue.assignee) {
          const name = connectStore.getName(issue.assignee)
          if (name === false) return null
          props.push(`by ${name}`)
        }
        if (issue.labels?.length)
          props.push(`labels: ${issue.labels.map((l: QueryLabel) => l.name).join(', ')}`)
        if (issue.priority) props.push(`priority: ${issue.priorityLabel}`)

        return `* ${props.join(', ')}`
      })
      .filter(Boolean)
    if (!data.length) return null

    return module.props.title + ':\n' + data.join('\n')
  } else if (module instanceof PullRequestsModule) {
    const pulls = await module.fetchData()
    if (pulls.length == 0) return null
    const data = pulls
      .map((pull: QueryPullRequest) => {
        const props = ['"' + pull.title + '"']

        if (pull.closed_at) props.push(`merged`)
        else if (pull.created_at) props.push(`created`)

        const latestDate = pull.closed_at || pull.created_at
        if (updatedAfter && new Date(latestDate) < updatedAfter) return null

        if (pull.comments) props.push(`${pull.comments} comments`)
        if (pull.user) {
          const name = connectStore.getName(pull.user)
          if (name === false) return null
          props.push(`by ${name}`)
        }

        return `* ${props.join(', ')}`
      })
      .filter(Boolean)

    if (!data.length) return null
    return module.props.title + ':\n' + data.join('\n')
  }

  return null
}
