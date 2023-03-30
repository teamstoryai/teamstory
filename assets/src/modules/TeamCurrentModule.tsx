import { issuesFetch, useIssues } from '@/modules/IssuesModule'
import DataModule from '@/modules/ModuleCard'
import { pullRequestFetch, usePullRequests } from '@/modules/PullRequestsModule'
import github from '@/query/github'
import linear, { IssueFilters } from '@/query/linear'
import { QueryIssue, QueryPullRequest, QueryUser } from '@/query/types'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'
import { logger, unwrapError } from '@/utils'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { useStore } from '@nanostores/preact'
import { formatDistance } from 'date-fns'
import { StateUpdater, useEffect, useState } from 'preact/hooks'

export type TeamCurrentModuleProps = {
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

type Timeline = { ts: string; message: string }[]

type UserTimeline = { user: QueryUser; timeline: Timeline }

const NONE_USER = 'none'

const TeamCurrentModule = (props: TeamCurrentModuleProps) => {
  const [error, setError] = useState<Error>()
  const timelines = calculateUserInfoMap(props, setError)

  return (
    <DataModule title={props.title} className="lg:col-span-2" error={error}>
      <div className="grid grid-cols-4 divide-y divide-gray-200 -mx-4 -mb-4">
        {timelines.map((timeline) => (
          <UserRow key={timeline.user.id} data={timeline} />
        ))}
      </div>
    </DataModule>
  )
}

function UserRow({ data }: { data: UserTimeline }) {
  const today = new Date()
  return (
    <>
      <div className="flex items-center p-4 pr-2">
        <img
          className="h-12 w-12 rounded-full mr-2"
          src={
            data.user.avatar ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}`
          }
          alt=""
        />
        <div class="flex-1 truncate">
          <p className="text-sm font-medium text-indigo-600">{data.user.name}</p>
          <p className="mt-2 flex items-center text-sm text-gray-500">{data.user.email}</p>
        </div>
      </div>
      <div class="text-sm text-gray-800 col-span-3 p-4 pl-2">
        {data.timeline.map((event) => (
          <div className="flex items-center">
            <span class="flex-1 truncate">{event.message}</span>
            <span className="ml-2 text-gray-500 text-xs">
              {formatDistance(new Date(event.ts), today, { addSuffix: true })}
            </span>
          </div>
        ))}
      </div>
    </>
  )
}

const getUserInfo = (map: UserInfoMap, user: QueryUser) => {
  const id = user.id
  if (!map[id]) return (map[id] = new UserInfo(user))
  const info = map[id]
  mergeUsers(info.user, user)
  return info
}

function calculateUserInfoMap(
  props: TeamCurrentModuleProps,
  setError: StateUpdater<Error | undefined>
) {
  const [userInfos, setUserInfos] = useState<UserInfoMap>({})
  const repos = useStore(connectStore.repos)

  useEffect(() => {
    setUserInfos({})

    repos.forEach((repo) => {
      pullRequestFetch(repo.name, props.updatedPulls)
        .then((data) => {
          setUserInfos((prev) => {
            const map = { ...prev }
            data.items.forEach((pr) => {
              if (!pr.user) return
              const user = getUserInfo(map, pr.user)
              user.pullRequests.push(pr)
            })
            return map
          })
        })
        .catch(setError)
    })

    issuesFetch(props.updatedIssues)
      .then((data) => {
        setUserInfos((prev) => {
          const map = { ...prev }
          data.forEach((issue) => {
            const user = getUserInfo(map, issue.creator)
            user.issues.push(issue)

            if (issue.assignee) {
              const user = getUserInfo(map, issue.assignee)
              user.issues.push(issue)
            }
          })
          return map
        })
      })
      .catch(setError)

    linear.teamMembers().then((data) => {
      setUserInfos((prev) => {
        const map = { ...prev }
        data.forEach((user) => {
          getUserInfo(map, user)
        })
        return map
      })
    })
  }, [props.updatedIssues, props.updatedPulls])

  mergeUserInfos(userInfos)
  const timelines = Object.values(userInfos).map(eventsToTimeline)
  ;(window as any)['userInfos'] = userInfos
  timelines.sort((a, b) => a.user.name.localeCompare(b.user.name))

  return timelines
}

const mergeUsers = (u1: QueryUser, u2: QueryUser) => {
  Object.keys(u2).forEach((key) => {
    if ((u1 as any)[key] === undefined) (u1 as any)[key] = (u2 as any)[key]
  })
}

const mergeUserInfos = (map: UserInfoMap) => {
  const users = connectStore.users.get()

  Object.keys(map).forEach((id) => {
    const projectInfo = users[id]
    if (!projectInfo) return
    if (projectInfo.aliases) {
      projectInfo.aliases.forEach((alias) => {
        if (map[alias]) {
          mergeUsers(map[id].user, map[alias].user)
          map[id].pullRequests.push(...map[alias].pullRequests)
          map[id].issues.push(...map[alias].issues)
          delete map[alias]
        }
      })
    }
    if (projectInfo.name) {
      map[id].user.name = projectInfo.name
    }
  })
}

const eventsToTimeline = (user: UserInfo): UserTimeline => {
  const timeline: Timeline = []
  user.pullRequests.forEach((pr) => {
    timeline.push({
      ts: pr.created_at,
      message: `created PR #${pr.number}: ${pr.title}`,
    })
    if (pr.closed_at) {
      timeline.push({
        ts: pr.created_at,
        message: `merged PR #${pr.number}: ${pr.title}`,
      })
    }
  })
  user.issues.forEach((issue) => {
    if (issue.creator.id == user.user.id) {
      timeline.push({
        ts: issue.createdAt,
        message: `created issue ${issue.identifier}: ${issue.title}`,
      })
    }
    if (issue.startedAt && issue.assignee?.id == user.user.id) {
      timeline.push({
        ts: issue.startedAt,
        message: `started issue ${issue.identifier}: ${issue.title}`,
      })
    }
    if (issue.completedAt && issue.assignee?.id == user.user.id) {
      timeline.push({
        ts: issue.completedAt,
        message: `completed issue ${issue.identifier}: ${issue.title}`,
      })
    }
  })

  const sliced = timeline.sort((a, b) => b.ts.localeCompare(a.ts)).slice(0, 5)

  return { user: user.user, timeline: sliced }
}

export default TeamCurrentModule
