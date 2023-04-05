import { useEffect, useState } from 'preact/hooks'

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
import { DataModuleProps } from '@/modules/DataModuleFactory'
import ModuleGroup from '@/modules/ModuleGroup'
import PageTitle from '@/components/layout/PageTitle'
import Suggestions, { Suggestion, suggestionFromParams } from '@/screens/dashboards/Suggestions'
import {
  ComingSoonModules,
  DashboardModules,
  NeedsAttentionModules,
} from '@/screens/dashboards/dashboards'
import { uiStore } from '@/stores/uiStore'

type Props = {
  path: string
}

const suggestions: Suggestion[] = [
  { id: 'attention', label: 'What needs my attention?' },
  { id: 'risks', label: 'Upcoming risks' },
]

const Dashboard = (props: Props) => {
  const params = new URLSearchParams(location.search)
  const project = useStore(projectStore.currentProject)
  const initialized = useStore(uiStore.initialized)
  const [suggestion, setSuggestion] = useState<Suggestion | undefined>(
    suggestionFromParams(params, suggestions)
  )

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
  const recentKey = format(sub(today, { days: 5 }), 'yyyy-MM-dd')
  const lastMonth = format(sub(today, { days: 14 }), 'yyyy-MM-dd')

  const suggestionId = suggestion?.id
  const modules: DataModuleProps[] =
    suggestionId == 'attention'
      ? NeedsAttentionModules(recentKey)
      : suggestionId == 'risks'
      ? ComingSoonModules()
      : DashboardModules(recentKey, lastMonth)

  return (
    <>
      <AppHeader>
        <PageTitle title="Dashboard" />
      </AppHeader>
      <AppBody>
        <DailyPrompt date={today} />

        <Suggestions {...{ suggestions, suggestion, setSuggestion }} />

        <div class="grid grid-cols-1 lg:grid-cols-2 -ml-4 my-4">
          <ModuleGroup modules={modules} />
        </div>
      </AppBody>
    </>
  )
}

export default Dashboard
