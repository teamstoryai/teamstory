import Pressable from '@/components/core/Pressable'
import { issuesFetch, useIssues } from '@/modules/IssuesModule'
import DataModule from '@/modules/ModuleCard'
import { pullRequestFetch, usePullRequests } from '@/modules/PullRequestsModule'
import github from '@/query/github'
import linear, { IssueFilters } from '@/query/linear'
import { QueryIssue, QueryPullRequest, QueryUser } from '@/query/types'
import { connectStore, ProjectUserInfo, ProjectUserMap } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'
import { logger, unwrapError } from '@/utils'
import { ChatBubbleLeftIcon, CheckIcon } from '@heroicons/react/24/outline'
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

type Timeline = { ts: string; message: string; url?: string }[]

type UserTimeline = { user: QueryUser; timeline: Timeline }

const NONE_USER = 'none'

const TeamCurrentModule = (props: TeamCurrentModuleProps) => {
  const [error, setError] = useState<Error>()
  const timelines = calculateUserInfoMap(props, setError)
  const [selected, setSelected] = useState<string[]>([])

  const merge = () => {
    const users = connectStore.users.get()
    let change: ProjectUserInfo = {}
    let changeId = selected[0]
    for (const id of selected) {
      if (users[id]) {
        changeId = id
        change = users[id]
      }
    }
    if (!change) change = {}
    if (!change.aliases) change.aliases = selected
    else change.aliases = Array.from(new Set([...change.aliases, ...selected]))
    change.aliases = change.aliases.filter((a) => a != changeId)

    connectStore.updateUsers({ [changeId]: change })
  }

  const itemsPerRow = Math.max(Math.min(10, 40 / timelines.length), 4)

  return (
    <DataModule title={props.title} className="lg:col-span-2" error={error}>
      <div class="-ml-1">
        {selected.length > 1 && (
          <Pressable className="inline-block text-sm text-blue-600 mb-4" onClick={merge}>
            Merge users
          </Pressable>
        )}
      </div>
      <div className="grid grid-cols-4 divide-y divide-gray-200 -mx-4 -mb-4">
        {timelines.map((timeline) => (
          <UserRow
            key={timeline.user.id}
            data={timeline}
            selected={selected.indexOf(timeline.user.id) > -1}
            setSelected={setSelected}
            itemsPerRow={itemsPerRow}
          />
        ))}
      </div>
    </DataModule>
  )
}

function UserRow({
  data,
  selected,
  setSelected,
  itemsPerRow,
}: {
  data: UserTimeline
  selected: boolean
  setSelected: StateUpdater<string[]>
  itemsPerRow: number
}) {
  const today = new Date()
  const select = () => {
    if (selected) setSelected((selected) => selected.filter((id) => id !== data.user.id))
    else setSelected((selected) => [...selected, data.user.id])
  }
  return (
    <>
      <div className="flex items-center p-4 pr-2">
        <div className="mr-2 relative">
          <img
            className="h-12 w-12 rounded-full"
            src={
              data.user.avatar ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(data.user.name)}`
            }
            alt=""
          />
          <div
            onClick={select}
            className={`absolute rounded-full top-0 left-0 w-full h-full hover:bg-gray-800/50
              cursor-pointer ${selected ? 'bg-gray-800/80' : ''}`}
            title="Merge"
          >
            {selected && <CheckIcon class="ml-2 mt-2 h-8 w-8 text-green-500" />}
          </div>
        </div>
        <div class="flex-1 truncate">
          <p className="text-sm font-medium text-indigo-600">{data.user.name}</p>
          <p className="mt-2 flex items-center text-sm text-gray-500">{data.user.email}</p>
        </div>
      </div>
      <div class="text-sm text-gray-800 col-span-3 p-4 pl-2">
        {data.timeline.slice(0, itemsPerRow).map((event) => (
          <a href={event.url} target="_blank" className="flex items-center hover:underline">
            <span class="flex-1 truncate">{event.message}</span>
            <span className="ml-2 text-gray-500 text-xs">
              {formatDistance(new Date(event.ts), today, { addSuffix: true })}
            </span>
          </a>
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
  const connectUsers = useStore(connectStore.users)

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

    issuesFetch(props.updatedIssues, {
      assignee: true,
      creator: true,
    })
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

    dataStore
      .cacheRead('linearTeam', () => linear.teamMembers(), 86400000)
      .then((data) => {
        setUserInfos((prev) => {
          const map = { ...prev }
          data.forEach((user) => {
            getUserInfo(map, user)
          })
          return map
        })
      })
  }, [props.updatedIssues, props.updatedPulls])

  const timelines = Object.values(userInfos).map(eventsToTimeline)
  const merged = mergeTimelines(connectUsers, timelines)
  merged.forEach((item) => item.timeline.sort((a, b) => b.ts.localeCompare(a.ts)))

  merged.sort((a, b) => a.user.name.localeCompare(b.user.name))
  ;(window as any)['timelines'] = merged

  return merged
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
    if (!projectInfo) return
    if (projectInfo.aliases) {
      projectInfo.aliases.forEach((alias) => {
        if (alias != id && map[alias]) {
          mergeUsers(map[id].user, map[alias].user)
          map[id].timeline.push(...map[alias].timeline)
          delete map[alias]
        }
      })
    }
    if (projectInfo.name) {
      map[id].user.name = projectInfo.name
    }
  })
  return Object.values(map)
}

const eventsToTimeline = (user: UserInfo): UserTimeline => {
  const timeline: Timeline = []
  user.pullRequests.forEach((pr) => {
    timeline.push({
      ts: pr.created_at,
      message: `created PR #${pr.number}: ${pr.title}`,
      url: pr.html_url,
    })
    if (pr.closed_at) {
      timeline.push({
        ts: pr.created_at,
        message: `merged PR #${pr.number}: ${pr.title}`,
        url: pr.html_url,
      })
    }
  })
  user.issues.forEach((issue) => {
    if (issue.creator.id == user.user.id) {
      timeline.push({
        ts: issue.createdAt,
        message: `created issue ${issue.identifier}: ${issue.title}`,
        url: issue.url,
      })
    }
    if (issue.startedAt && issue.assignee?.id == user.user.id) {
      timeline.push({
        ts: issue.startedAt,
        message: `started issue ${issue.identifier}: ${issue.title}`,
        url: issue.url,
      })
    }
    if (issue.completedAt && issue.assignee?.id == user.user.id) {
      timeline.push({
        ts: issue.completedAt,
        message: `completed issue ${issue.identifier}: ${issue.title}`,
        url: issue.url,
      })
    }
  })

  return { user: user.user, timeline }
}

export default TeamCurrentModule
