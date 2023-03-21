import { useEffect } from 'preact/hooks'

import Helmet from '@/components/core/Helmet'
import DailyPrompt from '@/components/dashboard/DailyPrompt'
import AppHeader from '@/components/layout/AppHeader'

import { projectStore } from '@/stores/projectStore'
import { useStore } from '@nanostores/preact'
import { Project } from '@/models'
import { route } from 'preact-router'
import { paths } from '@/config'

type Props = {
  path: string
}

export default (props: Props) => {
  const params = new URLSearchParams(location.search)
  const project = useStore(projectStore.currentProject)

  const projectParam = params.get('p')
  useEffect(() => {
    if (projectParam && projectParam != project?.id) projectStore.setCurrentProject(projectParam)
  }, [projectParam, project])

  useEffect(() => {
    if (!project) return
    if (!Project.meta(project).ob) route(paths.SETUP)
  }, [project])

  const today = new Date()

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
      <div class="flex flex-col grow w-full px-6 mt-4 mx-2">
        <DailyPrompt date={today} />
      </div>
    </>
  )
}
