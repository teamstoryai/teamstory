import { StateUpdater, useEffect, useState } from 'preact/hooks'
import { useStore } from '@nanostores/preact'
import { config } from '@/config'
import githubLogo from '@/images/github.png'
import gitlabLogo from '@/images/gitlab.png'
import Tooltip from '@/components/core/Tooltip'
import { logger } from '@/utils'
import ErrorMessage from '@/components/core/ErrorMessage'
import { API } from '@/api'
import { tokenStore } from '@/stores/tokenStore'
import Loader from '@/components/core/Loader'
import Pressable from '@/components/core/Pressable'
import { connectStore, OrgData, RepoData } from '@/stores/connectStore'
import { OAuthToken } from '@/models'
import useOAuthPopup from '@/hooks/useOAuthPopup'
import { LockClosedIcon } from '@heroicons/react/24/outline'
import ForkIcon from '@/components/icons/ForkIcon'
import { ConnectButton, GH_URL } from './ProjectSetup'
import { projectStore } from '@/stores/projectStore'

enum ConnectState {
  NotConnected,
  Loading,
  Connected,
  RepoSelected,
  ConnectAnother,
}
export const Step1 = ({ setStep }: { setStep: StateUpdater<number> }) => {
  const [state, setState] = useState<ConnectState>(ConnectState.NotConnected)
  const [error, setError] = useState<string>()
  const [currentToken, setCurrentToken] = useState<OAuthToken>()

  const repos = useStore(connectStore.repos)

  useEffect(() => {
    const project = projectStore.currentProject.get()
    if (!project) return

    async function init() {
      // check if we have connections
      const tokenPromise = tokenStore.fetchTokens()
      const repos = await connectStore.loadConnectedRepos()
      if (repos.length > 0) {
        setState(ConnectState.RepoSelected)
        setStep(2)
        return
      }

      // check if we have tokens
      const tokens = await tokenPromise
      const found = tokens.find((t) => t.name == 'github' || t.name == 'gitlab')
      if (found) {
        setCurrentToken(found)
        setState(ConnectState.Connected)
      }
    }
    init()
  }, [])

  const addRepo = (org: OrgData, repo: RepoData) => {
    setError(undefined)
    connectStore
      .addRepo(currentToken!.name, org, repo)
      .then(() => {
        setCurrentToken(undefined)
        setState(ConnectState.RepoSelected)
        setStep((step) => Math.max(step, 2))
      })
      .catch(setError)
  }

  useOAuthPopup((data) => {
    const { service, code } = data
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
        setError(err.message)
      })
  }, setError)

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
          <Pressable
            onClick={() => setState(ConnectState.ConnectAnother)}
            className="text-gray-400"
          >
            Connect another repository?
          </Pressable>
        </div>
      )}

      {currentToken && (
        <SelectRepository token={currentToken} addRepo={addRepo} setError={setError} />
      )}

      {(state == ConnectState.NotConnected || state == ConnectState.ConnectAnother) && (
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
      )}

      <ErrorMessage error={error} />
    </div>
  )
}

function SelectRepository({
  token,
  addRepo,
  setError,
}: {
  token: OAuthToken
  addRepo: (org: OrgData, repo: RepoData) => void
  setError: (err: string | undefined) => void
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
    connectStore
      .fetchOrgs(token.name)
      .then((orgs) => {
        logger.info(orgs)
        setOrgs(orgs)
      })
      .catch(setError)
  }

  const fetchRepos = (token: OAuthToken, org: any) => {
    setCurrentOrg(org)
    setError(undefined)
    connectStore
      .fetchRepos(token.name, org)
      .then((repos) => {
        logger.info(repos)
        setRepos(repos)
      })
      .catch(setError)
  }

  if (!token || !orgs) return null

  return (
    <>
      <div class="mt-4">
        {currentOrg ? (
          <>
            <div>Organization:</div>
            <div class="flex flex-col gap-2 mt-2">
              <Pressable
                onClick={() => {
                  setCurrentOrg(undefined)
                  setRepos(undefined)
                }}
                className="flex-row"
                tooltip={{ message: 'Select another organization', placement: 'left' }}
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
          </>
        )}
      </div>

      {repos && (
        <div class="mt-4">
          {currentRepo ? (
            <>
              <div>Repository:</div>
              <div class="mt-2">
                <Pressable
                  onClick={() => setCurrentRepo(undefined)}
                  className="flex-row"
                  tooltip={{ message: 'Select another repository', placement: 'left' }}
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
                    onClick={() => addRepo(currentOrg, repo)}
                    key={repo.id}
                    className="flex-row"
                  >
                    {repo.full_name}
                    {repo.private && <LockClosedIcon class="ml-2 w-4 h-4" />}
                    {repo.fork && <ForkIcon class="ml-2 w-4 h-4" />}
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
    </>
  )
}
