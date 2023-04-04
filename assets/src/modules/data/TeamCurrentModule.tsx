import linear, { IssueFilters } from '@/query/linear'
import { QueryIssue, QueryPullRequest, QueryUser } from '@/query/types'
import { connectStore, ProjectUserMap } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'
import BaseModule from '@/modules/data/BaseModule'
import TeamCurrentCard from '@/modules/ui/TeamCurrentCard'
import PullRequestsModule from '@/modules/data/PullRequestsModule'
import IssuesModule from '@/modules/data/IssuesModule'

export type TeamCurrentModuleProps = {
  id?: string
  title: string
  updatedPulls: string
  updatedIssues: IssueFilters
}

class UserInfo {
  constructor(public user: QueryUser) {}
  pullRequests: QueryPullRequest[] = []
  issues: QueryIssue[] = []
}

type UserInfoMap = { [key: string]: UserInfo }

type Timeline = { ts: Date; message: string; url?: string }[]

export type UserTimeline = { user: QueryUser; timeline: Timeline }

export default class TeamCurrentsModule extends BaseModule<TeamCurrentModuleProps, UserTimeline[]> {
  fetchData = async (clearCache?: boolean) => {
    const repos = connectStore.repos.get()
    const props = this.props

    const prModule = new PullRequestsModule({ query: props.updatedPulls })
    const updatedPulls = prModule.fetchData(clearCache)

    const issueModule = new IssuesModule({
      filters: props.updatedIssues,
      fields: { assignee: true, creator: true },
    })
    const updatedIssues = issueModule.fetchData(clearCache)

    const teamInfo = dataStore.cacheRead('linearTeam', () => linear.teamMembers(), 86400000)

    await Promise.all([updatedPulls, updatedIssues, teamInfo])

    const map: UserInfoMap = {}
    const knownItems = new Set<string>()

    ;(await updatedPulls).forEach((pr) => {
      if (!pr.user || knownItems.has(pr.html_url)) return
      knownItems.add(pr.html_url)
      const user = getUserInfo(map, pr.user)
      user.pullRequests.push(pr)
    })
    ;(await updatedIssues).forEach((issue) => {
      if (issue.assignee) {
        const user = getUserInfo(map, issue.assignee)
        user.issues.push(issue)
      }
      if (issue.creator && issue.creator.id != issue.assignee?.id) {
        const user = getUserInfo(map, issue.creator)
        user.issues.push(issue)
      }
    })
    ;(await teamInfo).forEach((user) => {
      if (user) getUserInfo(map, user)
    })

    const timelines = Object.values(map).map(eventsToTimeline)
    const connectUsers = connectStore.users.get()

    const merged = mergeTimelines(connectUsers, timelines)
    merged.forEach((item) => item.timeline.sort((a, b) => b.ts.getTime() - a.ts.getTime()))
    merged.sort((a, b) => a.user.name.localeCompare(b.user.name))
    return merged
  }

  render = () => {
    return <TeamCurrentCard title={this.props.title} module={this} />
  }
}

const getUserInfo = (map: UserInfoMap, user: QueryUser) => {
  const id = user.id
  if (!map[id]) return (map[id] = new UserInfo(user))
  const info = map[id]
  mergeUsers(info.user, user)
  return info
}

const mergeUsers = (u1: QueryUser, u2: QueryUser) => {
  Object.keys(u2).forEach((key) => {
    if ((u1 as any)[key] === undefined) (u1 as any)[key] = (u2 as any)[key]
  })
}

const mergeTimelines = (users: ProjectUserMap, timelines: UserTimeline[]) => {
  const map: { [id: string]: UserTimeline } = {}
  timelines.forEach((timeline) => {
    map[timeline.user.id] = timeline
  })

  Object.keys(map).forEach((id) => {
    const projectInfo = users[id]
    if (projectInfo?.aliases) {
      projectInfo.aliases.forEach((alias) => {
        if (alias != id && map[alias]) {
          mergeUsers(map[id].user, map[alias].user)
          map[id].timeline.push(...map[alias].timeline)
          delete map[alias]
        }
      })
    }
    if (projectInfo?.name) {
      map[id].user.name = projectInfo.name
    }
    if (projectInfo?.hidden) {
      delete map[id]
    }
    if (map[id] && map[id].timeline.length == 0) {
      delete map[id]
    }
  })
  return Object.values(map)
}

const MAX_TIMELINE_AGE = 10 * 86400000

const eventsToTimeline = (user: UserInfo): UserTimeline => {
  const timeline: Timeline = []
  user.pullRequests.forEach((pr) => {
    if (pr.closed_at) {
      timeline.push({
        ts: new Date(pr.created_at),
        message: `merged PR #${pr.number}: ${pr.title}`,
        url: pr.html_url,
      })
    } else {
      timeline.push({
        ts: new Date(pr.created_at),
        message: `created PR #${pr.number}: ${pr.title}`,
        url: pr.html_url,
      })
    }
  })
  user.issues.forEach((issue) => {
    if (issue.completedAt && issue.assignee?.id == user.user.id) {
      timeline.push({
        ts: new Date(issue.completedAt),
        message: `completed issue ${issue.identifier}: ${issue.title}`,
        url: issue.url,
      })
    } else if (issue.startedAt && issue.assignee?.id == user.user.id) {
      timeline.push({
        ts: new Date(issue.startedAt),
        message: `started issue ${issue.identifier}: ${issue.title}`,
        url: issue.url,
      })
    } else if (issue.creator?.id == user.user.id) {
      timeline.push({
        ts: new Date(issue.createdAt),
        message: `created issue ${issue.identifier}: ${issue.title}`,
        url: issue.url,
      })
    }
  })

  const now = Date.now()
  const filtered = timeline.filter((item) => item.ts.getTime() > now - MAX_TIMELINE_AGE)

  return { user: user.user, timeline: filtered }
}
