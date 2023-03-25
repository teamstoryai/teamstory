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
import Button from '@/components/core/Button'

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
        <PageTitle title={props.title}></PageTitle>
      </AppHeader>
      <AppBody>
        <div class="grid grid-cols-1 lg:grid-cols-2 -ml-4">
          <ModuleGroup modules={props.modules} />
        </div>
      </AppBody>
    </>
  )
}

export default PastDashboard
