import { useEffect } from 'preact/hooks'

import Helmet from '@/components/core/Helmet'
import DailyPrompt from '@/components/dashboard/DailyPrompt'
import AppHeader from '@/components/layout/AppHeader'

import { projectStore } from '@/stores/projectStore'
import { useStore } from '@nanostores/preact'

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

  const today = new Date()

  return (
    <>
      <Helmet title={'Reports'} />

      <AppHeader>
        <div class="flex flex-1 gap-2 items-center relative overflow-hidden">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis">
            Reports
          </h1>
        </div>
      </AppHeader>
      <div class="flex flex-col grow w-full px-6 mt-4 max-w-2xl mx-auto">
        <DailyPrompt date={today} />
      </div>
    </>
  )
}
