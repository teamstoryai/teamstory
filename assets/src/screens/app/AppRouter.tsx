import Router, { route } from 'preact-router'
import { useEffect } from 'preact/hooks'

import { paths } from '@/config'
import ProjectsList from '@/screens/app/ProjectsList'
import ProjectView from '@/screens/app/ProjectView'
import Settings from '@/screens/app/Settings'
import Dashboard from '@/screens/app/Dashboard'
import Reports from '@/screens/app/Reports'
import ProjectSetup from '@/screens/setup/ProjectSetup'

export default () => (
  <Router>
    <ProjectSetup path={paths.SETUP} />
    <Dashboard path={paths.DASHBOARD} />
    <Reports path={paths.LEARNING} />
    <Reports path={paths.PAST_WEEKS} />
    <Reports path={paths.PAST_MONTH} />
    <Reports path={paths.PAST_QUARTER} />
    <Reports path={paths.TEAM} />
    <Reports path={paths.ASK_TALLY} />
    <ProjectsList path={paths.PROJECTS} />
    <ProjectView path={paths.PROJECTS + '/:id'} />
    <Settings path={paths.SETTINGS} />
    <Redirect path={paths.APP + '/:anything'} to={paths.DASHBOARD} />
    <Redirect path={paths.APP} to={paths.DASHBOARD} />
  </Router>
)

const Redirect = ({ to }: { to: string; path: string }) => {
  useEffect(() => {
    route(to)
  }, [])
  return null
}
