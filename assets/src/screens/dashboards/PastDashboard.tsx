import Helmet from '@/components/core/Helmet'
import AppHeader from '@/components/layout/AppHeader'

import { useStore } from '@nanostores/preact'
import { dataStore } from '@/stores/dataStore'
import AppBody from '@/components/layout/AppBody'
import Loader from '@/components/core/Loader'
import { DataModuleProps } from '@/modules/DataModuleFactory'
import ModuleGroup from '@/modules/ModuleGroup'
import PageTitle from '@/components/layout/PageTitle'
import { projectStore } from '@/stores/projectStore'
import { RenderableProps } from 'preact'
import { uiStore } from '@/stores/uiStore'
import Pressable from '@/components/core/Pressable'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'

type Props = {
  title: string
  modules: DataModuleProps[]
  prevPeriod?: () => void
  nextPeriod?: () => void
}

const PastDashboard = (props: RenderableProps<Props>) => {
  const initialized = useStore(uiStore.initialized)
  useStore(projectStore.currentProject)

  if (!initialized)
    return (
      <AppBody class="items-center">
        <Loader size={50} />
      </AppBody>
    )

  return (
    <>
      <AppHeader>
        <PageTitle title={props.title}>
          <Pressable
            tooltip="Previous period"
            onClick={props.prevPeriod}
            className={props.prevPeriod ? '' : 'text-gray-400'}
          >
            <ChevronLeftIcon class="h-6 w-6" />
          </Pressable>
          <Pressable
            tooltip="Next period"
            onClick={props.nextPeriod}
            className={props.nextPeriod ? '' : 'text-gray-400'}
          >
            <ChevronRightIcon class="h-6 w-6" />
          </Pressable>
        </PageTitle>
      </AppHeader>
      <AppBody>
        {props.children}
        <div class="grid grid-cols-1 lg:grid-cols-2 -ml-4">
          <ModuleGroup modules={props.modules} />
        </div>
      </AppBody>
    </>
  )
}

export default PastDashboard
