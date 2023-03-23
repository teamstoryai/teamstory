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

type Props = {
  title: string
  modules: DataModuleProps[]
}

const PastDashboard = (props: Props) => {
  const initialized = useStore(dataStore.initialized)

  if (!initialized)
    return (
      <AppBody class="items-center">
        <Loader size={50} />
      </AppBody>
    )

  return (
    <>
      <Helmet title={props.title} />

      <AppHeader>
        <div class="flex flex-1 gap-2 items-center relative overflow-hidden">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis">
            {props.title}
          </h1>
        </div>
      </AppHeader>
      <AppBody>
        <div class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 -mx-4 my-4">
          <ModuleGroup modules={props.modules} />
        </div>
      </AppBody>
    </>
  )
}

export default PastDashboard
