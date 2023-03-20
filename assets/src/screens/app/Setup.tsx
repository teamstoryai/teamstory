import { useEffect } from 'preact/hooks'

import Helmet from '@/components/core/Helmet'
import AppHeader from '@/components/layout/AppHeader'

import { projectStore } from '@/stores/projectStore'
import { useStore } from '@nanostores/preact'
import { route } from 'preact-router'
import { paths } from '@/config'

import githubLogo from '@/images/github.png'
import gitlabLogo from '@/images/gitlab.png'
import linearLogo from '@/images/linear.png'
import jiraLogo from '@/images/jira.png'
import { RenderableProps } from 'preact'

type Props = {
  path: string
}

const Setup = (props: Props) => {
  const project = useStore(projectStore.currentProject)

  useEffect(() => {
    if (!project) route(paths.PROJECTS)
  }, [project])

  if (!project) return null

  return (
    <>
      <Helmet title={'Dashboard'} />

      <AppHeader>
        <div class="flex flex-1 gap-2 items-center relative overflow-hidden">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 whitespace-nowrap overflow-hidden overflow-ellipsis">
            {project.name} Setup
          </h1>
        </div>
      </AppHeader>
      <div class="flex flex-col grow w-full px-6 mt-4 mx-2">
        <Step1 />

        <Step2 />
      </div>
    </>
  )
}

const Step1 = () => (
  <div class="mb-12">
    <h1 class="text-lg my-2">1. Connect a repository</h1>
    <p class="text-gray-500">Where does your team collaborate on code?</p>

    <div class="flex flex-row items-center justify-center mt-8 gap-8">
      <ConnectButton>
        <img src={githubLogo} class="h-6 w-6" />
        <span class="ml-2">Connect GitHub</span>
      </ConnectButton>
      <ConnectButton>
        <img src={gitlabLogo} class="h-6 w-6" />
        <span class="ml-2">Connect GitLab</span>
      </ConnectButton>
    </div>
  </div>
)

const Step2 = () => (
  <div class="mb-12">
    <h1 class="text-lg my-2">2. Connect project management</h1>
    <p class="text-gray-500">Where does your team track stories and bugs?</p>

    <div class="flex flex-row items-center justify-center mt-8 gap-8">
      <ConnectButton>
        <img src={linearLogo} class="h-6 w-6" />
        <span class="ml-2">Connect Linear</span>
      </ConnectButton>
      <ConnectButton>
        <img src={jiraLogo} class="h-6 w-6" />
        <span class="ml-2">Connect Jira</span>
      </ConnectButton>
    </div>

    <div class="text-sm my-2 opacity-70 text-center">
      Do you use a different issue tracker? Let us know.
    </div>
  </div>
)

const ConnectButton = (props: RenderableProps<{}>) => (
  <button class="flex items-center bg-gray-200 hover:bg-gray-400 rounded-md px-4 py-2">
    {props.children}
  </button>
)

export default Setup
