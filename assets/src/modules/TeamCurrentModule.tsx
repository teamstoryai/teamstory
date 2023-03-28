import { useIssues } from '@/modules/IssuesModule'
import DataModule from '@/modules/ModuleCard'
import { usePullRequests } from '@/modules/PullRequestsModule'
import github from '@/query/github'
import { IssueFilters } from '@/query/linear'
import { QueryIssue, QueryPullRequest, QueryUser } from '@/query/types'
import { connectStore } from '@/stores/connectStore'
import { dataStore } from '@/stores/dataStore'
import { logger, unwrapError } from '@/utils'
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline'
import { useStore } from '@nanostores/preact'
import { formatDistance } from 'date-fns'
import { useEffect, useState } from 'preact/hooks'

export type TeamCurrentModuleProps = {
  title: string
  openPulls: string
  mergedPulls: string
  openIssues: IssueFilters
}

class UserInfo {
  constructor(public user: QueryUser) {}

  openPulls: QueryPullRequest[] = []
  mergedPulls: QueryPullRequest[] = []
  openIssues: QueryIssue[] = []
}

type UserInfoMap = { [key: string]: UserInfo }

const NONE_USER = 'none'

const TeamCurrentModule = (props: TeamCurrentModuleProps) => {
  const [error, setError] = useState<Error>()
  const [userInfos, setUserInfos] = useState<UserInfoMap>({})

  const { data: openPulls } = usePullRequests(props.openPulls, setError)
  const { data: mergedPulls } = usePullRequests(props.mergedPulls, setError)
  const { issues: openIssues } = useIssues(props.openIssues, setError)

  useEffect(() => {
    openPulls.forEach((pr) => {
      const id = pr.user.id
      if (!userInfos[id]) userInfos[id] = new UserInfo(pr.user)
      userInfos[id].openPulls.push(pr)
    })
    mergedPulls.forEach((pr) => {
      const id = pr.user.id
      if (!userInfos[id]) userInfos[id] = new UserInfo(pr.user)
      userInfos[id].mergedPulls.push(pr)
    })
    Promise.all(
      openIssues.map(async (issue) => {
        const assignee = await issue.user?.()
        const id = assignee?.id || NONE_USER
        if (!userInfos[id])
          userInfos[id] = new UserInfo(assignee || { id: NONE_USER, name: 'No User' })
        userInfos[id].openIssues.push(issue)
      })
    ).then(() => {
      setUserInfos(userInfos)
    })
  }, [openPulls, mergedPulls, openIssues])

  console.log('meowy', userInfos, openIssues)

  const keys = Object.keys(userInfos).sort((a, b) => {
    const aInfo = userInfos[a]
    const bInfo = userInfos[b]
    const aCount = aInfo.openPulls.length + aInfo.mergedPulls.length + aInfo.openIssues.length
    const bCount = bInfo.openPulls.length + bInfo.mergedPulls.length + bInfo.openIssues.length
    return bCount - aCount
  })

  return (
    <DataModule title={props.title} className="lg:col-span-2" error={error}>
      {keys.map((id) => {
        const info = userInfos[id]

        return (
          <div className="flex flex-col" key={id}>
            {info.user.name}
          </div>
        )
      })}
    </DataModule>
  )
}

export default TeamCurrentModule
