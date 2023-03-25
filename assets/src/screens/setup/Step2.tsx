import linearLogo from '@/images/linear.png'
import jiraLogo from '@/images/jira.png'
import { ConnectButton } from './ConnectButton'
import useOAuthPopup from '@/hooks/useOAuthPopup'
import { useEffect, useRef, useState } from 'preact/hooks'
import { projectStore } from '@/stores/projectStore'
import { tokenStore } from '@/stores/tokenStore'
import { logger, toTitleCase } from '@/utils'
import ErrorMessage from '@/components/core/ErrorMessage'
import { OAuthToken } from '@/models'
import { CheckIcon } from '@heroicons/react/24/outline'
import { API } from '@/api'
import { LinearClient } from '@linear/sdk'
import Pressable from '@/components/core/Pressable'
import linear from '@/query/linear'

const LIN_SCOPES = 'read'
const LIN_URI = location.origin + '/oauth/linear'
const LINEAR_URL =
  'https://linear.app/oauth/authorize?response_type=code&actor=application' +
  `&scope=${LIN_SCOPES}&redirect_uri=${encodeURIComponent(LIN_URI)}&client_id=`

type Project = {
  id: string
  name: string
  key: string
}

export const Step2 = () => {
  const [error, setError] = useState<string>()
  const [currentToken, setCurrentToken] = useState<OAuthToken>()
  const linClientIdRef = useRef<string>()

  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    if (!currentToken) return

    if (currentToken.name == 'linear') {
      const client = new LinearClient({ accessToken: currentToken.access })
      client.teams().then((teams) => {
        logger.info('teams', teams)
        if (teams.nodes.length <= 1) return
        setProjects(
          teams.nodes.map((t) => ({
            id: t.id,
            name: t.name,
            key: t.key,
          }))
        )
      })
    }
  }, [currentToken])

  useEffect(() => {
    const project = projectStore.currentProject.get()
    if (!project) return

    async function init() {
      API.clientId('linear').then((id) => (linClientIdRef.current = id.client_id))

      // check if we have connections
      const tokens = tokenStore.tokens.get()
      const found = tokens.find((t) => t.name == 'linear' || t.name == 'jira')
      if (found) {
        setCurrentToken(found)
      }
    }
    init()
  }, [])

  useOAuthPopup(
    (data) => {
      const { service, code } = data
      tokenStore
        .connectToken(LIN_URI, code, service)
        .then((token) => {
          setCurrentToken(token)
          linear.setToken(token.access)
        })
        .catch((err) => {
          logger.error(err)
          setError(err)
        })
    },
    setError,
    !currentToken
  )

  return (
    <div class="mb-12">
      <h1 class="text-lg my-2">2. Connect project management</h1>
      <p class="text-gray-500">Where does your team track stories and bugs?</p>

      {currentToken && (
        <div class="my-2 flex items-center text-green-700">
          <img src={currentToken.name == 'linear' ? linearLogo : jiraLogo} class="h-6 w-6 mr-2" />
          {toTitleCase(currentToken.name)}
          <CheckIcon class="h-4 w-4 text-green-600 ml-2" />
        </div>
      )}

      {projects && projects.length > 0 && (
        <>
          <div>Select one or more {currentToken?.name == 'linear' ? 'teams' : 'projects'}:</div>
          <div class="flex flex-col gap-2 mt-2">
            {projects.map((p) => (
              <Pressable onClick={() => {}} key={p.id} className="flex-row">
                {p.name}
                <span class="text-gray-500 ml-2">({p.key})</span>
              </Pressable>
            ))}
          </div>
        </>
      )}

      {!currentToken && (
        <>
          <div class="flex flex-row items-center justify-center mt-8 gap-8">
            <ConnectButton
              icon={linearLogo}
              text="Connect Linear"
              onClick={() => window.open(LINEAR_URL + linClientIdRef.current)}
            />
            <ConnectButton comingSoon icon={jiraLogo} text="Connect Jira" />
          </div>

          <div class="text-sm my-2 opacity-70 text-center">
            Do you use a different issue tracker?{' '}
            <a target="_blank" href="mailto:support@teamstory.ai" class="underline cursor-pointer">
              Let us know.
            </a>
          </div>
        </>
      )}

      <ErrorMessage error={error} />
    </div>
  )
}
