import { useEffect } from 'preact/hooks'

import Helmet from '@/components/core/Helmet'
import DailyPrompt from '@/components/dashboard/DailyPrompt'
import AppHeader from '@/components/layout/AppHeader'

import { projectStore } from '@/stores/projectStore'
import { useStore } from '@nanostores/preact'
import { Project } from '@/models'
import { route } from 'preact-router'
import { paths } from '@/config'
import PullRequestsModule from '@/modules/PullRequestsModule'
import { sub } from 'date-fns'
import { tokenStore } from '@/stores/tokenStore'
import { dataStore } from '@/stores/dataStore'
import AppBody from '@/components/layout/AppBody'
import Loader from '@/components/core/Loader'
import IssuesModule from '@/modules/IssuesModule'

type Props = {
  path: string
}

const Dashboard = (props: Props) => {
  const params = new URLSearchParams(location.search)
  const project = useStore(projectStore.currentProject)
  const initialized = useStore(dataStore.initialized)

  const projectParam = params.get('p')
  useEffect(() => {
    if (projectParam && projectParam != project?.id) projectStore.setCurrentProject(projectParam)
  }, [projectParam, project])

  useEffect(() => {
    if (!project) return
    if (!Project.meta(project).ob) route(paths.SETUP)
  }, [project])

  if (!Project.meta(project).ob) return null
  if (!initialized)
    return (
      <AppBody class="items-center">
        <Loader size={50} />
      </AppBody>
    )

  const today = new Date()

  const prModule1 = {
    title: 'Open Pull Requests',
    query: 'is:open is:pr draft:false',
  }

  const prModule2 = {
    title: 'Recently Merged Pull Requests',
    query: `is:merged is:pr merged:>${sub(new Date(), { days: 2 }).toISOString()}`,
  }

  const issuesModule1 = {
    title: 'Issues In Progress',
    open: true,
  }

  const issuesModule2 = {
    title: 'Recently Completed',
    completedAfter: sub(new Date(), { days: 2 }),
  }

  return (
    <>
      <Helmet title={'Dashboard'} />

      <AppHeader>
        <div class="flex flex-1 gap-2 items-center relative overflow-hidden">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis">
            Dashboard
          </h1>
        </div>
      </AppHeader>
      <AppBody>
        <DailyPrompt date={today} />

        <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 -mx-4 my-4">
          <PullRequestsModule {...prModule1} />
          <PullRequestsModule {...prModule2} />

          <IssuesModule {...issuesModule1} />
          <IssuesModule {...issuesModule2} />
        </div>
      </AppBody>
    </>
  )
}

export default Dashboard
