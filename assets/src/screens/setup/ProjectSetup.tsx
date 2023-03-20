import { useState } from 'preact/hooks'

import Helmet from '@/components/core/Helmet'
import AppHeader from '@/components/layout/AppHeader'

import { projectStore } from '@/stores/projectStore'
import { useStore } from '@nanostores/preact'

import { Step1 } from './Step1'
import { Step2 } from './Step2'

type Props = {
  path: string
}

const ProjectSetup = (props: Props) => {
  const project = useStore(projectStore.currentProject)
  const [step, setStep] = useState(1)

  if (!project) return <div>Please select a project</div>

  return (
    <>
      <Helmet title={project.name + ' Setup'} />

      <AppHeader>
        <div class="flex flex-1 gap-2 items-center relative overflow-hidden">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis">
            {project.name} Setup
          </h1>
        </div>
      </AppHeader>
      <div class="flex flex-col grow w-full px-6 mt-4 mx-2">
        <Step1 setStep={setStep} />

        {step >= 2 && <Step2 />}
      </div>
    </>
  )
}

export default ProjectSetup
