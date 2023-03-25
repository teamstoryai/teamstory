import { useEffect } from 'preact/hooks'

import Helmet from '@/components/core/Helmet'
import DailyPrompt from '@/components/dashboard/DailyPrompt'
import AppHeader from '@/components/layout/AppHeader'

import { projectStore } from '@/stores/projectStore'
import { useStore } from '@nanostores/preact'
import { Project } from '@/models'
import { route } from 'preact-router'
import { paths } from '@/config'
import { format, sub } from 'date-fns'
import { dataStore } from '@/stores/dataStore'
import AppBody from '@/components/layout/AppBody'
import Loader from '@/components/core/Loader'
import { DataModuleProps } from '@/modules/DataModule'
import ModuleGroup from '@/modules/ModuleGroup'
import PageTitle from '@/components/layout/PageTitle'

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
  const recentKey = format(sub(new Date(), { days: 5 }), 'yyyy-MM-dd')

  const modules: DataModuleProps[] = [
    {
      module: 'pull_requests',
      title: 'Open Pull Requests',
      query: 'is:open is:pr draft:false',
    },
    {
      module: 'pull_requests',
      title: 'Recently Merged Pull Requests',
      query: `is:merged is:pr merged:>${recentKey}`,
    },
    {
      module: 'issues',
      title: 'Issues In Progress',
      filters: { started: true },
    },
    {
      module: 'issues',
      title: 'Recently Completed',
      filters: { completedAfter: recentKey },
    },
    {
      module: 'issues',
      title: 'New Bugs',
      filters: { open: true, label: 'bug', createdAfter: recentKey },
    },
  ]

  return (
    <>
      <Helmet title={'Dashboard'} />

      <AppHeader>
        <PageTitle title="Dashboard" />
      </AppHeader>
      <AppBody>
        <DailyPrompt date={today} />

        <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 -ml-4 my-4">
          <ModuleGroup modules={modules} />
        </div>
      </AppBody>
    </>
  )
}

export default Dashboard
