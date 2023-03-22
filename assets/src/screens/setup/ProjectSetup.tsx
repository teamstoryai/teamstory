import { useEffect, useState } from 'preact/hooks'

import Helmet from '@/components/core/Helmet'
import AppHeader from '@/components/layout/AppHeader'

import { projectStore } from '@/stores/projectStore'
import { useStore } from '@nanostores/preact'

import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from '@/screens/setup/Step3'
import { connectStore } from '@/stores/connectStore'
import { tokenStore } from '@/stores/tokenStore'
import AppBody from '@/components/layout/AppBody'

type Props = {
  path: string
}

const ProjectSetup = (props: Props) => {
  const project = useStore(projectStore.currentProject)
  const [step, setStep] = useState(1)

  const tokens = useStore(tokenStore.tokens)
  const repos = useStore(connectStore.repos)

  useEffect(() => {
    const doneStep2 = tokens.find((t) => t.name == 'linear' || t.name == 'jira')
    if (step < 3 && doneStep2) setStep(3)
    else if (step < 2 && repos.length > 0) setStep(2)
  }, [step, tokens, repos])

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
      <AppBody>
        <Step1 />

        {step >= 2 && <Step2 />}

        {step >= 3 && <Step3 />}
      </AppBody>
    </>
  )
}

export default ProjectSetup
