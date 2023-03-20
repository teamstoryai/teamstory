import { useEffect, useState } from 'preact/hooks'

import Helmet from '@/components/core/Helmet'
import AppHeader from '@/components/layout/AppHeader'

import { projectStore } from '@/stores/projectStore'
import { useStore } from '@nanostores/preact'
import { route } from 'preact-router'
import { config, paths } from '@/config'

import githubLogo from '@/images/github.png'
import gitlabLogo from '@/images/gitlab.png'
import linearLogo from '@/images/linear.png'
import jiraLogo from '@/images/jira.png'
import { RenderableProps } from 'preact'
import Tooltip from '@/components/core/Tooltip'
import { logger } from '@/utils'
import ErrorMessage from '@/components/core/ErrorMessage'
import { API } from '@/api'

type Props = {
  path: string
}

const GH_SCOPES = 'user:email,repo,read:org'
const GH_CLIENT_ID = config.dev ? '3008defde742bbe1efe0' : ''
const GH_URL = `https://github.com/login/oauth/authorize?scope=${GH_SCOPES}&client_id=${GH_CLIENT_ID}`

const Setup = (props: Props) => {
  const project = useStore(projectStore.currentProject)
  const [step, setStep] = useState(1)

  useEffect(() => {
    if (!project) route(paths.PROJECTS)

    API.getOAuthTokens('github').then((response) => {
      if (response.tokens.length > 0) setStep(2)
    })
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
        <Step1 setStep={setStep} />

        {step >= 2 && <Step2 />}
      </div>
    </>
  )
}

const Step1 = ({ setStep }: { setStep: (step: number) => void }) => {
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const messageListener = (message: MessageEvent) => {
      const data = message.data
      if (!data || data.type != 'oauth') return
      logger.info(data)

      if (data.event == 'closed') return

      if (data.error) setError(data.error)
      else if (data.result) {
        // result should include access_token, scope, and name
        const { service, code } = data.result
        API.connectOAuthToken('', code, service)
        setStep(2)
      }
    }

    window.addEventListener('message', messageListener)
    return () => window.removeEventListener('message', messageListener)
  }, [])

  return (
    <div class="mb-12">
      <h1 class="text-lg my-2">1. Connect a repository</h1>
      <p class="text-gray-500">Where does your team collaborate on code?</p>

      <div class="flex flex-row items-center justify-center mt-8 gap-8">
        <ConnectButton
          icon={githubLogo}
          text="Connect GitHub"
          onClick={() => window.open(GH_URL)}
        />
        <Tooltip message="Coming soon">
          <ConnectButton disabled icon={gitlabLogo} text="Connect GitLab" />
        </Tooltip>
      </div>

      <ErrorMessage error={error} />
    </div>
  )
}

const Step2 = () => (
  <div class="mb-12">
    <h1 class="text-lg my-2">2. Connect project management</h1>
    <p class="text-gray-500">Where does your team track stories and bugs?</p>

    <div class="flex flex-row items-center justify-center mt-8 gap-8">
      <ConnectButton icon={linearLogo} text="Connect Linear" />
      <Tooltip message="Coming soon">
        <ConnectButton disabled icon={jiraLogo} text="Connect Jira" />
      </Tooltip>
    </div>

    <div class="text-sm my-2 opacity-70 text-center">
      Do you use a different issue tracker?{' '}
      <a target="_blank" href="mailto:support@teamstory.ai" class="underline cursor-pointer">
        Let us know.
      </a>
    </div>
  </div>
)

type ConnectProps = {
  onClick?: () => void
  disabled?: boolean
  icon: string
  text: string
}

const ConnectButton = (props: RenderableProps<ConnectProps>) => (
  <button
    onClick={props.onClick}
    disabled={props.disabled}
    class="flex items-center bg-gray-200 hover:bg-gray-300 border border-gray-300 shadow-sm rounded-md px-4 py-2"
  >
    <img src={props.icon} class="h-6 w-6" />
    <span class="ml-2">{props.text}</span>
  </button>
)

export default Setup
