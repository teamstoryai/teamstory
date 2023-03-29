import { StateUpdater, useEffect, useRef, useState } from 'preact/hooks'
import { useStore } from '@nanostores/preact'
import githubLogo from '@/images/github.png'
import gitlabLogo from '@/images/gitlab.png'
import { logger } from '@/utils'
import ErrorMessage from '@/components/core/ErrorMessage'
import { tokenStore } from '@/stores/tokenStore'
import Loader from '@/components/core/Loader'
import Pressable from '@/components/core/Pressable'
import { connectStore, OrgData, RepoData } from '@/stores/connectStore'
import { OAuthToken, Repository } from '@/models'
import useOAuthPopup from '@/hooks/useOAuthPopup'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import ForkIcon from '@/components/icons/ForkIcon'
import { ConnectButton } from './ConnectButton'
import { projectStore } from '@/stores/projectStore'
import { config } from '@/config'
import { API } from '@/api'
import { uiStore } from '@/stores/uiStore'
import github from '@/query/github'

const GH_SCOPES = 'user:email,repo,read:org'
export const GH_URL = `https://github.com/login/oauth/authorize?scope=${GH_SCOPES}&client_id=`

enum ConnectState {
  NotConnected,
  Loading,
  Connected,
  RepoSelected,
}
export const Step1 = () => {
  const [state, setState] = useState<ConnectState>(ConnectState.NotConnected)
  const [error, setError] = useState<string>()
  const [currentToken, setCurrentToken] = useState<OAuthToken>()
  const ghClientIdRef = useRef<string>()
  const repos = useStore(connectStore.repos)
  const initialized = useStore(uiStore.initialized)

  useEffect(() => {
    API.clientId('github').then((id) => (ghClientIdRef.current = id.client_id))
  }, [])

  useEffect(() => {
    if (!initialized) return
    const tokens = tokenStore.tokens.get()
    const found = tokens.find((t) => t.name == 'github' || t.name == 'gitlab')
    if (!found) return

    if (found.name == 'github') github.setToken(found.access)
    setCurrentToken(found)
    if (!repos.length) {
      setState(ConnectState.Connected)
    } else {
      setState(ConnectState.RepoSelected)
    }
  }, [initialized])

  const addRepo = (org: OrgData, repo: RepoData) => {
    setError(undefined)
    connectStore
      .addRepo(currentToken!.name, org, repo)
      .then(() => {
        setCurrentToken(undefined)
        setState(ConnectState.RepoSelected)
      })
      .catch(setError)
  }

  useOAuthPopup(
    (data) => {
      const { service, code } = data
      if (service != 'github' && service != 'gitlab') return
      setState(ConnectState.Loading)
      tokenStore
        .connectToken('', code, service)
        .then((token) => {
          setState(ConnectState.Connected)
          setCurrentToken(token)
        })
        .catch((err) => {
          logger.error(err)
          setState(ConnectState.NotConnected)
          setError(err)
        })
    },
    setError,
    state == ConnectState.NotConnected
  )

  const connectAnother = () => {
    setState(ConnectState.Connected)
  }

  return (
    <div class="mb-12">
      <h1 class="text-lg my-2">1. Connect a repository</h1>

      <p class="text-gray-500">Where does your team collaborate on code?</p>

      {state == ConnectState.Loading && (
        <div class="flex flex-row items-center justify-center mt-8 gap-8">
          <button
            disabled
            class="flex items-center bg-gray-200 hover:bg-gray-300 border border-gray-300 shadow-sm rounded-md px-4 py-2"
          >
            <Loader class="mr-2" />
            Loading...
          </button>
        </div>
      )}

      {repos.length > 0 && (
        <div>
          {repos.map((repo) => (
            <div class="flex flex-row my-2" key={repo.id}>
              <img src={repo.avatar_url} class="w-6 h-6 rounded-full mr-2" />
              {repo.name}
            </div>
          ))}
          {
            <Pressable
              onClick={() => connectAnother()}
              className="text-gray-500 hover:text-gray-900 block"
            >
              Connect another repository
            </Pressable>
          }
        </div>
      )}

      {state == ConnectState.Connected && currentToken && (
        <SelectRepository
          token={currentToken}
          addRepo={addRepo}
          setError={setError}
          existing={repos[0]}
        />
      )}

      {state == ConnectState.NotConnected && (
        <div class="flex flex-row items-center justify-center mt-8 gap-8">
          <ConnectButton
            icon={githubLogo}
            text="Connect GitHub"
            onClick={() => window.open(GH_URL + ghClientIdRef.current)}
          />
          <ConnectButton comingSoon icon={gitlabLogo} text="Connect GitLab" />
        </div>
      )}

      <ErrorMessage error={error} />
    </div>
  )
}

function SelectRepository({
  token,
  addRepo,
  setError,
  existing,
}: {
  token: OAuthToken
  addRepo: (org: OrgData, repo: RepoData) => void
  setError: (err: string | undefined) => void
  existing?: Repository
}) {
  const [orgs, setOrgs] = useState<OrgData[]>()
  const [currentOrg, setCurrentOrg] = useState<OrgData>()

  const [repos, setRepos] = useState<RepoData[]>()
  const [currentRepo, setCurrentRepo] = useState<RepoData>()

  useEffect(() => {
    fetchOrgs()
  }, [token])

  const fetchOrgs = () => {
    setError(undefined)

    github
      .orgs()
      .then((orgs: OrgData[]) => {
        logger.info(orgs)
        setOrgs(orgs)

        if (existing) {
          const [owner, repo] = existing.name.split('/')
          const org = orgs.find((o) => o.login == owner)
          if (org) {
            setCurrentOrg(org)
            fetchRepos(token, org)
          }
        }
      })
      .catch(setError)
  }

  const fetchRepos = (token: OAuthToken, org: OrgData) => {
    setCurrentOrg(org)
    setError(undefined)
    github
      .repos(org.login)
      .then((repos: RepoData[]) => {
        logger.info(repos)
        setRepos(repos)
      })
      .catch(setError)
  }

  if (!token || !orgs) return null

  return (
    <div class="bg-blue-100 p-2 mt-4 -mx-2 rounded-md">
      <>
        {currentOrg ? (
          <>
            <div class="flex flex-col gap-2 mt-2">
              <Pressable
                onClick={() => {
                  setCurrentOrg(undefined)
                  setRepos(undefined)
                }}
                className="flex-row"
                tooltip="Select another organization"
              >
                <img src={currentOrg.avatar_url} class="w-6 h-6 rounded-full mr-2" />
                {currentOrg.login}
              </Pressable>
            </div>
          </>
        ) : (
          <>
            <div>Select an organization:</div>
            <div class="flex flex-col gap-2 mt-2">
              {orgs.map((org) => (
                <Pressable onClick={() => fetchRepos(token, org)} key={org.id} className="flex-row">
                  <img src={org.avatar_url} class="w-6 h-6 rounded-full mr-2" />
                  {org.login}
                </Pressable>
              ))}
            </div>
            <div class="mt-2 p-2 bg-blue-100 border border-blue-200 rounded-md text-sm text-gray-600">
              If you don't see your organization here, you'll have to re-authorize the Github app:
              <ol class="list-decimal ml-5">
                <li>
                  On{' '}
                  <a href="https://github.com" target="_blank" class="cursor-pointer underline">
                    github.com
                  </a>
                  , navigate to the User Menu (top right) &gt; Settings &gt; Applications.
                </li>
                <li>Go to the "Authorized OAuth Apps" tab and click on Teamstory</li>
                <li>Find your organization(s) and click on Grant.</li>
                <li>Refresh this page.</li>
              </ol>
            </div>
          </>
        )}
      </>

      {repos && (
        <div class="mt-4">
          {currentRepo ? (
            <>
              <div>Repository:</div>
              <div class="mt-2">
                <Pressable
                  onClick={() => setCurrentRepo(undefined)}
                  className="flex-row"
                  tooltip="Select another repository"
                >
                  <img src={currentOrg!.avatar_url} class="w-6 h-6 rounded-full mr-2" />

                  {currentRepo.full_name}
                </Pressable>
              </div>
            </>
          ) : (
            <>
              <div>Select a repository:</div>
              <div class="mt-2">
                {repos.map((repo) => (
                  <Pressable
                    onClick={() => addRepo(currentOrg!, repo)}
                    key={repo.id}
                    className="flex-row text-sm text-gray-800"
                  >
                    {repo.full_name}
                    {repo.private && <LockClosedIcon class="ml-1 w-3 h-3" />}
                    {repo.fork && <ForkIcon class="ml-1 w-4 h-4" />}
                  </Pressable>
                ))}
                {!repos.length && (
                  <div class="text-gray-500">
                    No repositories found. Please select another organization.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
